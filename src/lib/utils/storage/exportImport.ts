import type { Task } from '$lib/types/task';
import { get } from 'svelte/store';
import { taskStore } from '$lib/stores/task';
import { format } from 'date-fns';

export function exportTasks() {
  const tasks = get(taskStore);
  const exportData = {
    version: 1,
    exportDate: new Date().toISOString(),
    tasks: tasks.tasks
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importTasks(file: File): Promise<void> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Validate import data
    if (!data.version || !Array.isArray(data.tasks)) {
      throw new Error('Invalid import file format');
    }

    // Clear IndexedDB
    await clearBrowserData();
    
    // Import tasks
    await taskStore.init(); // Reset store
    for (const task of data.tasks) {
      await taskStore.addTask(task);
    }

    return Promise.resolve();
  } catch (error) {
    console.error('Error importing tasks:', error);
    return Promise.reject(error);
  }
}

export async function clearBrowserData(): Promise<void> {
  try {
    // Clear IndexedDB
    const databases = await window.indexedDB.databases();
    for (const db of databases) {
      if (db.name) {
        await window.indexedDB.deleteDatabase(db.name);
      }
    }
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error clearing browser data:', error);
    return Promise.reject(error);
  }
}