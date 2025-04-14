<script lang="ts">
  import { selectedTags as tagStore } from '$lib/stores/filters';
  import { Calendar, CheckSquare, RotateCcw, Book, Settings } from 'lucide-svelte';
  import QuickTags from '../QuickTags.svelte';
  import { page } from '$app/stores';
  import { syncStatus } from '$lib/stores/synced-store';
</script>

<nav class="p-4 space-y-6 font-jetbrains-mono">
  <div class="space-y-2">
    <h3 class="px-4 text-sm font-medium text-navy-400">Tasks</h3>
    <a
      href="/"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
        {$page.url.pathname === '/' ? 'bg-navy-600 text-white' : 'text-navy-800 hover:bg-navy-50'}"
    >
      <Calendar class="w-4 h-4" />
      Overview
    </a>
    <a
      href="/recurring"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
        {$page.url.pathname === '/recurring' ? 'bg-navy-600 text-white' : 'text-navy-800 hover:bg-navy-50'}"
    >
      <RotateCcw class="w-4 h-4" />
      Recurring
    </a>
    <a
      href="/completed"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
        {$page.url.pathname === '/completed' ? 'bg-navy-600 text-white' : 'text-navy-800 hover:bg-navy-50'}"
    >
      <CheckSquare class="w-4 h-4" />
      Completed
    </a>
    <a
      href="/logbook"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
        {$page.url.pathname === '/logbook' ? 'bg-navy-600 text-white' : 'text-navy-800 hover:bg-navy-50'}"
    >
      <Book class="w-4 h-4" />
      Logbook
    </a>
  </div>

  <div class="space-y-2">
    <h3 class="px-4 text-sm font-medium text-navy-400">Tags</h3>
    <div class="px-4">
      <QuickTags 
        vertical={true}
      />
    </div>
  </div>
  
  <div class="space-y-2">
    <h3 class="px-4 text-sm font-medium text-navy-400">App</h3>
    <div class="px-4">
      <button 
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50 rounded-md transition-colors w-full"
        on:click={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: ',' }))}
      >
        <Settings class="w-4 h-4" />
        Settings <span class="text-xs text-navy-400 ml-auto">,</span>
      </button>
    </div>
  </div>
</nav>

<!-- Status indicator at the bottom -->
<div class="absolute bottom-2 left-4 text-xs text-navy-400 flex items-center gap-1.5">
  {#if $syncStatus.error}
    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
    <span>Offline</span>
  {:else if $syncStatus.syncing}
    <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
    <span>Syncing</span>
  {:else if $syncStatus.connected}
    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
    <span>Online</span>
  {:else}
    <div class="w-2 h-2 bg-navy-400 rounded-full"></div>
    <span>Offline</span>
  {/if}
</div>