<script lang="ts">
  import { format, addMonths, addYears } from 'date-fns';
  import type { Task } from '$lib/types/task';
  import TaskItem from '../TaskItem.svelte';

  export let task: Task;

  $: nextDueDate = task.dueDate && (() => {
    switch (task.recurrence) {
      case 'monthly':
        return addMonths(task.dueDate, 1);
      case 'quarterly':
        return addMonths(task.dueDate, 3);
      case 'yearly':
        return addYears(task.dueDate, 1);
      default:
        return task.dueDate;
    }
  })();

  $: recurrenceText = {
    monthly: 'Monthly',
    quarterly: 'Every 3 months',
    yearly: 'Yearly'
  }[task.recurrence!];
</script>

<div class="space-y-2">
  <TaskItem {task} on:edit on:complete on:delete>
    <div slot="details" class="flex gap-4 mt-2 text-sm text-navy-600">
      <span class="flex items-center gap-1">
        <span class="font-medium">Recurrence:</span>
        {recurrenceText}
      </span>
      {#if nextDueDate}
        <span class="flex items-center gap-1">
          <span class="font-medium">Next due:</span>
          {format(nextDueDate, 'MMM d, yyyy')}
        </span>
      {/if}
    </div>
  </TaskItem>
</div>