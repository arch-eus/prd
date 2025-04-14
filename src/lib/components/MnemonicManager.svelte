<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Key, Users, Copy, RefreshCw, Eye, EyeOff, AlertTriangle, CheckCircle2, Share2 } from 'lucide-svelte';
  import { currentMnemonic, roomId, initMnemonicFromStorage, generateMnemonic, changeMnemonic, validateMnemonic } from '$lib/utils/mnemonic-manager';
  import { syncStatus } from '$lib/stores/synced-store';
  
  export let show = false;
  
  // UI state
  let showMnemonic = false;
  let copySuccess = false;
  let showResetConfirm = false;
  let validationError = '';
  let joinMnemonic = '';
  let showJoinForm = false;
  
  onMount(() => {
    // Initialize mnemonic from storage
    initMnemonicFromStorage();
  });
  
  function toggleMnemonicVisibility() {
    showMnemonic = !showMnemonic;
  }
  
  function copyMnemonicToClipboard() {
    if (!$currentMnemonic) return;
    
    try {
      navigator.clipboard.writeText($currentMnemonic);
      copySuccess = true;
      setTimeout(() => copySuccess = false, 2000);
    } catch (error) {
      console.error('Failed to copy mnemonic:', error);
    }
  }
  
  function resetMnemonic() {
    if (!showResetConfirm) {
      showResetConfirm = true;
      return;
    }
    
    try {
      const newMnemonic = generateMnemonic();
      changeMnemonic(newMnemonic);
      showResetConfirm = false;
    } catch (error) {
      console.error('Failed to reset mnemonic:', error);
    }
  }
  
  function joinExistingRoom() {
    validationError = '';
    
    if (!joinMnemonic) {
      validationError = 'Please enter a mnemonic';
      return;
    }
    
    if (!validateMnemonic(joinMnemonic)) {
      validationError = 'Invalid mnemonic phrase';
      return;
    }
    
    try {
      changeMnemonic(joinMnemonic);
      showJoinForm = false;
      joinMnemonic = '';
    } catch (error) {
      console.error('Failed to join room:', error);
      validationError = 'Failed to join room';
    }
  }
  
  function getShareLink() {
    // Creates a shareable link containing the mnemonic
    if (!$currentMnemonic) return '';
    
    try {
      const baseUrl = window.location.origin;
      const encodedMnemonic = encodeURIComponent($currentMnemonic);
      return `${baseUrl}?join=${encodedMnemonic}`;
    } catch (error) {
      console.error('Failed to create share link:', error);
      return '';
    }
  }
  
  function copyShareLink() {
    const link = getShareLink();
    if (!link) return;
    
    try {
      navigator.clipboard.writeText(link);
      copySuccess = true;
      setTimeout(() => copySuccess = false, 2000);
    } catch (error) {
      console.error('Failed to copy share link:', error);
    }
  }
</script>

