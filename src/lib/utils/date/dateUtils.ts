import { isSameDay, parseISO, startOfDay } from 'date-fns';

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Normalizes a date value to ensure it's a valid Date object
 * Handles various input types and edge cases safely
 */
export function normalizeDate(date: Date | string | undefined | null): Date | undefined {
  if (!date) return undefined;
  
  try {
    // If it's a string, ensure we're parsing it correctly
    if (typeof date === 'string') {
      // Try to parse ISO string
      const parsedDate = parseISO(date);
      
      // Check if parsing resulted in a valid date
      if (isNaN(parsedDate.getTime())) {
        console.warn('Invalid date string format:', date);
        return undefined;
      }
      
      return startOfDay(parsedDate);
    }
    
    // If it's a Date object, make sure it's valid
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        console.warn('Invalid Date object:', date);
        return undefined;
      }
      
      return startOfDay(date);
    }
    
    // If it's neither a string nor a Date, return undefined
    console.warn('Unsupported date format:', date);
    return undefined;
    
  } catch (error) {
    console.error('Error normalizing date:', error);
    return undefined;
  }
}

/**
 * Converts a Date object to a string suitable for date input elements
 * Handles edge cases safely
 */
export function dateToInputValue(date: Date | undefined | null): string {
  if (!date) return '';
  
  try {
    // Ensure date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date for input:', date);
      return '';
    }
    
    // Format as YYYY-MM-DD
    return date.toISOString().split('T')[0];
    
  } catch (error) {
    console.error('Error converting date to input value:', error);
    return '';
  }
}