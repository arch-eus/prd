/**
 * Derived stores that provide filtered views of tasks based on:
 * - Selected date
 * - Selected tags
 * - Task status
 */
import { derived } from 'svelte/store';
import { taskStore } from './store';
import { selectedDate, selectedTags } from '../filters';
import { filterTasksByDate, filterTasksByTags } from './filters';

// Main filtered tasks store for todo items
export const filteredTasks = derived(
  [taskStore, selectedDate, selectedTags],
  ([$taskStore, $selectedDate, $selectedTags]) => {
    if (!$taskStore.tasks?.length) return [];
    
    // Start with only todo tasks
    let tasks = $taskStore.tasks.filter(t => t.status === 'todo');
    
    // Apply date filter if selected
    // Filter by date if selected
    if ($selectedDate) {
      tasks = filterTasksByDate(tasks, $selectedDate);
    }
    
    // Apply tag filter if any selected
    // Filter by tags if any selected
    if ($selectedTags.length > 0) {
      tasks = filterTasksByTags(tasks, $selectedTags);
    }

    // Sort by task order
    // Sort by order
    return tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
);

// Completed tasks store sorted by completion date
export const completedTasks = derived(taskStore, $store =>
  ($store.tasks || [])
    .filter(task => task.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
);