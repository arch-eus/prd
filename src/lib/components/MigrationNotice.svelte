<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { get } from 'idb-keyval';

  export let show = false;
  export let migrationCount = 0;
  
  const MIGRATION_FLAG_KEY = 'evolu_migration_completed';
  let showBanner = false;
  
  onMount(async () => {
    // Only show the banner if:
    // 1. We're told to show it
    // 2. Migration has completed
    // 3. We actually migrated some tasks
    if (show && migrationCount > 0) {
      const migrationCompleted = await get(MIGRATION_FLAG_KEY);
      if (migrationCompleted) {
        showBanner = true;
        
        // Hide the banner after 8 seconds
        setTimeout(() => {
          showBanner = false;
        }, 8000);
      }
    }
  });
  
  function dismiss() {
    showBanner = false;
  }
</script>

{#if showBanner}
  <div 
    class="fixed bottom-5 right-5 z-50 p-4 bg-white rounded-lg shadow-md border border-blue-200 max-w-md"
    in:fly={{ y: 50, duration: 400 }}
    out:fade={{ duration: 300 }}
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <!-- Success Icon -->
        <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div class="ml-3 w-0 flex-1 pt-0.5">
        <p class="text-sm font-medium text-gray-900">
          Migration Complete
        </p>
        <p class="mt-1 text-sm text-gray-500">
          {migrationCount} task{migrationCount !== 1 ? 's' : ''} successfully migrated to the new storage system. You can now use the app offline and your data will sync automatically when you reconnect.
        </p>
      </div>
      
      <div class="ml-4 flex-shrink-0 flex">
        <button 
          on:click={dismiss}
          class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span class="sr-only">Close</span>
          <!-- Close Icon -->
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}