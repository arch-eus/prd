import type { Task } from '$lib/types/task';

export interface TaskStoreState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface TaskStore {
  subscribe: (run: (value: TaskStoreState) => void) => () => void;
  init: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'status'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}