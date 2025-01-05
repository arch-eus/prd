<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { Task } from '$lib/utils/types';
  import TaskTitle from './TaskTitle.svelte';
  import TaskLabels from './TaskLabels.svelte';
  import TaskActions from './TaskActions.svelte';
  import RecurringInfo from '../recurring/RecurringInfo.svelte';

  export let task: Task;
  
  const dispatch = createEventDispatcher();

  function handleClick() {
    if (task.status === 'completed') {
      dispatch('showDetails', { id: task.id });
    } else {
      dispatch('edit', { id: task.id });
    }
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
    </div>
  </div>
</div>