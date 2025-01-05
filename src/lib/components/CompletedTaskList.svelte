<script lang="ts">
  import { format } from 'date-fns';
  import type { Task } from '$lib/types/task';
  import TaskItem from './TaskItem.svelte';
  import { taskStore } from '$lib/stores';

  export let tasks: Task[];

  $: groupedTasks = tasks.reduce((groups, task) => {
    const date = format(task.completedAt!, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  function handleComplete(event: CustomEvent) {
    const task = tasks.find(t => t.id === event.detail.id);
    if (task) {
      taskStore.updateTask(task.id, {
        status: 'todo',
        completedAt: undefined,
        dueDate: new Date()
      });
    }
  }
</script>

<div class="space-y-8">
  {#each Object.entries(groupedTasks) as [date, dateTasks]}
    <div class="space-y-2">
      <h3 class="text-sm font-medium text-navy-500 font-jetbrains-mono">
        {format(new Date(date), 'MMMM d, yyyy')}
      </h3>
      <div class="space-y-2">
        {#each dateTasks as task (task.id)}
          <TaskItem {task} on:complete={handleComplete} />
        {/each}
      </div>
    </div>
  {/each}
</div>