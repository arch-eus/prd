<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { Task } from '$lib/types/task';
  import TaskTitle from './TaskTitle.svelte';
  import TaskLabels from './TaskLabels.svelte';
  import TaskActions from './TaskActions.svelte';
  import RecurringInfo from '../recurring/RecurringInfo.svelte';
  import { isOverdue, getOverdueLabel } from '$lib/utils/task/overdue';

  export let task: Task;
  
  const dispatch = createEventDispatcher();

  function handleClick() {
    // Always use edit for direct clicking
    dispatch('edit', { id: task.id });
  }
</script>

<div
  class="group flex items-center gap-4 p-3 bg-surface rounded-lg shadow-soft hover:shadow-medium transition-all cursor-pointer font-jetbrains-mono"
  transition:fade
  on:click={handleClick}
>
  <TaskActions 
    isCompleted={task.status === 'completed'}
    on:complete={() => dispatch('complete', { id: task.id })}
    on:delete={() => dispatch('delete', { id: task.id })}
  />

  <div class="flex-1 min-w-0">
    <TaskTitle {task} />
    
    <div class="flex flex-wrap gap-2 mt-1">
      <TaskLabels labels={task.labels} />
      
      {#if task.recurrence && task.dueDate}
        <RecurringInfo recurrence={task.recurrence} nextDueDate={task.dueDate} />
      {/if}
      
      {#if task.status === 'todo' && isOverdue(task)}
        <span class="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
          {getOverdueLabel(task)}
        </span>
      {/if}
    </div>
  </div>
</div>