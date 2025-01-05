/**
 * Search filtering utilities
 */
import type { Task } from '$lib/utils/types';

export function filterBySearchTerms(task: Task, searchTerms: string[]): boolean {
  const searchableText = [
    task.title,
    task.description,
    task.notes,
    ...(task.labels || [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  
  return searchTerms.every(term => searchableText.includes(term));
}

export function normalizeSearchTerms(query: string): string[] {
  return query.toLowerCase().split(' ').filter(Boolean);
}