{#if show}
  <div 
    class="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    transition:fade={{ duration: 150 }}
  >
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-navy-900 flex items-center gap-2">
          <Key class="w-5 h-5" /> 
          Collaboration Access
        </h2>
        <button 
          class="text-navy-400 hover:text-navy-600"
          on:click={() => show = false}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="space-y-6">
        <!-- Current Room Info -->
        <div class="bg-navy-50 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-navy-800 flex items-center gap-2">
              <Users class="w-4 h-4" />
              Your Collaboration Room
            </h3>
            <span class="text-sm {$syncStatus.connected ? 'text-green-600' : 'text-navy-500'}">
              {$syncStatus.connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          
          <div class="text-sm text-navy-600">
            <p class="mb-1">Room ID: <span class="font-medium">{$roomId?.substring(0, 8)}...{$roomId?.substring($roomId.length - 4)}</span></p>
            <p>{$syncStatus.peers} peer{$syncStatus.peers === 1 ? '' : 's'} connected</p>
          </div>
        </div>
        
        <!-- Mnemonic Display/Management -->
        <div>
          <label class="block text-sm font-medium text-navy-700 mb-2">Your Access Phrase</label>
          <div class="mb-2 relative">
            <div class="flex">
              <input
                type={showMnemonic ? 'text' : 'password'}
                value={$currentMnemonic || ''}
                readonly
                class="flex-1 block w-full p-2.5 border border-r-0 border-navy-300 rounded-l-md bg-navy-50 text-navy-900"
              />
              <button
                class="bg-navy-100 border border-navy-300 px-3 hover:bg-navy-200 rounded-r-md"
                on:click={toggleMnemonicVisibility}
                title={showMnemonic ? 'Hide phrase' : 'Show phrase'}
              >
                {#if showMnemonic}
                  <EyeOff class="w-4 h-4" />
                {:else}
                  <Eye class="w-4 h-4" />
                {/if}
              </button>
            </div>
            <p class="mt-1 text-xs text-navy-500">This access phrase is the key to your data. Anyone with this phrase can access your tasks.</p>
          </div>
          
          <div class="flex gap-2">
            <button
              class="flex-1 px-3 py-1.5 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-md text-sm flex items-center justify-center gap-1"
              on:click={copyMnemonicToClipboard}
            >
              <Copy class="w-3.5 h-3.5" />
              {copySuccess ? 'Copied!' : 'Copy Phrase'}
            </button>
            <button
              class="flex-1 px-3 py-1.5 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-md text-sm flex items-center justify-center gap-1"
              on:click={copyShareLink}
            >
              <Share2 class="w-3.5 h-3.5" />
              {copySuccess ? 'Copied!' : 'Copy Share Link'}
            </button>
          </div>
        </div>
        
        <!-- Join Existing Room -->
        <div>
          {#if showJoinForm}
            <div class="border border-navy-200 rounded-md p-3">
              <h3 class="font-medium text-navy-800 mb-2">Join Existing Room</h3>
              <div class="mb-3">
                <label class="block text-sm text-navy-700 mb-1">Enter Access Phrase</label>
                <input
                  type="text"
                  bind:value={joinMnemonic}
                  placeholder="Enter the access phrase..."
                  class="w-full p-2 border border-navy-300 rounded-md"
                />
                {#if validationError}
                  <p class="mt-1 text-xs text-red-600">{validationError}</p>
                {/if}
              </div>
              <div class="flex gap-2">
                <button
                  class="flex-1 px-3 py-1.5 bg-navy-600 hover:bg-navy-700 text-white rounded-md text-sm"
                  on:click={joinExistingRoom}
                >
                  Join Room
                </button>
                <button
                  class="px-3 py-1.5 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-md text-sm"
                  on:click={() => {
                    showJoinForm = false;
                    joinMnemonic = '';
                    validationError = '';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          {:else}
            <button
              class="w-full px-3 py-2 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-md text-sm flex items-center justify-center gap-1"
              on:click={() => showJoinForm = true}
            >
              <Users class="w-4 h-4" />
              Join Existing Room
            </button>
          {/if}
        </div>
        
        <!-- Reset Mnemonic Warning -->
        {#if showResetConfirm}
          <div class="border-l-4 border-red-500 bg-red-50 p-3">
            <div class="flex items-start">
              <AlertTriangle class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm text-red-700 font-medium">Warning: This will create a new room</p>
                <p class="text-xs text-red-600 mt-1">
                  Creating a new access phrase will disconnect you from your current room and create a new one.
                  You will lose access to all current tasks unless you save your current phrase.
                </p>
                <div class="mt-2 flex gap-2">
                  <button 
                    class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    on:click={resetMnemonic}
                  >
                    Yes, Create New Room
                  </button>
                  <button 
                    class="px-2 py-1 text-xs bg-navy-200 rounded hover:bg-navy-300"
                    on:click={() => showResetConfirm = false}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        {:else}
          <button
            class="w-full px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-md text-sm flex items-center justify-center gap-1"
            on:click={() => showResetConfirm = true}
          >
            <RefreshCw class="w-4 h-4" />
            Generate New Access Phrase
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}