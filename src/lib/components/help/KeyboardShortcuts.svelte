<script lang="ts">
  import { fade } from 'svelte/transition';
  import { X } from 'lucide-svelte';

  export let show = false;
  
  const shortcuts = [
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: 'n', description: 'Create new task' },
    { key: ',', description: 'Open settings' },
    { key: '/', description: 'Focus search' },
    { key: 't', description: 'Go to today' },
    { key: '←', description: 'Previous week' },
    { key: '→', description: 'Next week' },
    { key: 'Esc', description: 'Close modal / Clear search' }
  ];

  function handleClose() {
    show = false;
  }
</script>

<div 
  class="fixed inset-0 z-50 flex items-center justify-center p-4"
  class:hidden={!show}
  transition:fade={{ duration: 200 }}
>
  <div 
    class="absolute inset-0 bg-navy-900/20"
    on:click={handleClose}
  />
  
  <div 
    class="relative w-full max-w-lg bg-white rounded-lg shadow-xl"
    on:click|stopPropagation
  >
    <div class="p-6">
      <button
        class="absolute right-4 top-4 text-navy-400 hover:text-navy-600"
        on:click={handleClose}
      >
        <X class="w-5 h-5" />
      </button>

      <h2 class="text-xl font-bold mb-4">Keyboard Shortcuts</h2>

      <div class="space-y-2">
        {#each shortcuts as { key, description }}
          <div class="flex items-center justify-between">
            <span class="text-navy-600">{description}</span>
            <kbd class="px-2 py-1 bg-navy-50 rounded text-sm">{key}</kbd>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>