<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { 
    X, 
    Key, 
    Server, 
    Database, 
    Eye, 
    EyeOff, 
    Share2, 
    Copy, 
    Undo, 
    RotateCw, 
    AlertTriangle
  } from 'lucide-svelte';
  import DataManagement from '../settings/DataManagement.svelte';
  import { syncStatus } from '$lib/stores/synced-store';
  import { currentMnemonic, roomId, initMnemonicFromStorage, generateMnemonic, changeMnemonic, validateMnemonic } from '$lib/utils/mnemonic-manager';

  export let show = false;
  const dispatch = createEventDispatcher();

  // Tab control
  let activeTab: 'sync' | 'data' = 'sync';

  // UI state for sync tab
  let showMnemonic = false;
  let copySuccess = false;
  let showRestoreForm = false;
  let showResetConfirm = false;
  let validationError = '';
  let restoreMnemonic = '';

  onMount(() => {
    // Initialize mnemonic from storage
    initMnemonicFromStorage();
  });

  function handleClose() {
    show = false;
    dispatch('close');
    showRestoreForm = false;
    showResetConfirm = false;
    restoreMnemonic = '';
    validationError = '';
  }

  function handleSuccess(event: CustomEvent) {
    dispatch('success', event.detail);
  }

  function handleError(event: CustomEvent) {
    dispatch('error', event.detail);
  }

  function toggleMnemonicVisibility() {
    showMnemonic = !showMnemonic;
  }
  
  function copyMnemonicToClipboard() {
    if (!$currentMnemonic) return;
    
    try {
      navigator.clipboard.writeText($currentMnemonic);
      copySuccess = true;
      
      // Clear display after 2 seconds
      setTimeout(() => copySuccess = false, 2000);
      
      // For security, clear clipboard after 60 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('Clipboard cleared for security');
      }, 60000);
    } catch (error) {
      console.error('Failed to copy mnemonic:', error);
    }
  }
  
  function copyShareLink() {
    if (!$currentMnemonic) return;
    
    try {
      const baseUrl = window.location.origin;
      const encodedMnemonic = encodeURIComponent($currentMnemonic);
      const link = `${baseUrl}?passphrase=${encodedMnemonic}`;
      
      navigator.clipboard.writeText(link);
      copySuccess = true;
      
      // Clear display after 2 seconds
      setTimeout(() => copySuccess = false, 2000);
      
      // For security, clear clipboard after 60 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('Clipboard cleared for security');
      }, 60000);
    } catch (error) {
      console.error('Failed to copy share link:', error);
    }
  }
  
  function validatePassphrase(phrase: string): string | null {
    if (!phrase.trim()) return 'Passphrase cannot be empty';
    
    const words = phrase.trim().split(/\s+/);
    if (words.length < 3) return 'Passphrase must contain at least 3 words';
    
    if (!validateMnemonic(phrase)) return 'Invalid passphrase format';
    
    return null; // No error
  }
  
  async function restorePassphrase() {
    const error = validatePassphrase(restoreMnemonic);
    if (error) {
      validationError = error;
      return;
    }
    
    try {
      const success = await changeMnemonic(restoreMnemonic);
      if (success) {
        showRestoreForm = false;
        restoreMnemonic = '';
      } else {
        validationError = 'Failed to restore passphrase';
      }
    } catch (error) {
      console.error('Failed to restore passphrase:', error);
      validationError = 'An error occurred while restoring the passphrase';
    }
  }
  
  async function resetPassphrase() {
    if (!showResetConfirm) {
      showResetConfirm = true;
      return;
    }
    
    try {
      const newMnemonic = await generateMnemonic(5);
      const success = await changeMnemonic(newMnemonic);
      if (success) {
        showResetConfirm = false;
      } else {
        console.error('Failed to reset passphrase');
      }
    } catch (error) {
      console.error('Error during passphrase reset:', error);
    }
  }
  
  function cancelRestore() {
    showRestoreForm = false;
    restoreMnemonic = '';
    validationError = '';
  }
  
  function cancelReset() {
    showResetConfirm = false;
  }
</script>

<div
  class="fixed inset-0 z-[100] flex items-center justify-center p-4"
  class:hidden={!show}
  transition:fade={{ duration: 200 }}
