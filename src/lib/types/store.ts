export interface TaskStoreState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface TaskStore {
  subscribe: (run: (value: TaskStoreState) => void) => () => void;
  init: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (taskId: string, newOrder: number) => Promise<void>;
}