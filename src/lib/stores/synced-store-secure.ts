/**
 * SyncedStore Implementation with End-to-End Encryption
 * 
 * This file provides a Yjs-based CRDT implementation using SyncedStore for Svelte
 * with added WebSocket support for real-time collaboration and E2E encryption.
 */
import * as Y from 'yjs';
import { syncedStore, getYjsValue } from '@syncedstore/core';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { writable, derived, get } from 'svelte/store';
import type { Task } from '$lib/types/task';
import { normalizeTask } from '$lib/utils/task/normalizers';
import { currentMnemonic, roomId, mnemonicCrypto, deriveRoomId } from '$lib/utils/mnemonic-manager';

// Define our store type for encrypted tasks
export type SyncedStoreType = {
  encryptedTasks: Array<any>; // Contains encrypted task objects
};

// Create the synced store
export const store = syncedStore<SyncedStoreType>({ 
  encryptedTasks: [] 
});

// Initialize persistence providers
let indexedDBProvider: IndexeddbPersistence | null = null;
let websocketProvider: WebsocketProvider | null = null;

// Default configuration for WebSocket server
const DEFAULT_SERVER = 'wss://your-websocket-server.com'; // Change to actual WSS server in production

// Status store for connectivity
export const syncStatus = writable({
  connected: false,
  syncing: false,
  roomId: '',
  peers: 0,
  error: null as Error | null
});

// Collaboration configuration store (only server URL is configurable now)
export const collaborationConfig = writable({
  enabled: true, // Enabled by default with E2E encryption
  serverUrl: DEFAULT_SERVER
});

// Update collaboration settings (now just the server URL)
export function updateCollaborationConfig(config: Partial<{
  enabled: boolean, // Keep for compatibility, but always true
  serverUrl: string,
}>) {
  collaborationConfig.update(current => ({
    ...current,
    ...config
  }));
  
  // If we're already initialized, reconnect with new config
  const currentConfig = get(collaborationConfig);
  if (websocketProvider) {
    disconnectWebsocket();
    
    // Wait a bit before reconnecting
    setTimeout(async () => {
      const ydoc = getYjsValue(store) as Y.Doc;
      const mnemonicValue = get(currentMnemonic);
      if (mnemonicValue) {
        const roomIdValue = await deriveRoomId(mnemonicValue);
        connectWebsocket(ydoc, roomIdValue, currentConfig.serverUrl);
      }
    }, 500);
  }
}

