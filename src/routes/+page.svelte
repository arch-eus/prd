<script lang="ts">
  import { taskStore, filteredTasks } from '$lib/stores/task';
  import { selectedDate, selectedTags } from '$lib/stores/filters';
  import { searchQuery, searchResults } from '$lib/stores/search';
  import TaskList from '$lib/components/TaskList.svelte';
  import TaskFormModal from '$lib/components/TaskFormModal.svelte';
  import CalendarView from '$lib/components/calendar/CalendarView.svelte';
  import TaskDetails from '$lib/components/task/TaskDetails.svelte';
  import Modal from '$lib/components/modal/Modal.svelte';
  import { startOfDay } from 'date-fns';
  
  let showEditModal = false;
  let showDetailsModal = false;
  let editingTask: string | null = null;
  let selectedTask: any = null;
  
  $selectedDate = $selectedDate || startOfDay(new Date());
  
  $: currentTask = editingTask 
    ? $filteredTasks.find(task => task.id === editingTask)
    : { labels: $selectedTags };
    
  $: displayTasks = $searchQuery ? $searchResults : $filteredTasks;
  
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
</script>

<div class="max-w-5xl mx-auto space-y-6">
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