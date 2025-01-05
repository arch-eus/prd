// Utility functions for storage operations
import { get, set, del } from 'idb-keyval';
import type { Task } from '$lib/types/task';

export async function getTasks(): Promise<Task[]> {
  try {
    return await get('tasks') || [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await set('tasks', tasks);
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}