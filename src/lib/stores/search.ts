import { writable, derived } from 'svelte/store';
import { taskStore } from './task';

export const searchQuery = writable('');

export const searchResults = derived(
  [taskStore, searchQuery],
  ([$store, $query]) => {
    const query = $query.trim();
    if (!query) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return $store.tasks
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
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }
);