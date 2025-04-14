<script lang="ts">
  import { searchResults, searchQuery, isSearchActive } from '$lib/stores/search';
  import TaskItem from '../TaskItem.svelte';
  import { syncedTaskStore as taskStore } from '$lib/stores/synced-store';
  import { createEventDispatcher } from 'svelte';
  
  export let showResults = true;
  
  const dispatch = createEventDispatcher();

  function handleComplete(event: CustomEvent) {
    const taskId = event.detail.id;
    const task = $searchResults.find(t => t.id === taskId);
    if (!task) return;
    
    if (task.status === 'completed') {
      // Uncomplete task
      taskStore.updateTask(taskId, { 
        status: 'todo',
        completedAt: undefined
      });
    } else {
      // Complete task (handles recurrence internally)
      taskStore.completeTask(taskId);
    }
  }
</script>

{#if $isSearchActive && $searchQuery && showResults}
  <div class="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-40 max-h-[70vh] overflow-y-auto">
    <div class="p-2">
      <h3 class="text-sm font-medium text-navy-700 p-2">
        Search Results {#if $searchResults.length > 0}({$searchResults.length}){/if}
      </h3>
      
      {#if $searchResults.length === 0}
        <p class="p-4 text-navy-500 text-center">No results found</p>
      {:else}
        <div class="space-y-2">
          {#each $searchResults as task (task.id)}
            <div class="p-1 hover:bg-navy-50 rounded-md">
              <TaskItem 
                {task}
                compact={true}
                on:complete={handleComplete}
                on:delete={() => taskStore.deleteTask(task.id)}
                on:edit
                on:showDetails
              />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}