// Connect to the WebSocket server using provided room ID
function connectWebsocket(
  ydoc: Y.Doc,
  roomIdValue: string,
  serverUrl: string = DEFAULT_SERVER
) {
  if (!roomIdValue) {
    console.error('Cannot connect to WebSocket: No room ID provided');
    return null;
  }
  
  try {
    // Create a WebSocket connection to the server using the derived room ID
    websocketProvider = new WebsocketProvider(
      serverUrl,
      `taskManager/${roomIdValue}`, // Room ID is derived from mnemonic
      ydoc,
      { connect: true }
    );
    
    // Set awareness with anonymous data (no identifying info)
    websocketProvider.awareness.setLocalStateField('user', {
      color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color only
    });
    
    // Update status when connection changes
    websocketProvider.on('status', (event: { status: string }) => {
      syncStatus.update(state => ({
        ...state,
        connected: event.status === 'connected',
        syncing: event.status === 'connecting',
        roomId: roomIdValue
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
    
    // Set up WebSocket connection if we have a mnemonic
    const mnemonicValue = get(currentMnemonic);
    if (mnemonicValue) {
      const roomIdValue = await deriveRoomId(mnemonicValue);
      const config = get(collaborationConfig);
      connectWebsocket(ydoc, roomIdValue, config.serverUrl);
      
      // Update the room ID in the sync status
      syncStatus.update(state => ({
        ...state,
        roomId: roomIdValue
      }));
    }
    
    // Subscribe to mnemonic changes to update the room connection
    const unsubscribeMnemonic = currentMnemonic.subscribe(async (newMnemonic) => {
      if (newMnemonic) {
        // Mnemonic changed, reconnect to WebSocket with new room
        disconnectWebsocket();
        const roomIdValue = await deriveRoomId(newMnemonic);
        const config = get(collaborationConfig);
        connectWebsocket(ydoc, roomIdValue, config.serverUrl);
        
        // Update the room ID in the sync status
        syncStatus.update(state => ({
          ...state,
          roomId: roomIdValue
        }));
      }
    });
    
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

// Handle decryption of tasks with graceful error handling
async function decryptEncryptedTasks(encryptedTasks: any[]): Promise<Task[]> {
  // Skip decryption if we don't have a mnemonic yet
  if (!get(currentMnemonic)) {
    return [];
  }
  
  // Process tasks sequentially to avoid overwhelming the crypto API
  const decryptedTasks: Task[] = [];
  
  for (const encryptedTask of encryptedTasks) {
    try {
      const task = await mnemonicCrypto.decryptTask(encryptedTask);
      if (task) {
        decryptedTasks.push(task);
      }
    } catch (e) {
      console.warn("Couldn't decrypt task, wrong mnemonic?", e);
    }
  }
  
  return decryptedTasks;
}

// Create a Svelte-friendly task store
function createTaskStore() {
  // Create a store for decrypted tasks
  const decryptedTasksStore = writable<{
    tasks: Task[];
    loading: boolean;
    error: Error | null;
  }>({
    tasks: [],
    loading: true,
    error: null
  });
  
  // Set up synchronization with the CRDT store
  let observer: () => void;
  
  // Process tasks whenever the store or mnemonic changes
  async function processEncryptedTasks() {
    try {
      decryptedTasksStore.update(state => ({ ...state, loading: true }));
      
      const encryptedTasks = Array.from(store.encryptedTasks || []);
      const decryptedTasks = await decryptEncryptedTasks(encryptedTasks);
      
      decryptedTasksStore.set({
        tasks: decryptedTasks,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("Error processing encrypted tasks:", error);
      decryptedTasksStore.update(state => ({
        ...state,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error))
      }));
    }
  }
  
  // Set up observer for CRDT changes
  function setupObserver() {
    try {
      // Remove previous observer if exists
      if (observer) {
        try {
          const yarray = getYjsValue(store.encryptedTasks);
          yarray.unobserve(observer);
        } catch (e) {
          console.warn("Error removing observer:", e);
        }
      }
      
      // Create new observer
      observer = () => {
        processEncryptedTasks();
      };
      
      // Attach observer to Yjs array
      const yarray = getYjsValue(store.encryptedTasks);
      yarray.observe(observer);
      
      // Initial processing
      processEncryptedTasks();
    } catch (error) {
      console.error("Error setting up observer:", error);
    }
  }
  
  // Subscribe to mnemonic changes
  currentMnemonic.subscribe(() => {
    processEncryptedTasks();
  });
  
  // The public store interface will combine our decrypted tasks with sync status
  const { subscribe } = derived(
    [decryptedTasksStore, syncStatus, currentMnemonic],
    ([$tasks, $status, $mnemonic]) => {
      return {
        tasks: $tasks.tasks,
        loading: $tasks.loading || $status.syncing,
        error: $tasks.error || $status.error,
        mnemonic: $mnemonic ? {
          isSet: true,
          roomId: $status.roomId,
          roomParticipants: $status.peers
        } : { 
          isSet: false,
          roomId: '',
          roomParticipants: 0
        }
      };
    }
  );
  
  // Return the store with CRUD operations
  return {
    subscribe,
    
    async init() {
      try {
        await initSyncedStore();
        setupObserver();
      } catch (e) {
        console.error("Error initializing synced store:", e);
        // Continue anyway to provide at least in-memory functionality
      }
    },
    
    async reset() {
      try {
        await clearSyncedStore();
        await initSyncedStore();
        setupObserver();
      } catch (e) {
        console.error("Error resetting synced store:", e);
      }
    },
    
    // Connect/disconnect from collaboration server
    updateServerUrl(serverUrl: string) {
      updateCollaborationConfig({ serverUrl });
    },
    
    async addTask(task: Partial<Task>) {
      try {
        // Ensure we have a mnemonic
        if (!get(currentMnemonic)) {
          throw new Error("Cannot add task: No mnemonic set");
        }
        
        // Create new task object
        const newTask = normalizeTask({
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          order: store.encryptedTasks?.length || 0
        });
        
        // Encrypt the task before storing in CRDT
        const encryptedTask = await mnemonicCrypto.encryptTask(newTask);
        store.encryptedTasks.push(encryptedTask);
        return newTask;
      } catch (e) {
        console.error("Error adding task:", e);
        throw e;
      }
    },
    
    async updateTask(id: string, updates: Partial<Task>) {
      try {
        // Ensure we have a mnemonic
        if (!get(currentMnemonic)) {
          throw new Error("Cannot update task: No mnemonic set");
        }
        
        // Find the task to update
        const index = store.encryptedTasks.findIndex(t => t.id === id);
        if (index === -1) return null;
        
        // Get the current task by decrypting it
        const encryptedTask = store.encryptedTasks[index];
        const currentTask = await mnemonicCrypto.decryptTask(encryptedTask);
        
        // Create a new object with the updates
        const updatedTask = {
          ...currentTask,
          ...JSON.parse(JSON.stringify(updates)), // Deep clone to avoid reference issues
          updatedAt: new Date(),
          // Ensure specific fields are properly set for completion
          ...(updates.status === 'completed' ? { 
            completedAt: new Date() 
          } : {})
        };
        
        // Encrypt the updated task
        const newEncryptedTask = await mnemonicCrypto.encryptTask(updatedTask);
        
        // For CRDT libraries, it's safer to remove and add rather than splice
        store.encryptedTasks.delete(index);
        store.encryptedTasks.insert(index, [newEncryptedTask]);
        
        return updatedTask;
      } catch (e) {
        console.error("Error updating task:", e, id, updates);
        throw e;
      }
    },
    
    deleteTask(id: string) {
      try {
        const index = store.encryptedTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          store.encryptedTasks.delete(index);
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
      
      if (observer) {
        try {
          const yarray = getYjsValue(store.encryptedTasks);
          yarray.unobserve(observer);
        } catch (e) {
          console.warn("Error removing observer:", e);
        }
      }
    }
  };
}

// Export the task store singleton
export const secureTaskStore = createTaskStore();