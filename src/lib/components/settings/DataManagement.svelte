<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Download, Upload, Trash2 } from 'lucide-svelte';
  import { exportTasks, importTasks, clearBrowserData } from '$lib/utils/storage/exportImport';
  
  const dispatch = createEventDispatcher();
  let importing = false;
  let fileInput: HTMLInputElement;

  async function handleImport(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    try {
      importing = true;
      await importTasks(input.files[0]);
      dispatch('success', { message: 'Tasks imported successfully' });
    } catch (error) {
      dispatch('error', { message: 'Failed to import tasks' });
    } finally {
      importing = false;
      input.value = ''; // Reset input
    }
  }

  async function handleClearData() {
    if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      return;
    }

    try {
      await clearBrowserData();
      dispatch('success', { message: 'Data cleared successfully' });
      window.location.reload(); // Refresh to reset app state
    } catch (error) {
      dispatch('error', { message: 'Failed to clear data' });
    }
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-medium text-navy-900">Data Management</h3>
  </div>

  <div class="flex flex-col gap-2">
    <button
      on:click={exportTasks}
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded-md transition-colors"
    >
      <Download class="w-4 h-4" />
      Export Tasks
    </button>

    <button
      on:click={() => fileInput.click()}
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded-md transition-colors"
      class:opacity-50={importing}
      disabled={importing}
    >
      <Upload class="w-4 h-4" />
      Import Tasks
      {#if importing}
        <span class="ml-2">Importing...</span>
      {/if}
    </button>

    <button
      on:click={handleClearData}
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
    >
      <Trash2 class="w-4 h-4" />
      Clear All Data
    </button>
  </div>

  <input
    bind:this={fileInput}
    type="file"
    accept=".json"
    on:change={handleImport}
    class="hidden"
  />
</div>