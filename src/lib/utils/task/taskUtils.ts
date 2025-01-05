import { startOfDay, isBefore, isAfter } from 'date-fns';
import type { Task } from '$lib/types/task';

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'completed') return false;
  return isBefore(task.dueDate, startOfDay(new Date()));
}

export function shouldMoveToToday(task: Task): boolean {
  return !task.completedAt && 
         task.dueDate && 
         isBefore(task.dueDate, startOfDay(new Date()));
}

export function moveOverdueTasksToToday(tasks: Task[]): Task[] {
  const today = startOfDay(new Date());
  
  return tasks.map(task => {
    if (shouldMoveToToday(task)) {
      return {
        ...task,
        dueDate: today
      };
    }
    return task;
  });
}