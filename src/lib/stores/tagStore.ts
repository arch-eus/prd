/**
 * Tag Store
 * 
 * Centralized store for managing tags across the application
 */
import { derived } from 'svelte/store';
import { taskStore } from './task';

// Get all unique tags from tasks
export const allTags = derived(taskStore, $store => {
  const tags = new Set<string>();
  
  $store.tasks.forEach(task => {
    task.labels?.forEach(label => tags.add(label));
  });
  
  return Array.from(tags).sort();
});

// For backward compatibility
export const allTagsStore = allTags;

// Get tag counts for usage stats
export const tagCounts = derived(taskStore, $store => {
  const counts: Record<string, number> = {};
  
  $store.tasks.forEach(task => {
    task.labels?.forEach(label => {
      counts[label] = (counts[label] || 0) + 1;
    });
  });
  
  return counts;
});

// Get most used tags (for suggestions)
export const popularTags = derived(tagCounts, $counts => {
  return Object.entries($counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
});