<script lang="ts">
  import { format } from 'date-fns';
  import type { Task } from '$lib/types/task';
  import TaskItem from './TaskItem.svelte';
  import { syncedTaskStore as taskStore } from '$lib/stores/synced-store';
  import { createEventDispatcher } from 'svelte';

  export let tasks: Task[];
  
  const dispatch = createEventDispatcher();

  $: groupedTasks = tasks.reduce((groups, task) => {
    const date = task.completedAt ? format(task.completedAt, 'yyyy-MM-dd') : 'No Date';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  function handleComplete(event: CustomEvent) {
    const taskId = event.detail.id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // If already completed, mark as todo again
      if (task.status === 'completed') {
        taskStore.updateTask(taskId, { 
          status: 'todo',
          completedAt: undefined,
          dueDate: new Date() // Default to today for reopened tasks
        });
      } else {
        // If todo, mark as completed
        taskStore.completeTask(taskId);
      }
    }
  }
  
  function handleEdit(event: CustomEvent) {
    // Forward the edit event to parent
    dispatch('edit', event.detail);
  }
  
  function handleDelete(event: CustomEvent) {
    const taskId = event.detail.id;
    if (taskId) {
      taskStore.deleteTask(taskId);
    }
  }
</script>

<div class="space-y-8">
  {#each Object.entries(groupedTasks) as [date, dateTasks]}
    <div class="space-y-2">
      <h3 class="text-sm font-medium text-navy-500 font-jetbrains-mono">
        {date !== 'No Date' ? format(new Date(date), 'MMMM d, yyyy') : 'No Completion Date'}
      </h3>
      <div class="space-y-2">
        {#each dateTasks as task (task.id)}
          <TaskItem 
            {task} 
            on:complete={handleComplete}
            on:edit={handleEdit}
            on:delete={handleDelete}
          />
        {/each}
      </div>
    </div>
  {/each}
</div>