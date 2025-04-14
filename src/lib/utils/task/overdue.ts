/**
 * Task overdue utilities
 */
import type { Task } from '$lib/types/task';
import { shouldMoveToToday } from './validators';
import { normalizeDate } from '../date/normalizers';
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

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

/**
 * Check if a task is overdue
 */
export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'completed') return false;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(task.dueDate);
  
  return dueDate < today;
}

/**
 * Get overdue information for a task
 */
export function getOverdueInfo(task: Task): { isOverdue: boolean; duration: string; } {
  if (!task.dueDate || task.status === 'completed') {
    return { isOverdue: false, duration: '' };
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(task.dueDate);
  
  if (dueDate >= today) {
    return { isOverdue: false, duration: '' };
  }
  
  // Calculate overdue duration in various units
  const days = differenceInDays(today, dueDate);
  const weeks = differenceInWeeks(today, dueDate);
  const months = differenceInMonths(today, dueDate);
  const years = differenceInYears(today, dueDate);
  
  // Format duration based on the most appropriate unit
  let duration = '';
  if (years > 0) {
    duration = `${years} ${years === 1 ? 'year' : 'years'}`;
  } else if (months > 0) {
    duration = `${months} ${months === 1 ? 'month' : 'months'}`;
  } else if (weeks > 0) {
    duration = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  } else if (days > 0) {
    duration = `${days} ${days === 1 ? 'day' : 'days'}`;
  }
  
  return { 
    isOverdue: true, 
    duration 
  };
}

/**
 * Get a formatted overdue label for a task
 */
export function getOverdueLabel(task: Task): string {
  const { isOverdue, duration } = getOverdueInfo(task);
  
  if (!isOverdue || !duration) return '';
  
  return `Overdue by ${duration}`;
}