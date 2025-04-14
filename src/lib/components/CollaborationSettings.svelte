<script lang="ts">
  import { fly } from 'svelte/transition';
  import { Users, Link, X, CheckCircle2, AlertTriangle } from 'lucide-svelte';
  import { syncedTaskStore, collaborationConfig, syncStatus } from '$lib/stores/synced-store';
  import { onDestroy } from 'svelte';
  
  export let show = false;
  
  // Local state for the form, initialized from the store
  let enabled = $collaborationConfig.enabled;
  let serverUrl = $collaborationConfig.serverUrl;
  let roomName = $collaborationConfig.roomName;
  let username = $collaborationConfig.username;
  
  // Apply the current settings to the store
  function applySettings() {
    syncedTaskStore.enableCollaboration(enabled, serverUrl, roomName, username);
  }
  
  // Update local form when store changes
  const unsubscribe = collaborationConfig.subscribe(config => {
    enabled = config.enabled;
    serverUrl = config.serverUrl;
    roomName = config.roomName;
    username = config.username;
  });
  
  onDestroy(unsubscribe);
</script>

{#if show}
  <div 
    class="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    transition:fly={{ y: -10, duration: 150 }}
  >
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-navy-900 flex items-center gap-2">
          <Users class="w-5 h-5" /> 
          Collaboration Settings
        </h2>
        <button 
          class="text-navy-400 hover:text-navy-600"
          on:click={() => show = false}
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <form 
        class="space-y-4"
        on:submit|preventDefault={applySettings}
      >
        <div class="space-y-1">
          <label class="flex items-center gap-2 font-medium">
            <input type="checkbox" bind:checked={enabled} class="w-4 h-4 rounded text-navy-600 focus:ring-navy-500" />
            Enable collaboration
          </label>
          <p class="text-xs text-navy-500 ml-6">When enabled, changes will be synchronized in real-time with other users in the same room.</p>
        </div>
        
        <div class="space-y-1">
          <label for="server-url" class="block text-sm font-medium text-navy-700">WebSocket Server URL</label>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-navy-300 bg-navy-50 text-navy-500 text-sm">
              <Link class="w-4 h-4" />
            </span>
            <input
              type="text"
              id="server-url"
              bind:value={serverUrl}
              disabled={!enabled}
              class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-navy-300 focus:ring-navy-500 focus:border-navy-500 disabled:bg-navy-50 disabled:text-navy-400"
              placeholder="ws://localhost:1234"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label for="room-name" class="block text-sm font-medium text-navy-700">Room Name</label>
            <input
              type="text"
              id="room-name"
              bind:value={roomName}
              disabled={!enabled}
              class="block w-full px-3 py-2 rounded-md border border-navy-300 focus:ring-navy-500 focus:border-navy-500 disabled:bg-navy-50 disabled:text-navy-400"
              placeholder="default-room"
            />
            <p class="text-xs text-navy-500">Users in the same room will share data</p>
          </div>
          
          <div class="space-y-1">
            <label for="username" class="block text-sm font-medium text-navy-700">Display Name</label>
            <input
              type="text"
              id="username"
              bind:value={username}
              disabled={!enabled}
              class="block w-full px-3 py-2 rounded-md border border-navy-300 focus:ring-navy-500 focus:border-navy-500 disabled:bg-navy-50 disabled:text-navy-400"
              placeholder="Anonymous"
            />
            <p class="text-xs text-navy-500">Shown to other collaborators</p>
          </div>
        </div>
        
        {#if enabled && $syncStatus.error}
          <div class="bg-red-50 border-l-4 border-red-500 p-3">
            <div class="flex items-start">
              <AlertTriangle class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p class="text-sm text-red-700">
                Connection error: {$syncStatus.error.message}
              </p>
            </div>
          </div>
        {/if}
        
        {#if enabled && $syncStatus.connected}
          <div class="bg-green-50 border-l-4 border-green-500 p-3">
            <div class="flex items-start">
              <CheckCircle2 class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm text-green-700">
                  Connected to room: <span class="font-semibold">{$syncStatus.roomName}</span>
                </p>
                <p class="text-xs text-green-600 mt-1">
                  {$syncStatus.peers === 0 ? 'No other users connected' : `${$syncStatus.peers} other ${$syncStatus.peers === 1 ? 'user' : 'users'} collaborating`}
                </p>
              </div>
            </div>
          </div>
        {/if}
        
        <div class="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            on:click={() => show = false}
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-navy-600 text-white rounded hover:bg-navy-700"
          >
            Apply Settings
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}