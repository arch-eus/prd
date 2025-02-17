import type { Task } from '$lib/types/task';
import { normalizeDate } from '$lib/utils/date/normalizers';

export function normalizeTask(task: Partial<Task>): Task {
  const now = new Date();
  const dueDate = task.dueDate ? normalizeDate(task.dueDate) : normalizeDate(now);
  const isPastDue = dueDate < now;

  return {
    id: task.id || crypto.randomUUID(),
    title: task.title || '',
    description: task.description,
    notes: task.notes,
    status: task.status || (isPastDue ? 'completed' : 'todo'),
    labels: task.labels || [],
    dueDate,
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    order: task.order || 0,
    createdAt: task.createdAt ? new Date(task.createdAt) : now,
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : now,
    recurrence: task.recurrence || null
  };
}