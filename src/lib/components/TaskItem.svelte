<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Check, Trash2, Tag } from 'lucide-svelte';
  import type { Task } from '$lib/types/task';
  import TaskLeadTime from './task/TaskLeadTime.svelte';
  import RecurringInfo from './recurring/RecurringInfo.svelte';
  import { isTaskOverdue } from '$lib/utils/task/taskUtils';

  export let task: Task;
  export let showDetails = false;
  export let compact = false;

  const dispatch = createEventDispatcher();

  function handleComplete() {
    dispatch('complete', { id: task.id });
  }

  function handleDelete() {
    dispatch('delete', { id: task.id });
  }

  function handleClick() {
    if (task.status === 'completed') {
      dispatch('showDetails', { id: task.id });
    } else {
      dispatch('edit', { id: task.id });
    }
  }

  $: isOverdue = isTaskOverdue(task);
</script>

<div
  class="group flex items-center gap-4 {compact ? 'p-2' : 'p-3'} bg-surface rounded-lg {compact ? '' : 'shadow-soft hover:shadow-medium'} transition-all cursor-pointer font-jetbrains-mono"
  transition:fade={{ duration: compact ? 150 : 200 }}
  on:click={handleClick}
>
  <button
    class="w-5 h-5 rounded-full border-2 border-navy-200 hover:border-navy-600 flex items-center justify-center transition-colors"
    on:click|stopPropagation={handleComplete}
    aria-label="Complete task"
  >
    {#if task.status === 'completed'}
      <Check class="w-3 h-3 text-navy-600" />
    {/if}
  </button>

  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2">
      <h3 class="text-base text-navy-900 truncate {task.status === 'completed' ? 'line-through text-navy-400' : ''}">
        {task.title}
      </h3>
      {#if isOverdue && task.status !== 'completed' && task.dueDate}
        <TaskLeadTime dueDate={task.dueDate} />
      {/if}
    </div>
    
    <div class="flex flex-wrap gap-2 mt-1">
      {#if task.labels?.length}
        <div class="flex gap-1 flex-wrap">
          {#each task.labels as label}
            <span class="flex items-center gap-1 text-xs bg-navy-50 text-navy-700 px-1.5 py-0.5 rounded">
              <Tag class="w-3 h-3" />
              {label}
            </span>
          {/each}
        </div>
      {/if}
      
      {#if task.recurrence && task.dueDate}
        <RecurringInfo recurrence={task.recurrence} nextDueDate={task.dueDate} />
      {/if}
    </div>
  </div>

  <button
    class="p-2 hover:bg-red-50 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
    on:click|stopPropagation={handleDelete}
    aria-label="Delete task"
  >
    <Trash2 class="w-4 h-4" />
  </button>
</div>