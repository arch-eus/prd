/**
 * Task Store
 * 
 * Core store that manages the application's task data:
 * - Handles CRUD operations for tasks (Create, Read, Update, Delete)
 * - Persists data using IndexedDB for offline capability
 * - Normalizes task data structure for consistency
 * - Maintains task order and metadata
 * - Handles task status changes and completion dates
 */
import { writable } from 'svelte/store';
import type { Task } from '$lib/types/task';
import type { TaskStoreState } from './types';
import { getTasks, saveTasks } from '$lib/utils/storage';
import { normalizeTask } from './normalizers';

const initialState: TaskStoreState = {
  tasks: [],
  loading: false,
  error: null
};

function createTaskStore() {
  const { subscribe, set, update } = writable<TaskStoreState>(initialState);

  // Store methods for managing tasks
  return {
    subscribe,
    
    // Initialize store by loading tasks from IndexedDB storage
    // - Loads existing tasks
    // - Normalizes task data
    // - Handles error states
    async init() {
      update(state => ({ ...state, loading: true }));
      try {
        const tasks = await getTasks() || [];
        const normalizedTasks = tasks.map(normalizeTask);
        set({ tasks: normalizedTasks, loading: false, error: null });
      } catch (error) {
        console.error('Failed to initialize task store:', error);
        set({ ...initialState, error: 'Failed to load tasks' });
      }
    },

    // Add a new task
    // - Generates unique ID
    // - Sets creation timestamp
    // - Assigns order for sorting
    // - Persists to storage
    async addTask(task: Partial<Task>) {
      update(state => {
        const newTask = normalizeTask({
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          order: state.tasks.length
        });
        
        const updatedTasks = [...state.tasks, newTask];
        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    },
    
    // Update an existing task
    // - Preserves task ID and creation date
    // - Updates modification timestamp
    // - Maintains task order
    // - Persists changes
    async updateTask(id: string, updates: Partial<Task>) {
      update(state => {
        const updatedTasks = state.tasks.map(task =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        );
        
        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    },
    
    // Delete a task
    // - Removes task by ID
    // - Updates storage
    // - Maintains task list integrity
    async deleteTask(id: string) {
      update(state => {
        const updatedTasks = state.tasks.filter(task => task.id !== id);
        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    },
  };
}

export const taskStore = createTaskStore();