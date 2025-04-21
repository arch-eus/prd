import type { Task } from '$lib/types/task';
import { get } from 'svelte/store';
import { taskStore } from '$lib/stores/task';
import { format } from 'date-fns';

export interface ExportData {
  version: number;
  exportDate: string;
  appName: string;
  appVersion: string;
  taskCount: number;
  tasks: Task[];
}

export function exportTasks() {
  const tasks = get(taskStore);
  const exportData: ExportData = {
    version: 1,
    exportDate: new Date().toISOString(),
    appName: 'TaskManager',
    appVersion: '1.0.0', // Should ideally come from package.json or env
    taskCount: tasks.tasks.length,
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

export async function importTasks(file: File, options = { replace: true }): Promise<{added: number; replaced: number}> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Validate import data
    if (!data.version || !Array.isArray(data.tasks)) {
      throw new Error('Invalid import file format');
    }

    if (options.replace) {
      // Clear existing data and replace with imported data
      await clearBrowserData();
      await taskStore.init(); // Reset store
      
      // Import tasks
      let added = 0;
      for (const task of data.tasks) {
        await taskStore.addTask(task);
        added++;
      }
      
      return { added, replaced: 0 };
    } else {
      // Merge imported tasks with existing ones
      // Get existing task IDs for duplicate checking
      const existingTasks = get(taskStore).tasks;
      const existingIds = new Set(existingTasks.map(t => t.id));
      
      let added = 0;
      let replaced = 0;
      
      for (const task of data.tasks) {
        if (existingIds.has(task.id)) {
          // Update existing task
          await taskStore.updateTask(task.id, task);
          replaced++;
        } else {
          // Add new task
          await taskStore.addTask(task);
          added++;
        }
      }
      
      return { added, replaced };
    }
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