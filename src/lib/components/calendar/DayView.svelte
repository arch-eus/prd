<script lang="ts">
  import { format } from 'date-fns';
  import type { Task } from '$lib/types/task';
  import TaskItem from '../task/TaskItem.svelte';
  
  export let date: Date;
  export let tasks: Task[] = [];
</script>

<div class="card p-4">
  <header class="mb-4">
    <h3 class="h3">{format(date, 'EEEE, MMMM d')}</h3>
  </header>

  <div class="space-y-2">
    {#if tasks.length === 0}
      <p class="text-center text-surface-600-300-token py-4">No tasks for this day</p>
    {:else}
      {#each tasks as task (task.id)}
        <TaskItem {task} />
      {/each}
    {/if}
  </div>
</div>