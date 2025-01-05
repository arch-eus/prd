/**
 * Search functionality for tasks
 * 
 * Performs case-insensitive full text search across task fields:
 * - Task title
 * - Description
 * - Notes
 * - Labels/tags
 * 
 * Features:
 * - Multi-word search (all terms must match)
 * - Case insensitive matching
 * - Searches across all text fields
 * - Handles null/undefined fields
 */
import type { Task } from '$lib/types/task';

export function filterTasksBySearch(tasks: Task[], query: string): Task[] {
  // Skip processing for empty queries
  if (!query.trim()) return [];
  
  // Split query into individual search terms for multi-word search
  const searchTerms = query.toLowerCase().split(' ');
  
  return tasks.filter(task => {
    // Create searchable text by combining all text fields
    // Filter out null/undefined values before joining
    const searchableText = [
      task.title,
      task.description,
      task.notes,
      ...(task.labels || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    
    // Task matches only if it contains ALL search terms (AND search)
    return searchTerms.every(term => searchableText.includes(term));
  });
}