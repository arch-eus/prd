<script lang="ts">
  import TaskItem from './TaskItem.svelte';
  import type { Task } from '$lib/types/task';
  import { taskStore } from '$lib/stores/task';

  export let tasks: Task[] = [];

  function handleComplete(event: CustomEvent) {
    const task = tasks.find(t => t.id === event.detail.id);
    if (task) {
      taskStore.updateTask(task.id, { 
        status: task.status === 'completed' ? 'todo' : 'completed',
        completedAt: task.status === 'completed' ? undefined : new Date()
      });
    }
  }

  function handleDelete(event: CustomEvent) {
    taskStore.deleteTask(event.detail.id);
  }
</script>

<div class="space-y-4">
  {#if tasks.length === 0}
    <p class="text-center text-navy-500 py-8">
      No tasks for this day
    </p>
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
