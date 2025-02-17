<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Task } from '$lib/types/task';
  import TaskItem from './TaskItem.svelte';
  import { taskStore } from '$lib/stores/task';
  import { searchQuery } from '$lib/stores/search';

  export let tasks: Task[] = [];

  const dispatch = createEventDispatcher();

  function handleComplete(event: CustomEvent) {
    const task = tasks.find(t => t.id === event.detail.id);
    if (task) {
      taskStore.updateTask(task.id, { 
        status: task.status === 'completed' ? 'todo' : 'completed',
        completedAt: task.status === 'completed' ? undefined : new Date()
      });
      if ($searchQuery) {
        searchQuery.set('');
      }
    }
  }

  function handleDelete(event: CustomEvent) {
    taskStore.deleteTask(event.detail.id);
    if ($searchQuery) {
      searchQuery.set('');
    }
  }
</script>

<div class="space-y-4">
  {#if tasks.length === 0}
    <div class="card p-8 text-center">
      <p class="text-surface-600-300-token">No tasks for this day</p>
    </div>
  {:else}
    {#each tasks as task (task.id)}
      <TaskItem
        {task}
        on:complete={handleComplete}
        on:delete={handleDelete}
        on:edit
        on:showDetails
      />
    {/each}
  {/if}
</div>