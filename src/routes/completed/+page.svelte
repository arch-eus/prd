<script lang="ts">
  import { completedTasks } from '$lib/stores';
  import CompletedTaskList from '$lib/components/CompletedTaskList.svelte';
  import TaskFormModal from '$lib/components/TaskFormModal.svelte';
  import { syncedTaskStore as taskStore } from '$lib/stores/synced-store';
  import { onMount, onDestroy } from 'svelte';

  let showEditModal = false;
  let editingTask: any = null;

  onMount(() => {
    // Listen for edit events from the search results in the layout
    const handleEditEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        const task = taskStore.getTasks().then(tasks => {
          const foundTask = tasks.find(t => t.id === event.detail.id);
          if (foundTask) {
            editingTask = foundTask;
            showEditModal = true;
          }
        });
      }
    };
    
    window.addEventListener('edit', handleEditEvent as EventListener);
    
    return () => {
      window.removeEventListener('edit', handleEditEvent as EventListener);
    };
  });

  function handleTaskSubmit(event: CustomEvent) {
    const taskData = event.detail.task;
    
    if (editingTask?.id) {
      taskStore.updateTask(editingTask.id, taskData);
    }
    
    showEditModal = false;
    editingTask = null;
  }
  
  function handleEdit(event: CustomEvent) {
    const taskId = event.detail.id;
    editingTask = $completedTasks.find(t => t.id === taskId);
    if (editingTask) {
      showEditModal = true;
    }
  }
</script>

<div class="space-y-6">
  <h2 class="text-2xl font-bold text-navy-900 font-jetbrains-mono">Completed Tasks</h2>
  
  <TaskFormModal
    show={showEditModal}
    task={editingTask || {}}
    isEditing={true}
    on:submit={handleTaskSubmit}
    on:close={() => {
      showEditModal = false;
      editingTask = null;
    }}
  />
  
  {#if $completedTasks.length === 0}
    <p class="text-navy-500 text-center py-8 font-jetbrains-mono">No completed tasks</p>
  {:else}
    <CompletedTaskList 
      tasks={$completedTasks} 
      on:edit={handleEdit}
    />
  {/if}
</div>