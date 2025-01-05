/**
 * Task sorting utilities
 */
import type { Task } from '$lib/utils/types';

export function sortByOrder(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function sortByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => 
    (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)
  );
}

export function sortByCompletedDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => 
    (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
  );
}