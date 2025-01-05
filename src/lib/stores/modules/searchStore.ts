import { writable, derived } from 'svelte/store';
import type { Task } from '$lib/types/task';

interface SearchState {
  query: string;
  active: boolean;
}

function createSearchStore() {
  const { subscribe, set, update } = writable<SearchState>({
    query: '',
    active: false
  });

  return {
    subscribe,
    setQuery: (query: string) => update(state => ({ ...state, query })),
    setActive: (active: boolean) => update(state => ({ ...state, active })),
    reset: () => set({ query: '', active: false })
  };
}

export const searchStore = createSearchStore();
export const searchQuery = derived(searchStore, $store => $store.query);
export const searchActive = derived(searchStore, $store => $store.active);

// Search functionality temporarily disabled
export const searchResults = derived(searchStore, () => [] as Task[]);