<script lang="ts">
  import { derived } from 'svelte/store';
  import { Download } from 'lucide-svelte';
  import { taskStore } from '$lib/stores/task';
  import RecurringTaskTable from '$lib/components/recurring/RecurringTaskTable.svelte';
  import { exportRecurringTasks } from '$lib/utils/export/recurringExport';
  
  const recurringTasks = derived(taskStore, $store => 
    ($store.tasks || [])
      .filter(task => task.status === 'todo' && task.recurrence)
      .sort((a, b) => {
        const recurrenceOrder = {
          monthly: 1,
          quarterly: 2,
          yearly: 3
        };
        const aOrder = a.recurrence ? recurrenceOrder[a.recurrence] || 0 : 0;
        const bOrder = b.recurrence ? recurrenceOrder[b.recurrence] || 0 : 0;
        return aOrder - bOrder;
      })
  );

  function handleExport() {
    exportRecurringTasks($recurringTasks);
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-bold text-navy-900 font-jetbrains-mono">Recurring Tasks</h2>
    
    <button
      on:click={handleExport}
      class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded-md transition-colors"
    >
      <Download class="w-4 h-4" />
      Export
    </button>
  </div>

  {#if $recurringTasks.length === 0}
    <p class="text-navy-500 text-center py-8 font-jetbrains-mono">No recurring tasks found</p>
  {:else}
    <RecurringTaskTable tasks={$recurringTasks} />
  {/if}
</div>