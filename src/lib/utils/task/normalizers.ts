import type { Task } from '$lib/types/task';
import { normalizeDate } from '../date/normalizers';

export function normalizeTask(task: Partial<Task>): Task {
  const now = new Date();
  return {
    id: task.id || crypto.randomUUID(),
    title: task.title || '',
    description: task.description,
    notes: task.notes,
    status: task.status || 'todo',
    labels: task.labels || [],
    dueDate: task.dueDate ? normalizeDate(task.dueDate) : undefined,
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    order: task.order || 0,
    createdAt: task.createdAt ? new Date(task.createdAt) : now,
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : now,
    recurrence: task.recurrence || null
  };
}