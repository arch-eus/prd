import { derived } from 'svelte/store';
import { taskStore } from './taskStore';

export const allTagsStore = derived(taskStore, $store => {
  const tags = new Set<string>();
  $store.tasks.forEach(task => {
    task.labels?.forEach(label => tags.add(label));
  });
  return Array.from(tags).sort();
});