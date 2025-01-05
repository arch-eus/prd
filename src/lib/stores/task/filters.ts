import { isSameDay, isBefore, startOfDay } from 'date-fns';
import type { Task } from '$lib/types/task';

export function filterTasksBySearch(tasks: Task[], query: string): Task[] {
  const searchTerms = query.toLowerCase().split(' ');
  return tasks.filter(task => {
    const searchableText = [
      task.title,
      task.description,
      task.notes,
      ...(task.labels || [])
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });
}

export function filterTasksByDate(tasks: Task[], selectedDate: Date): Task[] {
  const today = startOfDay(new Date());
  const isPastDate = isBefore(selectedDate, today);
  
  return tasks.filter(task => {
    if (isPastDate) {
      return task.status === 'completed' && 
             task.completedAt && 
             isSameDay(task.completedAt, selectedDate);
    }
    
    return task.status === 'todo' && 
           task.dueDate && 
           isSameDay(task.dueDate, selectedDate);
  });
}

export function filterTasksByTags(tasks: Task[], selectedTags: string[]): Task[] {
  return tasks.filter(task =>
    task.labels?.some(label => selectedTags.includes(label))
  );
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
}