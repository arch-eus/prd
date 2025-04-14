/**
 * Task validation utilities
 */
import { isPastDate } from '../date/validators';
import type { Task } from '$lib/types/task';

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'completed') return false;
  return isPastDate(task.dueDate);
}

export function isTaskComplete(task: Task): boolean {
  return task.status === 'completed';
}

export function shouldMoveToToday(task: Task): boolean {
  return !task.completedAt && 
         task.dueDate && 
         isPastDate(task.dueDate);
}