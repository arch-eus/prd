import { format } from 'date-fns';
import type { Task } from '$lib/types/task';

export function exportRecurringTasks(tasks: Task[]) {
  const headers = ['Title', 'Description', 'Due Date', 'Recurrence', 'Tags'];
  const rows = tasks.map(task => [
    task.title,
    task.description || '',
    task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
    task.recurrence || '',
    task.labels?.join(', ') || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `recurring-tasks-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
}