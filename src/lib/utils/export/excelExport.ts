import { format } from 'date-fns';
import type { Task } from '$lib/types/task';

export function exportToExcel(tasks: Task[]) {
  const headers = ['Title', 'Description', 'Notes', 'Completed Date', 'Tags', 'Recurrence'];
  const rows = tasks.map(task => [
    task.title,
    task.description || '',
    task.notes || '',
    task.completedAt ? format(task.completedAt, 'yyyy-MM-dd') : '',
    task.labels?.join(', ') || '',
    task.recurrence || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `tasks-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
}