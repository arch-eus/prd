import { get, set } from 'idb-keyval';
import type { Task } from '$lib/types/task';

const TASKS_KEY = 'tasks';
const MAX_TASKS = 10000; // Reasonable limit to prevent storage abuse

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
    // Validate input
    if (!Array.isArray(tasks)) {
      throw new Error('Invalid tasks data');
    }

    // Enforce reasonable limits
    if (tasks.length > MAX_TASKS) {
      throw new Error(`Cannot store more than ${MAX_TASKS} tasks`);
    }

    // Calculate approximate size
    const dataSize = new Blob([JSON.stringify(tasks)]).size;
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB limit
    
    if (dataSize > MAX_SIZE) {
      throw new Error('Data size exceeds storage limit');
    }

    await set(TASKS_KEY, tasks);
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw new Error('Failed to save tasks');
  }
}

export async function clearTasks(): Promise<void> {
  try {
    await set(TASKS_KEY, []);
  } catch (error) {
    console.error('Error clearing tasks:', error);
    throw new Error('Failed to clear tasks');
  }
}

// Check if storage is available
export async function checkStorageAvailability(): Promise<boolean> {
  try {
    const testKey = '___storage_test___';
    await set(testKey, true);
    await get(testKey);
    return true;
  } catch {
    return false;
  }
}