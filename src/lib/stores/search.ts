import { writable, derived } from 'svelte/store';
import { taskStore } from './task';
import { syncedTaskStore } from './synced-store';

export const searchQuery = writable('');

// Flag to indicate if search is active - helps prevent UI blocking
export const isSearchActive = writable(false);

// Enhanced search function that searches across all tasks
export const searchResults = derived(
  [syncedTaskStore, searchQuery, isSearchActive],
  ([$store, $query, $isActive]) => {
    // Log search activation for debugging
    if ($isActive && $query.trim()) {
      console.log('Search activated:', $query);
    }
    // Don't search if not active or query is empty
    const query = $query.trim();
    if (!query || !$isActive) return [];
    
    // Search through all tasks in the system
    const MAX_RESULTS = 50; // Increased limit for better search coverage
    
    const searchTerms = query.toLowerCase().split(' ');
    
    // Search through all tasks (both todo and completed)
    const results = $store.tasks
      .filter(task => {
        const searchableText = [
          task.title,
          task.description || '',
          task.notes || '',
          ...(task.labels || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      })
      // Sort completed tasks to the bottom, then by order/completion date
      .sort((a, b) => {
        // First sort by status
        if (a.status === 'todo' && b.status === 'completed') return -1;
        if (a.status === 'completed' && b.status === 'todo') return 1;
        
        // If both are completed, sort by completion date (most recent first)
        if (a.status === 'completed' && b.status === 'completed') {
          return (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0);
        }
        
        // If both are todo, sort by order
        return (a.order || 0) - (b.order || 0);
      })
      .slice(0, MAX_RESULTS); // Limit results for performance
    
    return results;
  }
);