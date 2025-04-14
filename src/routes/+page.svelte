<script lang="ts">
  import { syncedTaskStore as taskStore, syncStatus } from '$lib/stores/synced-store';
  import { filteredTasks } from '$lib/stores/task';
  import { selectedDate, selectedTags as tagStore } from '$lib/stores/filters';
  import { searchQuery, searchResults } from '$lib/stores/search';
  import TaskList from '$lib/components/TaskList.svelte';
  import TaskFormModal from '$lib/components/TaskFormModal.svelte';
  import CalendarView from '$lib/components/calendar/CalendarView.svelte';
  import TaskDetails from '$lib/components/task/TaskDetails.svelte';
  import Modal from '$lib/components/modal/Modal.svelte';
  import { startOfDay } from 'date-fns';
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  
  // Add error tracking for debugging
  let loadingError: string | null = null;
  let syncError = getContext('syncError');
  
  let showEditModal = false;
  let showDetailsModal = false;
  let editingTask: string | null = null;
  let selectedTask: any = null;
  
  // No filter state needed as we're now using search
  
  $selectedDate = $selectedDate || startOfDay(new Date());
  
  onMount(() => {
    console.info('Page component mounted - SyncedStore integration active');
    
    // Set global error handler to catch runtime errors
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Runtime error:', {message, source, lineno, colno, error});
      loadingError = String(message);
      return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
    };
    
    // Listen for edit events from the search results in the layout
    const handleEditEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        editingTask = event.detail.id;
        showEditModal = true;
      }
    };
    
    window.addEventListener('edit', handleEditEvent as EventListener);
    
    return () => {
      window.onerror = originalOnError;
      window.removeEventListener('edit', handleEditEvent as EventListener);
    };
  });
  
  $: currentTask = editingTask 
    ? $filteredTasks.find(task => task.id === editingTask)
    : { labels: $tagStore };
    
  // Filtering is now handled centrally in the filteredTasks store
  $: displayTasks = $filteredTasks;
  
  function handleTaskSubmit(event: CustomEvent) {
    const taskData = event.detail.task;
    
    if (editingTask) {
      taskStore.updateTask(editingTask, taskData);
    } else {
      taskStore.addTask(taskData);
    }
    
    showEditModal = false;
    editingTask = null;
  }
  
  function handleShowDetails(event: CustomEvent) {
    selectedTask = $filteredTasks.find(task => task.id === event.detail.id);
    showDetailsModal = true;
  }

  // No filter function needed as we're using search
  
</script>

<div class="max-w-5xl mx-auto space-y-6">
  {#if loadingError}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
      <strong class="font-bold">Error Loading Page:</strong>
      <span class="block sm:inline">{loadingError}</span>
      <p class="mt-2">Please check the browser console for more details.</p>
      <button class="mt-2 px-4 py-2 bg-red-600 text-white rounded" on:click={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  {/if}
  
  {#if $syncStatus.error}
    <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-4" role="alert">
      <strong class="font-bold">Sync Error:</strong>
      <span class="block sm:inline">{$syncStatus.error.message}</span>
    </div>
  {/if}

  <CalendarView 
    bind:selectedDate={$selectedDate}
  />

  <TaskFormModal
    show={showEditModal}
    task={currentTask}
    isEditing={!!editingTask}
    on:submit={handleTaskSubmit}
    on:close={() => {
      showEditModal = false;
      editingTask = null;
    }}
  />

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

  <TaskList 
    tasks={displayTasks}
    on:edit={(e) => {
      editingTask = e.detail.id;
      showEditModal = true;
    }}
    on:showDetails={handleShowDetails}
  />
</div>