<script lang="ts">
  import { onMount } from 'svelte';
  import { Download } from 'lucide-svelte';
  import { completedTasks } from '$lib/stores';
  import LogbookTable from '$lib/components/logbook/LogbookTable.svelte';
  import { exportToExcel } from '$lib/utils/export/excelExport';
  import { selectedTags as tagStore } from '$lib/stores/filters';
  import { syncedTaskStore as taskStore } from '$lib/stores/synced-store';
  import Modal from '$lib/components/modal/Modal.svelte';
  import TaskDetails from '$lib/components/task/TaskDetails.svelte';
  
  let showDetailsModal = false;
  let selectedTask: any = null;
  
  // Handle events from search results
  onMount(() => {
    const handleEditEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        // For logbook, editing means viewing details
        selectedTask = $completedTasks.find(task => task.id === event.detail.id);
        if (selectedTask) {
          showDetailsModal = true;
        }
      }
    };
    
    const handleShowDetailsEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        selectedTask = $completedTasks.find(task => task.id === event.detail.id);
        if (selectedTask) {
          showDetailsModal = true;
        }
      }
    };
    
    window.addEventListener('edit', handleEditEvent as EventListener);
    window.addEventListener('showDetails', handleShowDetailsEvent as EventListener);
    
    return () => {
      window.removeEventListener('edit', handleEditEvent as EventListener);
      window.removeEventListener('showDetails', handleShowDetailsEvent as EventListener);
    };
  });

  // Filter tasks by selected tags
  $: filteredTasks = $tagStore.length > 0
      ? $completedTasks.filter(task => 
          task.labels?.some(label => $tagStore.includes(label))
        )
      : $completedTasks;

  function handleExport() {
    exportToExcel(filteredTasks);
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
  
  {#if filteredTasks.length === 0}
    <p class="text-navy-500 text-center py-8 font-jetbrains-mono">No completed tasks</p>
  {:else}
    <LogbookTable tasks={filteredTasks} />
  {/if}
</div>

<Modal
  show={showDetailsModal}
  title="Task Details"
  on:close={() => {
    showDetailsModal = false;
    selectedTask = null;
  }}
>
  {#if selectedTask}
    <TaskDetails 
      task={selectedTask}
      on:close={() => {
        showDetailsModal = false;
        selectedTask = null;
      }}
    />
  {/if}
</Modal>