<script lang="ts">
  import type { Task } from '$lib/utils/types';
  import TaskLeadTime from './TaskLeadTime.svelte';
  import { isTaskOverdue } from '$lib/utils/task';

  export let task: Task;
</script>

<div class="flex items-center gap-2">
  <h3 class="text-base text-navy-900 truncate {task.status === 'completed' ? 'line-through text-navy-400' : ''}">
    {task.title}
  </h3>
  {#if isTaskOverdue(task) && task.status !== 'completed' && task.dueDate}
    <TaskLeadTime dueDate={task.dueDate} />
  {/if}
</div>