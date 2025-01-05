/**
 * Core search functionality
 */
import type { Task } from '$lib/utils/types';
import { filterBySearchTerms, normalizeSearchTerms } from './filters';
import { sortByOrder, sortByCompletedDate } from '../task/sorters';

export function searchTasks(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return [];
  
  const searchTerms = normalizeSearchTerms(query);
  
  const filteredTasks = tasks.filter(task => 
    filterBySearchTerms(task, searchTerms)
  );

  // Sort tasks: completed tasks by completion date, todo tasks by order
  return filteredTasks.sort((a, b) => {
    if (a.status === 'completed' && b.status === 'completed') {
      return (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0);
    }
    return (a.order || 0) - (b.order || 0);
  });
}