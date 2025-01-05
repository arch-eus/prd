/**
 * Date validation utilities
 */
import { isSameDay, isBefore, isAfter, startOfDay } from 'date-fns';

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isPastDate(date: Date): boolean {
  return isBefore(date, startOfDay(new Date()));
}

export function isFutureDate(date: Date): boolean {
  return isAfter(date, startOfDay(new Date()));
}