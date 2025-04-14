import { derived } from 'svelte/store';
import type { Task } from '$lib/types/task';
import { syncedTaskStore } from './synced-store';
import { selectedDate, selectedTags } from './filters';

// Export the syncedTaskStore as the main taskStore
export const taskStore = syncedTaskStore;

// Derived stores
export const filteredTasks = derived(
  [taskStore, selectedDate, selectedTags],
  ([$store, $date, $tags]) => {
    if (!$store.tasks?.length) return [];
    let tasks = $store.tasks;
    
    if ($date) {
      const startOfDay = new Date($date);
      startOfDay.setHours(0, 0, 0, 0);
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      
      // For past dates, show completed tasks or due tasks for that date
      if (startOfDay < today) {
        // 1. Tasks that were completed on the selected date
        const completedOnDate = tasks.filter(t => 
          t.status === 'completed' && 
          t.completedAt && 
          new Date(t.completedAt).toDateString() === startOfDay.toDateString()
        );
        
        // 2. Tasks that were due on the selected date, regardless of status
        const tasksForDate = tasks.filter(t =>
          t.dueDate &&
          new Date(t.dueDate).toDateString() === startOfDay.toDateString()
        );
        
        // Combine both sets (avoiding duplicates)
        const combinedTaskIds = new Set();
        const combinedTasks = [];
        
        // Add completed tasks first
        for (const task of completedOnDate) {
          combinedTaskIds.add(task.id);
          combinedTasks.push(task);
        }
        
        // Then add due tasks if not already included
        for (const task of tasksForDate) {
          if (!combinedTaskIds.has(task.id)) {
            combinedTasks.push(task);
          }
        }
        
        tasks = combinedTasks;
      } else {
        // For today and future dates, show todo tasks due on that day
        const dueTodayTasks = tasks.filter(t => 
          t.status === 'todo' && 
          t.dueDate && 
          new Date(t.dueDate).toDateString() === startOfDay.toDateString()
        );
        
        // For today's view, also include overdue tasks from the past
        if (startOfDay.toDateString() === today.toDateString()) {
          const overdueTasks = tasks.filter(t =>
            t.status === 'todo' &&
            t.dueDate &&
            new Date(t.dueDate) < today
          );
          
          tasks = [...dueTodayTasks, ...overdueTasks];
        } else {
          tasks = dueTodayTasks;
        }
      }
    }

    if ($tags.length) {
      tasks = tasks.filter(t => 
        t.labels?.some(label => $tags.includes(label))
      );
    }

    // Sort tasks: completed tasks first, then by order for todos
    return tasks.sort((a, b) => {
      // First sort by status (completed first)
      if (a.status === 'completed' && b.status !== 'completed') return -1;
      if (a.status !== 'completed' && b.status === 'completed') return 1;
      
      // If both are completed, sort by completion date (most recent first)
      if (a.status === 'completed' && b.status === 'completed') {
        return (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0);
      }
      
      // If both are todo, sort overdue tasks first, then by order
      const aIsOverdue = a.dueDate && new Date(a.dueDate) < new Date(new Date().setHours(0,0,0,0));
      const bIsOverdue = b.dueDate && new Date(b.dueDate) < new Date(new Date().setHours(0,0,0,0));
      
      if (aIsOverdue && !bIsOverdue) return -1;
      if (!aIsOverdue && bIsOverdue) return 1;
      
      // Finally sort by order
      return (a.order || 0) - (b.order || 0);
    });
  }
);

export const completedTasks = derived(taskStore, $store =>
  ($store.tasks || [])
    .filter(task => task.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
);