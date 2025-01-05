/**
 * Task overdue utilities
 */
import type { Task } from '$lib/utils/types';
import { shouldMoveToToday } from './validators';
import { normalizeDate } from '../date/normalizers';

export function moveOverdueTasksToToday(tasks: Task[]): Task[] {
  const today = normalizeDate(new Date());
  
  return tasks.map(task => {
    if (shouldMoveToToday(task)) {
      return {
        ...task,
        dueDate: today
      };
    }
    return task;
  });
}