<script lang="ts">
  import { format } from 'date-fns';
  import { Tag } from 'lucide-svelte';
  import type { Task } from '$lib/utils/types';
  import { formatDate } from '$lib/utils/date';

  export let task: Task;
</script>

<div class="flex flex-wrap gap-4 text-sm text-navy-600">
  {#if task.dueDate}
    <div>
      <span class="font-medium">Due:</span>
      {formatDate(task.dueDate)}
    </div>
  {/if}

  {#if task.recurrence}
    <div>
      <span class="font-medium">Recurrence:</span>
      {task.recurrence}
    </div>
  {/if}

  {#if task.labels?.length}
    <div class="flex items-center gap-1">
      <span class="font-medium">Tags:</span>
      {#each task.labels as label}
        <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-navy-50 rounded text-xs">
          <Tag class="w-3 h-3" />
          {label}
        </span>
      {/each}
    </div>
  {/if}
</div>