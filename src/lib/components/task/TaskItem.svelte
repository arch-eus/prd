<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Check, Trash2, Tag } from 'lucide-svelte';
  import { format } from 'date-fns';
  import type { Task } from '$lib/types/task';
  import { searchQuery } from '$lib/stores/search';
  import TaskLeadTime from './TaskLeadTime.svelte';
  import RecurringInfo from '../recurring/RecurringInfo.svelte';
  import { isTaskOverdue } from '$lib/utils/task/taskUtils';

  export let task: Task;
  export let showDetails = false;

  const dispatch = createEventDispatcher();

  function handleComplete(e: MouseEvent) {
    e.stopPropagation();
    dispatch('complete', { id: task.id });
  }

  function handleDelete(e: MouseEvent) {
    e.stopPropagation();
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
  class="card card-hover p-4 cursor-pointer"
  on:click={handleClick}
>
  <div class="flex items-center gap-4">
    <button
      class="btn-icon variant-soft-surface"
      on:click={handleComplete}
      aria-label="Complete task"
    >
      {#if task.status === 'completed'}
        <Check class="w-4 h-4" />
      {/if}
    </button>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="text-base truncate {task.status === 'completed' ? 'line-through opacity-50' : ''}">
          {task.title}
        </h3>
        {#if $searchQuery && task.dueDate}
          <span class="badge variant-soft">
            {format(task.dueDate, 'MMM d')}
          </span>
        {/if}
        {#if isOverdue && task.status !== 'completed' && task.dueDate}
          <TaskLeadTime dueDate={task.dueDate} />
        {/if}
      </div>
      
      <div class="flex flex-wrap gap-2 mt-1">
        {#if task.labels?.length}
          <div class="flex gap-1 flex-wrap">
            {#each task.labels as label}
              <span class="chip variant-soft-primary">
                <Tag class="w-3 h-3" />
                <span>{label}</span>
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
      class="btn-icon variant-soft-error opacity-0 group-hover:opacity-100 transition-opacity"
      on:click={handleDelete}
      aria-label="Delete task"
    >
      <Trash2 class="w-4 h-4" />
    </button>
  </div>
</div>