>
  <div
    class="fixed inset-0 bg-navy-900/20"
    on:click={handleClose}
  />
  
  <div
    class="relative w-full max-w-lg bg-surface rounded-lg shadow-xl"
    on:click|stopPropagation
  >
    <div class="p-6">
      <button
        class="absolute right-4 top-4 text-navy-400 hover:text-navy-600"
        on:click={handleClose}
      >
        <X class="w-5 h-5" />
      </button>

      <h2 class="text-xl font-bold mb-4 text-navy-900">Settings</h2>

      <!-- Tab Navigation -->
      <div class="flex border-b border-navy-200 mb-6">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2"
          class:border-navy-600={activeTab === 'sync'}
          class:text-navy-900={activeTab === 'sync'}
          class:border-transparent={activeTab !== 'sync'}
          class:text-navy-500={activeTab !== 'sync'}
          class:hover:text-navy-700={activeTab !== 'sync'}
          on:click={() => activeTab = 'sync'}
        >
          <Server class="w-4 h-4" />
          Synchronization
        </button>
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2"
          class:border-navy-600={activeTab === 'data'}
          class:text-navy-900={activeTab === 'data'}
          class:border-transparent={activeTab !== 'data'}
          class:text-navy-500={activeTab !== 'data'}
          class:hover:text-navy-700={activeTab !== 'data'}
          on:click={() => activeTab = 'data'}
        >
          <Database class="w-4 h-4" />
          Data Management
        </button>
      </div>

      {#if activeTab === 'sync'}
        <!-- Synchronization Tab Content -->
        <div class="space-y-6">
          <div>
            <h3 class="text-md font-semibold mb-3 text-navy-800 flex items-center gap-2">
              <Key class="w-4 h-4" />
              Passphrase
            </h3>
            
            <p class="text-sm text-navy-600 mb-4">
              Your passphrase is the key to your data. It determines which collaboration room you join and encrypts your data.
            </p>
            
            {#if !showRestoreForm && !showResetConfirm}
              <div class="space-y-4">
                <!-- Current Passphrase -->
                <div class="bg-navy-50 p-3 rounded-md">
                  <div class="flex">
                    <input
                      type={showMnemonic ? 'text' : 'password'}
                      value={$currentMnemonic || ''}
                      readonly
                      class="flex-1 bg-navy-50 border-none focus:ring-0 font-mono text-navy-800"
                    />
                    <button
                      class="text-navy-500 hover:text-navy-700"
                      on:click={toggleMnemonicVisibility}
                      title={showMnemonic ? 'Hide passphrase' : 'Show passphrase'}
                    >
                      {#if showMnemonic}
                        <EyeOff class="w-4 h-4" />
                      {:else}
                        <Eye class="w-4 h-4" />
                      {/if}
                    </button>
                  </div>
                  
                  <div class="mt-2 flex gap-2 justify-end">
                    <button
                      class="px-3 py-1 text-xs bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-md flex items-center gap-1"
                      on:click={copyMnemonicToClipboard}
                    >
                      <Copy class="w-3 h-3" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      class="px-3 py-1 text-xs bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-md flex items-center gap-1"
                      on:click={copyShareLink}
                    >
                      <Share2 class="w-3 h-3" />
                      Share Link
                    </button>
                  </div>
                </div>
                
                <!-- Room ID Info -->
                <div class="text-sm text-navy-600 flex items-center justify-between">
                  <span>Room ID: <span class="font-mono text-xs">
                    {#if $roomId && typeof $roomId === 'string' && $roomId.length > 12}
                      {$roomId.substring(0, 8)}...{$roomId.substring($roomId.length - 4)}
                    {:else}
                      {$roomId || 'Not available'}
                    {/if}
                  </span></span>
                  
                  <span class="{$syncStatus.connected ? 'text-green-600' : 'text-navy-500'} text-xs">
                    {$syncStatus.connected 
                      ? `${$syncStatus.peers} peer${$syncStatus.peers === 1 ? '' : 's'} connected` 
                      : 'Not connected'}
                  </span>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex gap-2 mt-4">
                  <button
                    class="flex-1 px-3 py-2 border border-navy-300 text-navy-700 hover:bg-navy-50 rounded-md text-sm flex items-center justify-center gap-1"
                    on:click={() => showRestoreForm = true}
                  >
                    <Undo class="w-4 h-4" />
                    Restore Passphrase
                  </button>
                  <button
                    class="flex-1 px-3 py-2 border border-navy-300 text-navy-700 hover:bg-navy-50 rounded-md text-sm flex items-center justify-center gap-1"
                    on:click={resetPassphrase}
                  >
                    <RotateCw class="w-4 h-4" />
                    Reset Passphrase
                  </button>
                </div>
              </div>
            {/if}
            
            <!-- Restore Form -->
            {#if showRestoreForm}
              <div class="border border-navy-200 rounded-md p-4">
                <h4 class="font-medium text-navy-800 mb-2">Restore Passphrase</h4>
                <p class="text-sm text-navy-600 mb-3">
                  Enter your existing passphrase to restore access to your data.
                </p>
                
                <div class="mb-4">
                  <input
                    type="text"
                    bind:value={restoreMnemonic}
                    placeholder="Enter your passphrase..."
                    class="w-full p-2 border border-navy-300 rounded-md"
                  />
                  {#if validationError}
                    <p class="mt-1 text-xs text-red-600">{validationError}</p>
                  {/if}
                </div>
                
                <div class="flex justify-end gap-2">
                  <button 
                    class="px-3 py-1.5 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-md text-sm"
                    on:click={cancelRestore}
                  >
                    Cancel
                  </button>
                  <button 
                    class="px-3 py-1.5 bg-navy-600 hover:bg-navy-700 text-white rounded-md text-sm"
                    on:click={restorePassphrase}
                  >
                    Restore
                  </button>
                </div>
              </div>
            {/if}
            
            <!-- Reset Confirmation -->
            {#if showResetConfirm}
              <div class="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-md">
                <div class="flex items-start">
                  <AlertTriangle class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p class="text-sm text-red-700 font-medium">Warning: You will lose access to your current data</p>
                    <p class="text-xs text-red-600 mt-1">
                      Resetting your passphrase will create a new empty workspace. If you want to access your current data later, make sure to save your current passphrase first.
                    </p>
                    <div class="mt-3 flex gap-2">
                      <button 
                        class="px-3 py-1.5 bg-navy-200 hover:bg-navy-300 text-navy-800 rounded-md text-sm"
                        on:click={cancelReset}
                      >
                        Cancel
                      </button>
                      <button 
                        class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                        on:click={resetPassphrase}
                      >
                        Reset Passphrase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {:else if activeTab === 'data'}
        <!-- Data Management Tab Content -->
        <DataManagement
          on:success={handleSuccess}
          on:error={handleError}
        />
      {/if}
    </div>
  </div>
</div>