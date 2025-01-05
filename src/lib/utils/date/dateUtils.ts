import { isSameDay, parseISO, startOfDay } from 'date-fns';

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function normalizeDate(date: Date | string | undefined): Date | undefined {
  if (!date) return undefined;
  return startOfDay(typeof date === 'string' ? parseISO(date) : date);
}

export function dateToInputValue(date: Date | undefined): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}