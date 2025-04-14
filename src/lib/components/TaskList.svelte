<script lang="ts">
  import TaskItem from './TaskItem.svelte';
  import type { Task } from '$lib/types/task';
  import { syncedTaskStore as taskStore } from '$lib/stores/synced-store';

  export let tasks: Task[] = [];

  function handleComplete(event: CustomEvent) {
    const taskId = event.detail.id;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    if (task.status === 'completed') {
      // Uncomplete task
      taskStore.updateTask(taskId, { 
        status: 'todo',
        completedAt: undefined
      });
    } else {
      // Complete task (handles recurrence internally)
      taskStore.completeTask(taskId);
    }
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
        on:delete={() => taskStore.deleteTask(task.id)}
        on:edit
        on:showDetails
      />
    {/each}
  {/if}
</div>