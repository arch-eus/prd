import { isSameDay, parseISO, startOfDay } from 'date-fns';

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getTodayClass(date: Date): string {
  return isToday(date) ? 'text-navy-600 dark:text-navy-400 font-bold' : '';
}

export function normalizeDate(date: Date | string | undefined | null): Date | undefined {
  if (!date) return undefined;
  
  try {
    // If it's a string, ensure we're parsing it correctly
    if (typeof date === 'string') {
      // For YYYY-MM-DD format from input[type="date"], append time to ensure correct date
      if (date.length === 10) {
        date = `${date}T12:00:00`;
      }
      
      const parsedDate = parseISO(date);
      
      // Check if parsing was successful (valid date)
      if (isNaN(parsedDate.getTime())) {
        console.warn('Invalid date string:', date);
        return undefined;
      }
      
      return startOfDay(parsedDate);
    }
    
    // If it's a Date object, make sure it's valid
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        console.warn('Invalid Date object');
        return undefined;
      }
      
      return startOfDay(date);
    }
    
    // Unknown type, try to convert to Date as a fallback
    console.warn('Unknown date type:', typeof date);
    const fallbackDate = new Date(date as any);
    
    // Check if conversion was successful
    if (isNaN(fallbackDate.getTime())) {
      return undefined;
    }
    
    return startOfDay(fallbackDate);
  } catch (error) {
    console.error('Error normalizing date:', error);
    return undefined;
  }
}

export function dateToInputValue(date: Date | undefined | null): string {
  if (!date) return '';
  
  try {
    // Verify that the date is valid
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('Invalid date passed to dateToInputValue:', date);
      return '';
    }
    
    // Format date to YYYY-MM-DD for input[type="date"]
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}