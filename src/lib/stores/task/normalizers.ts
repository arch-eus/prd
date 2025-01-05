import type { Task } from '$lib/types/task';
import { normalizeDate } from '$lib/utils/dateUtils';

export function normalizeTask(task: Task): Task {
  return {
    ...task,
    id: task.id || crypto.randomUUID(),
    dueDate: task.dueDate ? normalizeDate(task.dueDate) : undefined,
    createdAt: new Date(task.createdAt || new Date()),
    updatedAt: new Date(task.updatedAt || new Date()),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    labels: task.labels || [],
    status: task.status || 'todo',
    order: typeof task.order === 'number' ? task.order : 0
  };
}