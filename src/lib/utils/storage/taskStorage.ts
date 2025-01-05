import { get, set } from 'idb-keyval';
import type { Task } from '$lib/types/task';

const TASKS_KEY = 'tasks';

export async function getTasks(): Promise<Task[]> {
  try {
    const tasks = await get(TASKS_KEY);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    if (!Array.isArray(tasks)) {
      throw new Error('Invalid tasks data');
    }
    await set(TASKS_KEY, tasks);
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw new Error('Failed to save tasks');
  }
}