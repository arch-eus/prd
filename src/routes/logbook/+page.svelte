<script lang="ts">
  import { derived } from 'svelte/store';
  import { Download } from 'lucide-svelte';
  import { completedTasks } from '$lib/stores';
  import LogbookTagFilter from '$lib/components/logbook/LogbookTagFilter.svelte';
  import LogbookTable from '$lib/components/logbook/LogbookTable.svelte';
  import { exportToExcel } from '$lib/utils/export/excelExport';

  let selectedTags: string[] = [];

  $: filteredTasks = derived(completedTasks, $tasks => 
    selectedTags.length > 0
      ? $tasks.filter(task => 
          task.labels?.some(label => selectedTags.includes(label))
        )
      : $tasks
  );

  function handleExport() {
    exportToExcel($filteredTasks);
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-bold text-navy-900 font-jetbrains-mono">Logbook</h2>
    
    <button
      on:click={handleExport}
      class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded-md transition-colors"
    >
      <Download class="w-4 h-4" />
      Export
    </button>
  </div>
  
  <LogbookTagFilter bind:selectedTags />
  
  {#if $filteredTasks.length === 0}
    <p class="text-navy-500 text-center py-8 font-jetbrains-mono">No completed tasks</p>
  {:else}
    <LogbookTable tasks={$filteredTasks} />
  {/if}
</div>