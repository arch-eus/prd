<script lang="ts">
  import { format } from 'date-fns';
  import type { Task } from '$lib/utils/types';
  import TaskDescription from './TaskDescription.svelte';
  import TaskLabels from './TaskLabels.svelte';
  import { formatDate } from '$lib/utils/date';

  export let task: Task;
</script>

<div class="space-y-4">
  <TaskDescription description={task.description} notes={task.notes} />

  {#if task.labels?.length}
    <div>
      <h3 class="text-sm font-medium text-navy-700 mb-1">Tags</h3>
      <TaskLabels labels={task.labels} />
    </div>
  {/if}

  {#if task.completedAt}
    <div class="text-sm text-navy-500">
      Completed on {formatDate(task.completedAt)}
    </div>
  {/if}
</div>