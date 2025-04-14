<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Filter, Check, X } from 'lucide-svelte';
  import { selectedTags, showCompletedTasks as completedTasksStore, showOverdueTasks as overdueTasksStore } from '$lib/stores/filters';
  import { syncedTaskStore as taskStore } from '$lib/stores/synced-store';
  
  // Props with default bindings to stores
  export let showCompletedTasks = false;
  export let showOverdueTasks = true;
  
  // Initialize from props, but keep synced with stores
  $: {
    $completedTasksStore = showCompletedTasks;
    $overdueTasksStore = showOverdueTasks;
  }
  
  let showFilterMenu = false;
  let availableTags: string[] = [];
  let selectedTagsLocal: string[] = [];
  
  $: {
    selectedTagsLocal = [...$selectedTags];
    // Also sync from the store to the local props when the store changes
    showCompletedTasks = $completedTasksStore;
    showOverdueTasks = $overdueTasksStore;
  }
  
  $: {
    // Get all unique tags from all tasks
    const allTasks = $taskStore.tasks || [];
    const allTags = new Set<string>();
    
    allTasks.forEach(task => {
      if (task.labels && Array.isArray(task.labels)) {
        task.labels.forEach(label => {
          if (label) allTags.add(label);
        });
      }
    });
    
    availableTags = Array.from(allTags).sort();
  }
  
  const dispatch = createEventDispatcher();
  
  function toggleTag(tag: string) {
    if (selectedTagsLocal.includes(tag)) {
      selectedTagsLocal = selectedTagsLocal.filter(t => t !== tag);
    } else {
      selectedTagsLocal = [...selectedTagsLocal, tag];
    }
  }
  
  function applyFilters() {
    $selectedTags = selectedTagsLocal;
    dispatch('filter', {
      tags: selectedTagsLocal,
      showCompleted: showCompletedTasks,
      showOverdue: showOverdueTasks
    });
    showFilterMenu = false;
  }
  
  function resetFilters() {
    selectedTagsLocal = [];
    showCompletedTasks = false;
    showOverdueTasks = true;
    $selectedTags = [];
    dispatch('filter', {
      tags: [],
      showCompleted: false,
      showOverdue: true
    });
    showFilterMenu = false;
  }
  
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const filterMenu = document.getElementById('filter-menu');
    
    if (filterMenu && !filterMenu.contains(target) && showFilterMenu) {
      showFilterMenu = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative">
  <button
    class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-navy-50 {(selectedTagsLocal.length > 0 || !showOverdueTasks || showCompletedTasks) ? 'bg-navy-50 text-navy-700' : 'text-navy-500'}"
    on:click={() => showFilterMenu = !showFilterMenu}
    aria-expanded={showFilterMenu}
  >
    <Filter class="w-4 h-4" />
    <span>Filter</span>
    {#if selectedTagsLocal.length > 0 || !showOverdueTasks || showCompletedTasks}
      <span class="flex items-center justify-center w-5 h-5 bg-navy-100 text-navy-700 text-xs rounded-full">
        {selectedTagsLocal.length + (!showOverdueTasks ? 1 : 0) + (showCompletedTasks ? 1 : 0)}
      </span>
    {/if}
  </button>
  
  {#if showFilterMenu}
    <div
      id="filter-menu"
      class="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-10"
      transition:fade={{ duration: 100 }}
    >
      <div class="p-3 border-b border-gray-200">
        <h3 class="text-sm font-medium text-navy-700">Filter Tasks</h3>
      </div>
      
      <div class="p-3 border-b border-gray-200">
        <h4 class="text-xs font-medium text-navy-500 mb-2">Task Status</h4>
        
        <label class="flex items-center mb-2">
          <input 
            type="checkbox" 
            bind:checked={showCompletedTasks}
            class="w-4 h-4 text-navy-600 rounded border-gray-300 focus:ring-navy-500"
          >
          <span class="ml-2 text-sm text-gray-700">Show completed tasks</span>
        </label>
        
        <label class="flex items-center">
          <input 
            type="checkbox" 
            bind:checked={showOverdueTasks}
            class="w-4 h-4 text-navy-600 rounded border-gray-300 focus:ring-navy-500"
          >
          <span class="ml-2 text-sm text-gray-700">Show overdue tasks</span>
        </label>
      </div>
      
      {#if availableTags.length > 0}
        <div class="p-3 max-h-48 overflow-y-auto">
          <h4 class="text-xs font-medium text-navy-500 mb-2">Tags</h4>
          
          <div class="space-y-1">
            {#each availableTags as tag}
              <button
                class="flex items-center justify-between w-full px-2 py-1 text-sm text-left rounded-md {selectedTagsLocal.includes(tag) ? 'bg-navy-50 text-navy-700' : 'hover:bg-navy-50'}"
                on:click={() => toggleTag(tag)}
              >
                <span>{tag}</span>
                {#if selectedTagsLocal.includes(tag)}
                  <Check class="w-4 h-4 text-navy-600" />
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/if}
      
      <div class="flex justify-between p-3 border-t border-gray-200">
        <button
          class="text-sm text-gray-600 hover:text-gray-800"
          on:click={resetFilters}
        >
          Reset
        </button>
        
        <div class="flex gap-2">
          <button
            class="text-sm text-gray-500 hover:text-gray-700"
            on:click={() => showFilterMenu = false}
          >
            Cancel
          </button>
          
          <button
            class="text-sm bg-navy-600 text-white px-3 py-1 rounded-md hover:bg-navy-700"
            on:click={applyFilters}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>