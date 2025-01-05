/**
 * Task recurrence utilities
 */
import { addMonths, addYears } from 'date-fns';
import type { Task, RecurrenceType } from '$lib/utils/types';

export function getNextDueDate(task: Task): Date | undefined {
  if (!task.dueDate || !task.recurrence) return undefined;

  switch (task.recurrence) {
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

export function getRecurrenceText(recurrence: RecurrenceType): string {
  switch (recurrence) {
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