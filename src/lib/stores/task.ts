import { writable, derived } from 'svelte/store';
import type { Task } from '$lib/types/task';
import { getTasks, saveTasks } from '$lib/utils/storage';
import { normalizeTask } from '$lib/utils/task/normalizers';
import { selectedDate, selectedTags } from './filters';

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
    
    async init() {
      update(state => ({ ...state, loading: true }));
      try {
        const tasks = await getTasks() || [];
        set({ 
          tasks: tasks.map(normalizeTask), 
          loading: false, 
          error: null 
        });
      } catch (error) {
        console.error('Failed to initialize task store:', error);
        set({ tasks: [], loading: false, error: 'Failed to load tasks' });
      }
    },

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

    async deleteTask(id: string) {
      update(state => {
        const updatedTasks = state.tasks.filter(task => task.id !== id);
        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    }
  };
}

export const taskStore = createTaskStore();

// Derived stores
export const filteredTasks = derived(
  [taskStore, selectedDate, selectedTags],
  ([$store, $date, $tags]) => {
    if (!$store.tasks?.length) return [];
    let tasks = $store.tasks;
    
    if ($date) {
      const startOfDay = new Date($date);
      startOfDay.setHours(0, 0, 0, 0);
      
      // For past dates, show completed tasks from that day
      if (startOfDay < new Date(new Date().setHours(0, 0, 0, 0))) {
        tasks = tasks.filter(t => 
          t.status === 'completed' && 
          t.completedAt && 
          new Date(t.completedAt).toDateString() === startOfDay.toDateString()
        );
      } else {
        // For today and future dates, show todo tasks due on that day
        tasks = tasks.filter(t => 
          t.status === 'todo' && 
          t.dueDate && 
          new Date(t.dueDate).toDateString() === startOfDay.toDateString()
        );
      }
    }

    if ($tags.length) {
      tasks = tasks.filter(t => 
        t.labels?.some(label => $tags.includes(label))
      );
    }

    return tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
);

export const completedTasks = derived(taskStore, $store =>
  ($store.tasks || [])
    .filter(task => task.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
);