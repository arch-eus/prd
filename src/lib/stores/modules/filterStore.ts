import { writable } from 'svelte/store';

export const selectedTags = writable<string[]>([]);
export const selectedDate = writable<Date | null>(null);