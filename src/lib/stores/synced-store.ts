/**
 * SyncedStore Implementation with Multi-User Support
 * 
 * This file provides a Yjs-based CRDT implementation using SyncedStore for Svelte
 * with added WebSocket support for real-time collaboration.
 */
import * as Y from 'yjs';
import { syncedStore, getYjsValue } from '@syncedstore/core';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { writable, derived, get } from 'svelte/store';
import type { Task } from '$lib/types/task';
import { normalizeTask } from '$lib/utils/task/normalizers';
import { getNextDueDate } from '$lib/utils/task/recurrence';

// Helper functions for date serialization
function serializeTask(task: Partial<Task>): any {
  // Create a serializable version of the task - create a new object to avoid reference issues
  const serialized = {
    id: task.id,
    title: task.title || '',
    description: task.description || null,
    notes: task.notes || null,
    status: task.status || 'todo',
    labels: task.labels ? [...task.labels] : [], // Make a copy to avoid references
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
    createdAt: task.createdAt ? task.createdAt.toISOString() : null,
    updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
    order: typeof task.order === 'number' ? task.order : 0,
    recurrence: task.recurrence || null
  };
  
  return serialized;
}

// Safe date parsing function
function parseDate(dateValue: any): Date | null {
  if (!dateValue) return null;
  
  // Handle existing Date objects
  if (dateValue instanceof Date) return new Date(dateValue.getTime()); // Create copy to avoid reference
  
  // Handle ISO strings
  if (typeof dateValue === 'string') {
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    } catch (e) {
      console.error("Error parsing date:", e);
      return null;
    }
  }
  
  // Handle invalid values
  console.warn("Invalid date value:", dateValue);
  return null;
}

function deserializeTask(taskData: any): Task {
  if (!taskData) return taskData;
  
  try {
    // Create a new object with date fields parsed
    return {
      id: String(taskData.id || ''),
      title: String(taskData.title || ''),
      description: taskData.description || null,
      notes: taskData.notes || null,
      status: String(taskData.status || 'todo'),
      labels: Array.isArray(taskData.labels) ? [...taskData.labels] : [], // Create copy
      dueDate: parseDate(taskData.dueDate),
      completedAt: parseDate(taskData.completedAt),
      createdAt: parseDate(taskData.createdAt) || new Date(),
      updatedAt: parseDate(taskData.updatedAt) || new Date(),
      order: Number(taskData.order || 0),
      recurrence: taskData.recurrence || null
    };
  } catch (error) {
    console.error("Error deserializing task:", error, taskData);
    // Return a minimal valid task to prevent app crashes
    return {
      id: String(taskData.id || crypto.randomUUID()),
      title: String(taskData.title || 'Untitled Task'),
      description: null,
      notes: null,
      status: 'todo',
      labels: [],
      dueDate: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: 0,
      recurrence: null
    };
  }
}

