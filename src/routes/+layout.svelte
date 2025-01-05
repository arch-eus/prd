<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { taskStore } from '$lib/stores';
  import { selectedTags, selectedDate } from '$lib/stores/filters';
  import TopBar from '$lib/components/navigation/TopBar.svelte';
  import Sidebar from '$lib/components/navigation/Sidebar.svelte';
  import TaskFormModal from '$lib/components/TaskFormModal.svelte';
  import KeyboardShortcuts from '$lib/components/help/KeyboardShortcuts.svelte';
  import { setupKeyboardShortcuts } from '$lib/utils/keyboard';
  
  let isSidebarOpen = false;
  let sidebarTimeout: number;
  let showTaskModal = false;
  let showHelpModal = false;
  let initialTaskTitle = '';
  let searchInput: HTMLInputElement | null = null;
  let taskFormRef: { submitForm: () => void } | null = null;
  
  onMount(() => {
    taskStore.init();
    
    function closeAllModals() {
      showTaskModal = false;
      showHelpModal = false;
      initialTaskTitle = '';
    }
    
    const handleKeydown = setupKeyboardShortcuts({
      showHelp: () => showHelpModal = true,
      showNewTask: () => showTaskModal = true,
      submitForm: () => taskFormRef?.submitForm(),
      closeModals: closeAllModals,
      searchInput
    });
    
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  function handleMouseMove(event: MouseEvent) {
    if (event.clientX < 20 && !isSidebarOpen) {
      clearTimeout(sidebarTimeout);
      isSidebarOpen = true;
    } else if (event.clientX > 256 && isSidebarOpen) {
      sidebarTimeout = window.setTimeout(() => {
        isSidebarOpen = false;
      }, 300);
    }
  }

  function handleSidebarMouseEnter() {
    clearTimeout(sidebarTimeout);
  }

  function handleNewTask(event: CustomEvent) {
    initialTaskTitle = event.detail?.title || '';
    showTaskModal = true;
  }

  function handleTaskSubmit(event: CustomEvent) {
    const task = {
      ...event.detail.task,
      labels: event.detail.task.labels?.length ? event.detail.task.labels : [...($selectedTags || [])],
      dueDate: $selectedDate || new Date()
    };
    
    taskStore.addTask(task);
    showTaskModal = false;
    initialTaskTitle = '';
  }
</script>

<svelte:window on:mousemove={handleMouseMove} />

<div class="min-h-screen bg-background font-jetbrains-mono">
  <TopBar 
    bind:searchInput
    on:toggleSidebar={() => isSidebarOpen = !isSidebarOpen}
    on:newTask={handleNewTask}
  />

  <KeyboardShortcuts bind:show={showHelpModal} />
  <TaskFormModal
    bind:this={taskFormRef}
    show={showTaskModal}
    task={{ 
      title: initialTaskTitle,
      labels: $selectedTags,
      dueDate: $selectedDate || new Date()
    }}
    on:submit={handleTaskSubmit}
    on:close={() => {
      showTaskModal = false;
      initialTaskTitle = '';
    }}
  />

  <div class="flex pt-16">
    <aside
      class="fixed inset-y-0 left-0 pt-16 w-64 bg-surface border-r border-navy-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 z-20 {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
      on:mouseenter={handleSidebarMouseEnter}
    >
      <Sidebar />
    </aside>

    <main class="flex-1 lg:pl-64">
      <div class="p-4 sm:p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>

  {#if isSidebarOpen}
    <div
      class="fixed inset-0 bg-navy-900/20 transition-opacity lg:hidden z-10"
      on:click={() => isSidebarOpen = false}
    ></div>
  {/if}
</div>