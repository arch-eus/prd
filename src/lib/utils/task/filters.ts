/**
 * Task filtering utilities
 * 
 * Collection of pure functions for filtering tasks based on different criteria:
 * - Date filtering: Shows tasks due on a specific date
 * - Tag filtering: Shows tasks with specific labels
 * - Status filtering: Separates completed and active tasks
 * - Recurrence filtering: Shows recurring tasks
 */
import { isSameDay } from 'date-fns';
import type { Task } from '$lib/utils/types';

// Filter tasks by due date
// Returns tasks that are due on the specified date
export function filterTasksByDate(tasks: Task[], selectedDate: Date): Task[] {
  return tasks.filter(task => 
    task.dueDate && isSameDay(task.dueDate, selectedDate)
  );
}

// Filter tasks by tags/labels
// Returns tasks that have at least one of the selected tags
// If no tags selected, returns all tasks
export function filterTasksByTags(tasks: Task[], selectedTags: string[]): Task[] {
  if (!selectedTags.length) return tasks;
  return tasks.filter(task =>
    task.labels && task.labels.some(label => selectedTags.includes(label))
  );
}

// Get completed tasks sorted by completion date (newest first)
export function filterCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => task.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));
}

// Get recurring tasks sorted by due date
export function filterRecurringTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => task.recurrence && task.status === 'todo')
    .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));
}