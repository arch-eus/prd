/**
 * Date formatting utilities
 */
import { format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

export function formatShortDate(date: Date): string {
  return format(date, 'MMM d');
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function formatInputDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}