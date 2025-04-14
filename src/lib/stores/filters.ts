import { writable } from 'svelte/store';

// Create a custom store for selectedTags with debugging
function createTagStore() {
  const { subscribe, set, update } = writable<string[]>([]);
  
  return {
    subscribe,
    set: (tags: string[]) => {
      console.log('Setting tags:', tags);
      set(tags);
    },
    update,
    add: (tag: string) => {
      update(tags => {
        if (!tags.includes(tag)) {
          console.log('Adding tag:', tag);
          return [...tags, tag];
        }
        return tags;
      });
    },
    remove: (tag: string) => {
      update(tags => {
        console.log('Removing tag:', tag);
        return tags.filter(t => t !== tag);
      });
    },
    toggle: (tag: string) => {
      update(tags => {
        if (tags.includes(tag)) {
          console.log('Toggling tag (remove):', tag);
          return tags.filter(t => t !== tag);
        } else {
          console.log('Toggling tag (add):', tag);
          return [...tags, tag];
        }
      });
    },
    clear: () => {
      console.log('Clearing all tags');
      set([]);
    }
  };
}

export const selectedTags = createTagStore();
export const selectedDate = writable<Date | null>(null);