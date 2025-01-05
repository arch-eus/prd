<script lang="ts">
  import { format } from 'date-fns';
  import type { Task } from '$lib/types/task';

  export let tasks: Task[];
</script>

<div class="overflow-x-auto">
  <table class="w-full text-sm font-jetbrains-mono">
    <thead>
      <tr class="border-b border-navy-100">
        <th class="py-3 px-4 text-left font-medium text-navy-600">Task</th>
        <th class="py-3 px-4 text-left font-medium text-navy-600">Completed</th>
        <th class="py-3 px-4 text-left font-medium text-navy-600">Notes</th>
      </tr>
    </thead>
    <tbody>
      {#each tasks as task}
        <tr class="border-b border-navy-50 hover:bg-navy-50/50">
          <td class="py-3 px-4">
            <div>{task.title}</div>
            {#if task.recurrence}
              <div class="text-xs text-navy-500 mt-1">
                Recurring: {task.recurrence}
              </div>
            {/if}
          </td>
          <td class="py-3 px-4">
            {#if task.completedAt}
              {format(task.completedAt, 'MMM d, yyyy')}
            {/if}
          </td>
          <td class="py-3 px-4 whitespace-pre-line">{task.notes || ''}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>