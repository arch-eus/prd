<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Download, Upload, Trash2, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-svelte';
  import { exportTasks, importTasks, clearBrowserData } from '$lib/utils/storage/exportImport';
  import { get } from 'svelte/store';
  import { taskStore } from '$lib/stores/task';
  
  const dispatch = createEventDispatcher();
  let importing = false;
  let exporting = false;
  let clearing = false;
  let fileInput: HTMLInputElement;
  let importMode: 'replace' | 'merge' = 'replace';
  let importStats = { added: 0, replaced: 0 };
  let showClearConfirm = false;
  let statusMessage = '';
  let statusType: 'success' | 'error' | 'none' = 'none';

  async function handleExport() {
    try {
      exporting = true;
      exportTasks();
      
      // Show success message
      const taskCount = get(taskStore).tasks.length;
      statusMessage = `Exported ${taskCount} tasks successfully`;
      statusType = 'success';
      setTimeout(() => { statusType = 'none'; }, 3000);
    } catch (error) {
      statusMessage = 'Failed to export tasks';
      statusType = 'error';
      setTimeout(() => { statusType = 'none'; }, 3000);
    } finally {
      exporting = false;
    }
  }

  async function handleImport(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    try {
      importing = true;
      importStats = await importTasks(input.files[0], { replace: importMode === 'replace' });
      
      statusMessage = importMode === 'replace'
        ? `Imported ${importStats.added} tasks successfully`
        : `Imported ${importStats.added} new and updated ${importStats.replaced} existing tasks`;
      
      statusType = 'success';
      setTimeout(() => { statusType = 'none'; }, 3000);
    } catch (error) {
      statusMessage = 'Failed to import tasks';
      statusType = 'error';
      setTimeout(() => { statusType = 'none'; }, 3000);
    } finally {
      importing = false;
      input.value = ''; // Reset input
    }
  }

  function promptClearData() {
    showClearConfirm = true;
  }

  async function handleClearData() {
    try {
      clearing = true;
      await clearBrowserData();
      statusMessage = 'Data cleared successfully';
      statusType = 'success';
      setTimeout(() => {
        window.location.reload(); // Refresh to reset app state 
      }, 1000);
    } catch (error) {
      statusMessage = 'Failed to clear data';
      statusType = 'error';
      setTimeout(() => { statusType = 'none'; }, 3000);
    } finally {
      clearing = false;
      showClearConfirm = false;
    }
  }

  function cancelClearData() {
    showClearConfirm = false;
  }
</script>

<div class="space-y-5">
  <!-- Status message -->
  {#if statusType !== 'none'}
    <div 
      class="py-2 px-3 rounded-md text-sm flex items-center gap-2" 
      class:bg-green-50={statusType === 'success'} 
      class:text-green-700={statusType === 'success'}
      class:bg-red-50={statusType === 'error'} 
      class:text-red-700={statusType === 'error'}
    >
      {#if statusType === 'success'}
        <CheckCircle2 class="w-4 h-4 text-green-600" />
      {:else}
        <AlertTriangle class="w-4 h-4 text-red-600" />
      {/if}
      {statusMessage}
    </div>
  {/if}

  <div class="flex flex-col gap-4">
    <!-- Export section -->
    <div class="bg-navy-50 p-4 rounded-md">
      <h3 class="text-md font-medium text-navy-900 mb-3">Export Tasks</h3>
      <p class="text-sm text-navy-600 mb-3">
        Export all your tasks as a JSON file that you can back up or transfer to another device.
      </p>
      <button
        on:click={handleExport}
        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-navy-600 text-white hover:bg-navy-700 rounded-md transition-colors"
        disabled={exporting}
      >
        {#if exporting}
          <RefreshCw class="w-4 h-4 animate-spin" />
          Exporting...
        {:else}
          <Download class="w-4 h-4" />
          Export Tasks
        {/if}
      </button>
    </div>

    <!-- Import section -->
    <div class="bg-navy-50 p-4 rounded-md">
      <h3 class="text-md font-medium text-navy-900 mb-3">Import Tasks</h3>
      <p class="text-sm text-navy-600 mb-3">
        Import tasks from a previously exported JSON file.
      </p>
      
      <div class="mb-3">
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 text-sm text-navy-700">
            <input 
              type="radio" 
              name="importMode" 
              value="replace" 
              bind:group={importMode}
              class="text-navy-600 focus:ring-navy-500" 
            />
            Replace all tasks
          </label>
          
          <label class="flex items-center gap-2 text-sm text-navy-700">
            <input 
              type="radio" 
              name="importMode" 
              value="merge" 
              bind:group={importMode}
              class="text-navy-600 focus:ring-navy-500" 
            />
            Merge with existing tasks
          </label>
        </div>
      </div>
      
      <button
        on:click={() => fileInput.click()}
        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-navy-600 text-white hover:bg-navy-700 rounded-md transition-colors"
        disabled={importing}
      >
        {#if importing}
          <RefreshCw class="w-4 h-4 animate-spin" />
          Importing...
        {:else}
          <Upload class="w-4 h-4" />
          Select File to Import
        {/if}
      </button>
    </div>

    <!-- Clear data section -->
    <div class="bg-red-50 p-4 rounded-md">
      <h3 class="text-md font-medium text-red-900 mb-3">Clear All Data</h3>
      <p class="text-sm text-red-700 mb-3">
        This will permanently delete all your tasks and settings. This action cannot be undone.
      </p>
      
      {#if !showClearConfirm}
        <button
          on:click={promptClearData}
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
        >
          <Trash2 class="w-4 h-4" />
          Clear All Data
        </button>
      {:else}
        <div class="border border-red-300 rounded-md p-3 bg-white">
          <p class="text-sm text-red-700 font-bold mb-2">Are you absolutely sure?</p>
          <p class="text-xs text-red-600 mb-3">
            All your tasks and settings will be permanently deleted. You cannot undo this action.
          </p>
          <div class="flex gap-2">
            <button
              on:click={cancelClearData}
              class="flex-1 py-2 text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
              disabled={clearing}
            >
              Cancel
            </button>
            <button
              on:click={handleClearData}
              class="flex-1 py-2 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors flex justify-center items-center gap-1"
              disabled={clearing}
            >
              {#if clearing}
                <RefreshCw class="w-3 h-3 animate-spin" />
                Clearing...
              {:else}
                Yes, Delete Everything
              {/if}
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <input
    bind:this={fileInput}
    type="file"
    accept=".json"
    on:change={handleImport}
    class="hidden"
  />
</div>