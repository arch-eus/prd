import { writable, derived } from 'svelte/store';
import type { Task, NewTask, TaskUpdate } from '$lib/types/task';
import type { Status } from '$lib/types/common';
import { TASK_STATUS } from '$lib/constants/task';
import { getTasks, saveTasks } from '$lib/utils/storage/taskStorage';
import { normalizeDate } from '$lib/utils/date/dateUtils';

interface State {
  tasks: Task[];
  status: Status;
  error: string | null;
}

const initialState: State = {
  tasks: [],
  status: 'idle',
  error: null
};

function createTaskStore() {
  const { subscribe, set, update } = writable<State>(initialState);

  return {
    subscribe,
    
    async init() {
      update(state => ({ ...state, status: 'loading' }));
      try {
        const tasks = await getTasks();
        const normalizedTasks = tasks.map(normalizeTaskDates);
        set({ tasks: normalizedTasks, status: 'success', error: null });
      } catch (error) {
        update(state => ({
          ...state,
          status: 'error',
          error: 'Failed to load tasks'
        }));
      }
    },

    async addTask(task: NewTask) {
      update(state => {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          order: state.tasks.length,
          dueDate: task.dueDate ? normalizeDate(task.dueDate) : undefined
        };
        
        const updatedTasks = [...state.tasks, newTask];
        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    },

    async updateTask(id: string, updates: TaskUpdate) {
      update(state => {
        const updatedTasks = state.tasks.map(task =>
          task.id === id
            ? { 
                ...task, 
                ...updates,
                updatedAt: new Date(),
                dueDate: updates.dueDate ? normalizeDate(updates.dueDate) : task.dueDate
              }
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
    },

    async reorderTasks(taskId: string, newOrder: number) {
      update(state => {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return state;

        const oldOrder = task.order;
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, order: newOrder };
          }
          if (newOrder > oldOrder && t.order <= newOrder && t.order > oldOrder) {
            return { ...t, order: t.order - 1 };
          }
          if (newOrder < oldOrder && t.order >= newOrder && t.order < oldOrder) {
            return { ...t, order: t.order + 1 };
          }
          return t;
        });

        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    }
  };
}

function normalizeTaskDates(task: Task): Task {
  return {
    ...task,
    dueDate: task.dueDate ? normalizeDate(task.dueDate) : undefined,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined
  };
}

export const taskStore = createTaskStore();

export const todoTasks = derived(taskStore, $store => 
  $store.tasks
    .filter(task => task.status === TASK_STATUS.TODO)
    .sort((a, b) => a.order - b.order)
);

export const completedTasks = derived(taskStore, $store =>
  $store.tasks
    .filter(task => task.status === TASK_STATUS.COMPLETED)
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
);