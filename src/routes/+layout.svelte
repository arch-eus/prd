<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { syncedTaskStore as taskStore } from '$lib/stores/synced-store';
  import { selectedTags, selectedDate } from '$lib/stores/filters';
  import TopBar from '$lib/components/navigation/TopBar.svelte';
  import Sidebar from '$lib/components/navigation/Sidebar.svelte';
  import TaskFormModal from '$lib/components/TaskFormModal.svelte';
  import KeyboardShortcuts from '$lib/components/help/KeyboardShortcuts.svelte';
  import SettingsModal from '$lib/components/modal/SettingsModal.svelte';
  import { setupKeyboardShortcuts } from '$lib/utils/keyboard';
  import SyncedStoreProvider from '$lib/components/SyncedStoreProvider.svelte';
  import PWAHandler from '$lib/components/PWAHandler.svelte';
  import PWAInstallBanner from '$lib/components/PWAInstallBanner.svelte';
  import { page } from '$app/stores';
  import { changeMnemonic, validateMnemonic } from '$lib/utils/mnemonic-manager';
  import { addWeeks, subWeeks } from 'date-fns';
  import { searchQuery, searchResults, isSearchActive } from '$lib/stores/search';
  import TaskList from '$lib/components/TaskList.svelte';
  
  let isSidebarOpen = false;
  let sidebarTimeout: number;
  let showTaskModal = false;
  let showHelpModal = false;
  let showSettingsModal = false;
  let initialTaskTitle = '';
  let searchInput: HTMLInputElement | null = null;
  let taskFormRef: { submitForm: () => void } | null = null;
  
  onMount(async () => {
    try {
      // Check if we have a passphrase in the URL
      const url = new URL(window.location.href);
      const passphraseParam = url.searchParams.get('passphrase');
      
      if (passphraseParam) {
        try {
          // Clean the URL to remove the passphrase
          url.searchParams.delete('passphrase');
          window.history.replaceState({}, '', url.toString());
          
          // Validate and apply the passphrase
          const decodedPassphrase = decodeURIComponent(passphraseParam);
          if (validateMnemonic(decodedPassphrase)) {
            await changeMnemonic(decodedPassphrase);
            console.log('Passphrase restored from URL parameter');
          }
        } catch (e) {
          console.error('Failed to restore passphrase from URL:', e);
        }
      }
      
      // Initialize task store
      await taskStore.init();
    } catch (error) {
      console.error('Failed to initialize task store:', error);
    }
    
    function closeAllModals() {
      showTaskModal = false;
      showHelpModal = false;
      showSettingsModal = false;
      initialTaskTitle = '';
    }
    
    function navigatePrevWeek() {
      $selectedDate = subWeeks($selectedDate, 1);
    }
    
    function navigateNextWeek() {
      $selectedDate = addWeeks($selectedDate, 1);
    }
    
    const handleKeydown = setupKeyboardShortcuts({
      showHelp: () => showHelpModal = true,
      showNewTask: () => showTaskModal = true,
      showSettings: () => showSettingsModal = true,
      submitForm: () => taskFormRef?.submitForm(),
      closeModals: closeAllModals,
      navigatePrevWeek,
      navigateNextWeek,
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

<svelte:head>
  <meta name="theme-color" content="#ffffff">
  <link rel="manifest" href="/manifest.webmanifest">
</svelte:head>

<svelte:window on:mousemove={handleMouseMove} />

<SyncedStoreProvider>
  <div class="min-h-screen bg-background font-jetbrains-mono">
    <PWAHandler />
    <TopBar 
      bind:searchInput
      on:toggleSidebar={() => isSidebarOpen = !isSidebarOpen}
      on:newTask={handleNewTask}
      on:edit={(e) => {
        // Dispatch an event that page components can listen for
        window.dispatchEvent(new CustomEvent('edit', { detail: e.detail }));
      }}
      on:showDetails={(e) => {
        // Dispatch an event that page components can listen for
        window.dispatchEvent(new CustomEvent('showDetails', { detail: e.detail }));
      }}
    />

  <KeyboardShortcuts bind:show={showHelpModal} />
  <SettingsModal bind:show={showSettingsModal} />
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
  
  <PWAInstallBanner />
</div>
</SyncedStoreProvider>