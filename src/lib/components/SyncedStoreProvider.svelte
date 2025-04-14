<script lang="ts">
  import { onMount, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { syncedTaskStore, syncStatus, clearSyncedStore } from '$lib/stores/synced-store';

  // Provide store as context for components
  setContext('taskStore', syncedTaskStore);
  setContext('syncStatus', syncStatus);
  
  const syncError = writable(null);
  setContext('syncError', syncError);
  
  let initializationError = false;
  
  // Initialize the store when the component mounts
  onMount(async () => {
    try {
      await syncedTaskStore.init();
    } catch (error) {
      console.error('Failed to initialize synced store:', error);
      syncError.set(error);
      initializationError = true;
    }
  });
  
  // Function to reset the store if there's an error
  async function resetStore() {
    try {
      console.log("Resetting synced store...");
      await clearSyncedStore();
      location.reload(); // Refresh the page to start fresh
    } catch (error) {
      console.error('Failed to reset synced store:', error);
      syncError.set(error);
    }
  }
  
  // Set up cleanup
  onDestroy(() => {
    syncedTaskStore.destroy();
  });
</script>

{#if initializationError}
  <div class="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-md">
      <h2 class="text-xl font-bold text-red-600 mb-4">Initialization Error</h2>
      <p class="mb-4">There was a problem initializing the data store. This could be due to data format changes.</p>
      <p class="mb-6">Would you like to reset the database? <strong>Note: This will clear all stored data.</strong></p>
      <div class="flex justify-end gap-3">
        <button 
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" 
          on:click={() => initializationError = false}
        >
          Cancel
        </button>
        <button 
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" 
          on:click={resetStore}
        >
          Reset Database
        </button>
      </div>
    </div>
  </div>
{/if}

<slot></slot>