// Define our store type - we store serialized tasks
type SerializedTask = {
  id: string;
  title: string;
  description?: string | null;
  notes?: string | null;
  status: string;
  labels: string[];
  dueDate?: string | null;
  completedAt?: string | null;
  order: number;
  recurrence?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Define our store type
export type SyncedStoreType = {
  tasks: Array<any>; // Use any for maximum flexibility with stored data
};

// Create the synced store
export const store = syncedStore<SyncedStoreType>({ 
  tasks: [] 
});

// Initialize persistence providers
let indexedDBProvider: IndexeddbPersistence | null = null;
let websocketProvider: WebsocketProvider | null = null;

// Collaboration configuration (defaults)
const DEFAULT_ROOM = 'default-room';
const DEFAULT_SERVER = 'ws://localhost:1234';
const DEFAULT_USERNAME = 'Anonymous';

// Status store for connectivity
export const syncStatus = writable({
  connected: false,
  syncing: false,
  roomName: DEFAULT_ROOM,
  peers: 0,
  error: null as Error | null
});

// Collaboration configuration store
export const collaborationConfig = writable({
  enabled: false,
  serverUrl: DEFAULT_SERVER,
  roomName: DEFAULT_ROOM,
  username: DEFAULT_USERNAME
});

// Update collaboration settings
export function updateCollaborationConfig(config: Partial<{
  enabled: boolean,
  serverUrl: string,
  roomName: string,
  username: string
}>) {
  collaborationConfig.update(current => ({
    ...current,
    ...config
  }));
  
  // If we're already initialized, reconnect with new config
  const currentConfig = get(collaborationConfig);
  if (currentConfig.enabled && websocketProvider) {
    disconnectWebsocket();
    
    // Wait a bit before reconnecting
    setTimeout(() => {
      const ydoc = getYjsValue(store) as Y.Doc;
      connectWebsocket(ydoc, currentConfig.serverUrl, currentConfig.roomName, currentConfig.username);
    }, 500);
  }
}

// Connect to the WebSocket server
function connectWebsocket(
  ydoc: Y.Doc, 
  serverUrl: string = DEFAULT_SERVER, 
  roomName: string = DEFAULT_ROOM,
  username: string = DEFAULT_USERNAME
) {
  try {
    // Create a WebSocket connection to the server
    websocketProvider = new WebsocketProvider(
      serverUrl,
      `taskManager/${roomName}`,
      ydoc,
      { connect: true }
    );
    
    // Set awareness (shows who is editing)
    websocketProvider.awareness.setLocalStateField('user', {
      name: username,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
    });
    
    // Update status when connection changes
    websocketProvider.on('status', (event: { status: string }) => {
      syncStatus.update(state => ({
        ...state,
        connected: event.status === 'connected',
        syncing: event.status === 'connecting',
        roomName
      }));
      
      console.log(`WebSocket status: ${event.status}`);
    });
    
    // Update the number of connected peers
    websocketProvider.awareness.on('change', () => {
      const peers = websocketProvider ? websocketProvider.awareness.getStates().size : 0;
      syncStatus.update(state => ({
        ...state,
        peers: Math.max(0, peers - 1) // Subtract self
      }));
    });
    
    // Handle errors
    websocketProvider.on('connection-error', (error: Error) => {
      console.error('WebSocket connection error:', error);
      syncStatus.update(state => ({
        ...state,
        error
      }));
    });
    
    return websocketProvider;
  } catch (error) {
    console.error('Failed to connect to WebSocket server:', error);
    syncStatus.update(state => ({
      ...state,
      connected: false,
      error: error instanceof Error ? error : new Error(String(error))
    }));
    return null;
  }
}

// Disconnect from the WebSocket server
function disconnectWebsocket() {
  if (websocketProvider) {
    try {
      websocketProvider.disconnect();
      websocketProvider.destroy();
      websocketProvider = null;
      
      syncStatus.update(state => ({
        ...state,
        connected: false,
        syncing: false,
        peers: 0
      }));
    } catch (error) {
      console.error('Error disconnecting WebSocket:', error);
    }
  }
}

// Clear IndexedDB data - useful for testing or resetting
export async function clearSyncedStore() {
  try {
    disconnectWebsocket();
    
    if (indexedDBProvider) {
      await indexedDBProvider.destroy();
      indexedDBProvider = null;
    }
    
    // Clear the IndexedDB database
    const req = indexedDB.deleteDatabase('taskManager');
    
    return new Promise<void>((resolve, reject) => {
      req.onsuccess = () => {
        console.log("IndexedDB database deleted successfully");
        resolve();
      };
      
      req.onerror = () => {
        console.error("Couldn't delete IndexedDB database");
        reject(new Error("Failed to delete database"));
      };
    });
  } catch (error) {
    console.error("Error clearing synced store:", error);
    throw error;
  }
}

// Initialize the store with persistence
export async function initSyncedStore() {
  try {
    // Get the underlying Yjs document
    const ydoc = getYjsValue(store) as Y.Doc;
    
    // Set up IndexedDB persistence first
    indexedDBProvider = new IndexeddbPersistence('taskManager', ydoc);
    
    // Update sync status based on IndexedDB connection events
    indexedDBProvider.on('synced', () => {
      syncStatus.update(state => ({
        ...state,
        syncing: false,
        error: null
      }));
      console.log("IndexedDB synchronized successfully");
    });
    
    // Listen for sync errors
    indexedDBProvider.on('error', (err) => {
      console.error('IndexedDB sync error:', err);
      syncStatus.update(state => ({
        ...state,
        error: err 
      }));
    });
    
    // Set up WebSocket connection if enabled
    const config = get(collaborationConfig);
    if (config.enabled) {
      connectWebsocket(ydoc, config.serverUrl, config.roomName, config.username);
    }
    
    // Wait for the initial IndexedDB sync to complete
    return new Promise<void>((resolve) => {
      indexedDBProvider?.on('synced', () => {
        resolve();
      });
      
      // Resolve after a timeout in case sync doesn't happen immediately
      setTimeout(resolve, 1000);
    });
  } catch (error) {
    console.error('Failed to initialize store:', error);
    syncStatus.update(state => ({
      ...state,
      connected: false,
      syncing: false,
      error: error instanceof Error ? error : new Error(String(error))
    }));
    throw error;
  }
}

// Create a Svelte-friendly task store
function createTaskStore() {
  // Create the base store
  const { subscribe } = derived(
    [syncStatus, collaborationConfig],
    ([$status, $config], set) => {
      try {
        // Set initial state with safe deserialization
        const tasks = Array.from(store.tasks || []).map(taskData => {
          try {
            return deserializeTask(taskData);
          } catch (e) {
            console.error("Error deserializing task:", e, taskData);
            return null;
          }
        }).filter(Boolean); // Remove any failed conversions
        
        set({
          tasks,
          loading: $status.syncing,
          error: $status.error,
          collaboration: {
            enabled: $config.enabled,
            connected: $status.connected,
            roomName: $status.roomName,
            peers: $status.peers
          }
        });
      } catch (e) {
        console.error("Error in taskStore derived value:", e);
        set({
          tasks: [],
          loading: false,
          error: e instanceof Error ? e : new Error(String(e)),
          collaboration: {
            enabled: $config.enabled,
            connected: false,
            roomName: $status.roomName,
            peers: 0
          }
        });
      }
      
      // Observe changes to the tasks array
      const observer = () => {
        try {
          const tasks = Array.from(store.tasks || []).map(taskData => {
            try {
              return deserializeTask(taskData);
            } catch (e) {
              console.error("Error in observer deserializing task:", e, taskData);
              return null;
            }
          }).filter(Boolean);
          
          set({
            tasks,
            loading: $status.syncing,
            error: $status.error,
            collaboration: {
              enabled: $config.enabled,
              connected: $status.connected,
              roomName: $status.roomName,
              peers: $status.peers
            }
          });
        } catch (e) {
          console.error("Error in observer:", e);
          set({
            tasks: [],
            loading: false,
            error: e instanceof Error ? e : new Error(String(e)),
            collaboration: {
              enabled: $config.enabled,
              connected: false,
              roomName: $status.roomName,
              peers: 0
            }
          });
        }
      };
      
      try {
        // Get the underlying Yjs array
        const yarray = getYjsValue(store.tasks);
        
        // Add observer
        yarray.observe(observer);
        
        // Return cleanup function
        return () => {
          try {
            yarray.unobserve(observer);
          } catch (e) {
            console.error("Error cleaning up observer:", e);
          }
        };
      } catch (e) {
        console.error("Error setting up observer:", e);
        return () => {};
      }
    },
    { 
      tasks: [], 
      loading: true, 
      error: null, 
      collaboration: {
        enabled: false,
        connected: false,
        roomName: DEFAULT_ROOM,
        peers: 0
      }
    }
  );
  
  // Return the store with CRUD operations
  return {
    subscribe,
    
    async init() {
      try {
        await initSyncedStore();
      } catch (e) {
        console.error("Error initializing synced store:", e);
        // Continue anyway to provide at least in-memory functionality
      }
    },
    
    async reset() {
      try {
        await clearSyncedStore();
        await initSyncedStore();
      } catch (e) {
        console.error("Error resetting synced store:", e);
      }
    },
    
    // Connect/disconnect from collaboration server
    enableCollaboration(enabled: boolean, serverUrl?: string, roomName?: string, username?: string) {
      updateCollaborationConfig({
        enabled,
        ...(serverUrl && { serverUrl }),
        ...(roomName && { roomName }),
        ...(username && { username })
      });
      
      // If we're changing to enabled and we're already initialized
      if (enabled && indexedDBProvider) {
        const ydoc = getYjsValue(store) as Y.Doc;
        const config = get(collaborationConfig);
        connectWebsocket(ydoc, config.serverUrl, config.roomName, config.username);
      } else if (!enabled) {
        disconnectWebsocket();
      }
    },
    
    addTask(task: Partial<Task>) {
      try {
        // Create a completely new task object with no shared references
        const taskData = JSON.parse(JSON.stringify(task));
        const now = new Date();
        
        const newTask = normalizeTask({
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          order: store.tasks?.length || 0
        });
        
        // Serialize the task for storage in CRDT
        const serializedTask = serializeTask(newTask);
        
        // Use push which is well-supported in Yjs
        store.tasks.push(serializedTask);
        return newTask;
      } catch (e) {
        console.error("Error adding task:", e);
        throw e;
      }
    },
    
    updateTask(id: string, updates: Partial<Task>) {
      try {
        // Find the task index without copying objects (to avoid reusing references)
        let taskIndex = -1;
        for (let i = 0; i < store.tasks.length; i++) {
          if (store.tasks[i].id === id) {
            taskIndex = i;
            break;
          }
        }
        
        if (taskIndex !== -1) {
          // Get the raw data without maintaining references
          const rawTaskData = JSON.parse(JSON.stringify(store.tasks[taskIndex]));
          
          // Create a fresh task object
          const currentTask = deserializeTask(rawTaskData);
          
          // Create update data with new Date objects to avoid any reference reuse
          const updateData = JSON.parse(JSON.stringify(updates));
          
          // Create a completely new object with the updates
          const updatedTask = {
            ...currentTask,
            ...updateData,
            updatedAt: new Date(),
            // Ensure specific fields are properly set for completion
            ...(updates.status === 'completed' ? { 
              completedAt: new Date() 
            } : {})
          };
          
          // Create a brand new serialized object
          const serializedTask = serializeTask(updatedTask);
          
          // Create a fresh array with all tasks except the one we're updating
          const updatedTasks = [];
          for (let i = 0; i < store.tasks.length; i++) {
            if (i !== taskIndex) {
              updatedTasks.push(JSON.parse(JSON.stringify(store.tasks[i])));
            } else {
              updatedTasks.push(serializedTask);
            }
          }
          
          // Replace the entire array with completely new objects
          store.tasks.splice(0, store.tasks.length);
          for (const task of updatedTasks) {
            store.tasks.push(task);
          }
          
          return updatedTask;
        }
        return null;
      } catch (e) {
        console.error("Error updating task:", e, id, updates);
        throw e;
      }
    },
    
    // Complete a task, handling recurrence if needed
    completeTask(id: string) {
      try {
        // Find the task index without copying objects
        let taskIndex = -1;
        for (let i = 0; i < store.tasks.length; i++) {
          if (store.tasks[i].id === id) {
            taskIndex = i;
            break;
          }
        }
        
        if (taskIndex === -1) return null;
        
        // Get the raw data without maintaining references
        const rawTaskData = JSON.parse(JSON.stringify(store.tasks[taskIndex]));
        
        // Create a fresh task object
        const task = deserializeTask(rawTaskData);
        const now = new Date();
        
        // Mark the existing task as completed
        const completedTask = {
          id: task.id,
          title: task.title,
          description: task.description,
          notes: task.notes,
          status: 'completed',
          labels: [...(task.labels || [])],
          dueDate: task.dueDate ? new Date(task.dueDate.getTime()) : null,
          completedAt: now,
          order: task.order,
          recurrence: task.recurrence,
          createdAt: task.createdAt ? new Date(task.createdAt.getTime()) : new Date(),
          updatedAt: now
        };
        
        // Create a brand new serialized object
        const serializedCompletedTask = serializeTask(completedTask);
        
        // Prepare for task array update
        const freshTasks = [];
        
        // Add all tasks except the completed one
        for (let i = 0; i < store.tasks.length; i++) {
          if (i !== taskIndex) {
            // Deep clone to avoid reference issues
            freshTasks.push(JSON.parse(JSON.stringify(store.tasks[i])));
          } else {
            // Add our newly created completed task
            freshTasks.push(serializedCompletedTask);
          }
        }
        
        // For recurring tasks, create the next instance
        if (task.recurrence && task.dueDate) {
          try {
            const nextDueDate = getNextDueDate(task);
            if (nextDueDate) {
              // Create a completely new object
              const newTask = {
                id: crypto.randomUUID(),
                title: task.title,
                description: task.description,
                notes: task.notes,
                status: 'todo',
                labels: [...(task.labels || [])],
                dueDate: nextDueDate,
                completedAt: null,
                order: task.order,
                recurrence: task.recurrence,
                createdAt: now,
                updatedAt: now
              };
              
              // Serialize the new recurring task
              const serializedNewTask = serializeTask(newTask);
              freshTasks.push(serializedNewTask);
            }
          } catch (error) {
            console.error('Failed to create next recurring task', error);
          }
        }
        
        // Replace the entire array with all new objects
        store.tasks.splice(0, store.tasks.length);
        for (const task of freshTasks) {
          store.tasks.push(task);
        }
        
        return completedTask;
      } catch (e) {
        console.error("Error completing task:", e, id);
        throw e;
      }
    },
    
    deleteTask(id: string) {
      try {
        // Create a fresh array excluding the task to delete
        const freshTasks = [];
        let found = false;
        
        // Manually iterate to avoid any reference issues
        for (let i = 0; i < store.tasks.length; i++) {
          if (store.tasks[i].id !== id) {
            // Deep clone to avoid reference issues
            freshTasks.push(JSON.parse(JSON.stringify(store.tasks[i])));
          } else {
            found = true;
          }
        }
        
        if (found) {
          // Replace the entire array with all new objects
          store.tasks.splice(0, store.tasks.length);
          for (const task of freshTasks) {
            store.tasks.push(task);
          }
          return true;
        }
        return false;
      } catch (e) {
        console.error("Error deleting task:", e);
        throw e;
      }
    },
    
    // Clean up resources
    destroy() {
      disconnectWebsocket();
      
      if (indexedDBProvider) {
        try {
          indexedDBProvider.destroy();
        } catch (e) {
          console.error("Error destroying IndexedDB persistence:", e);
        }
        indexedDBProvider = null;
      }
    }
  };
}

// Export the task store singleton
export const syncedTaskStore = createTaskStore();