/**
 * Task recurrence utilities
 */
import { addDays, addMonths, addYears } from 'date-fns';
import type { Task, RecurrenceType } from '$lib/utils/types';

/**
 * Calculate the next due date for a recurring task
 */
export function getNextDueDate(task: Task): Date | undefined {
  if (!task.dueDate || !task.recurrence) return undefined;

  switch (task.recurrence) {
    case 'weekly':
      return addDays(task.dueDate, 7);
    case 'monthly':
      return addMonths(task.dueDate, 1);
    case 'quarterly':
      return addMonths(task.dueDate, 3);
    case 'yearly':
      return addYears(task.dueDate, 1);
    default:
      return task.dueDate;
  }
}

/**
 * Get a human-readable description of the recurrence pattern
 */
export function getRecurrenceText(recurrence: RecurrenceType): string {
  switch (recurrence) {
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    case 'quarterly':
      return 'Every 3 months';
    case 'yearly':
      return 'Yearly';
    default:
      return 'No recurrence';
  }
}

/**
 * Create a new task instance based on a recurring task
 */
export function createNextRecurrence(task: Task): Task {
  if (!task.recurrence || !task.dueDate) {
    throw new Error('Cannot create recurrence for a non-recurring task');
  }
  
  const nextDueDate = getNextDueDate(task);
  if (!nextDueDate) {
    throw new Error('Failed to calculate next due date');
  }
  
  return {
    ...task,
    id: crypto.randomUUID(),
    status: 'todo',
    dueDate: nextDueDate,
    completedAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}