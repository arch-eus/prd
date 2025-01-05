import { isSameDay, parseISO, startOfDay } from 'date-fns';

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getTodayClass(date: Date): string {
  return isToday(date) ? 'text-navy-600 dark:text-navy-400 font-bold' : '';
}

export function normalizeDate(date: Date | string | undefined): Date | undefined {
  if (!date) return undefined;
  
  const today = startOfDay(new Date());
  
  // If it's a string, ensure we're parsing it correctly
  if (typeof date === 'string') {
    // For YYYY-MM-DD format from input[type="date"], append time to ensure correct date
    if (date.length === 10) {
      date = `${date}T12:00:00`;
    }
    return startOfDay(parseISO(date));
  }
  
  return startOfDay(date);
}

export function dateToInputValue(date: Date | undefined | null): string {
  if (!date) return '';
  
  // Format date to YYYY-MM-DD for input[type="date"]
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}