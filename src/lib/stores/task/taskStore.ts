/**
 * Task Store
 * 
 * Manages the application's task data using IndexedDB for persistence.
 * Provides methods for CRUD operations and task filtering.
 */

import { writable, derived } from 'svelte/store';
import type { Task } from '$lib/utils/types';
import { getTasks, saveTasks } from '$lib/utils/storage';
import { normalizeDate } from '$lib/utils/dateUtils';

interface State {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  tasks: [],
  loading: false,
  error: null
};

function createTaskStore() {
  const { subscribe, set, update } = writable<State>(initialState);

  return {
    subscribe,
    
    // Initialize store with data from IndexedDB
    async init() {
      update(state => ({ ...state, loading: true }));
      try {
        const tasks = await getTasks();
        set({ 
          tasks: tasks.map(normalizeTask), 
          loading: false, 
          error: null 
        });
      } catch (error) {
        console.error('Failed to initialize task store:', error);
        set({ 
          tasks: [], 
          loading: false, 
          error: 'Failed to load tasks' 
        });
      }
    },

    // Add a new task
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
    async deleteTask(id: string) {
      update(state => {
        const updatedTasks = state.tasks.filter(task => task.id !== id);
        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    }
  };
}

// Helper function to normalize task data
function normalizeTask(task: Partial<Task>): Task {
  return {
    id: task.id || crypto.randomUUID(),
    title: task.title || '',
    description: task.description,
    notes: task.notes,
    status: task.status || 'todo',
    labels: task.labels || [],
    dueDate: task.dueDate ? normalizeDate(task.dueDate) : undefined,
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    order: typeof task.order === 'number' ? task.order : 0,
    createdAt: new Date(task.createdAt || new Date()),
    updatedAt: new Date(task.updatedAt || new Date()),
    recurrence: task.recurrence || null
  };
}

export const taskStore = createTaskStore();