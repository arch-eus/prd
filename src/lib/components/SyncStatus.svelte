<script lang="ts">
  import { syncStatus, clearSyncedStore, collaborationConfig } from '$lib/stores/synced-store';
  import { CloudOff, CloudDrizzle, CheckCircle2, RefreshCw, Users } from 'lucide-svelte';
  import { fly } from 'svelte/transition';
  import CollaborationSettings from './CollaborationSettings.svelte';
  
  let showResetConfirm = false;
  let resetting = false;
  let showCollaborationSettings = false;
  
  async function resetDatabase() {
    if (resetting) return;
    
    try {
      resetting = true;
      await clearSyncedStore();
      location.reload();
    } catch (error) {
      console.error("Error resetting database:", error);
      resetting = false;
      showResetConfirm = false;
    }
  }
</script>

<div class="relative px-4 py-2 text-sm font-medium">
  {#if $syncStatus.error}
    <div class="flex items-center gap-2 text-red-600">
      <CloudOff class="w-4 h-4" />
      <span>Sync error</span>
    </div>
  {:else if $syncStatus.syncing}
    <div class="flex items-center gap-2 text-navy-600">
      <CloudDrizzle class="w-4 h-4 animate-pulse" />
      <span>Syncing...</span>
    </div>
  {:else if $syncStatus.connected}
    <div class="flex items-center gap-2 text-green-600">
      <CheckCircle2 class="w-4 h-4" />
      <span>Synced</span>
    </div>
  {:else}
    <div class="flex items-center gap-2 text-navy-400">
      <CloudOff class="w-4 h-4" />
      <span>Offline</span>
    </div>
  {/if}
  
  {#if $collaborationConfig.enabled}
    <div class="mt-2 flex items-center gap-2 {$syncStatus.connected ? 'text-green-600' : 'text-navy-400'}">
      <Users class="w-4 h-4" />
      <span>
        {$syncStatus.connected 
          ? ($syncStatus.peers > 0 
            ? `${$syncStatus.peers} peer${$syncStatus.peers === 1 ? '' : 's'}` 
            : 'No peers') 
          : 'Disconnected'}
      </span>
    </div>
  {/if}
  
  <div class="flex flex-col gap-2 mt-4">
    <button 
      class="flex items-center gap-1 text-xs text-navy-400 hover:text-navy-600 transition-colors"
      on:click={() => showCollaborationSettings = true}
    >
      <Users class="w-3 h-3" />
      Collaboration Settings
    </button>
    
    <button 
      class="flex items-center gap-1 text-xs text-navy-400 hover:text-navy-600 transition-colors"
      on:click={() => showResetConfirm = true}
    >
      <RefreshCw class="w-3 h-3" />
      Reset Database
    </button>
  </div>
  
  {#if showResetConfirm}
    <div 
      class="absolute left-0 top-full mt-2 p-4 bg-white rounded-md shadow-lg border border-navy-100 z-10 w-60"
      transition:fly={{ y: -10, duration: 150 }}
    >
      <h4 class="font-bold text-navy-900 mb-2">Confirm Reset</h4>
      <p class="text-navy-700 text-xs mb-3">
        This will delete all local data. This action cannot be undone.
      </p>
      <div class="flex justify-end gap-2">
        <button 
          class="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
          on:click={() => showResetConfirm = false}
          disabled={resetting}
        >
          Cancel
        </button>
        <button 
          class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          on:click={resetDatabase}
          disabled={resetting}
        >
          {resetting ? 'Resetting...' : 'Reset'}
        </button>
      </div>
    </div>
  {/if}

  <CollaborationSettings bind:show={showCollaborationSettings} />
</div>