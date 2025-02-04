import { getTasks } from './src/lib/utils/storage/taskStorage.js';
import fs from 'fs';

async function exportTasks() {
  try {
    const tasks = await getTasks();
    fs.writeFileSync('tasks_backup.json', JSON.stringify(tasks, null, 2));
    console.log('Tasks have been exported to tasks_backup.json');
  } catch (error) {
    console.error('Failed to export tasks:', error);
  }
}

exportTasks();
