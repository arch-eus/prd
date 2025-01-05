<script lang="ts">
  import { Search, X } from 'lucide-svelte';
  import { searchQuery } from '$lib/stores/search';

  export let searchInput: HTMLInputElement | null = null;

  function clearSearch() {
    $searchQuery = '';
    searchInput?.blur();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      clearSearch();
    }
  }
</script>

<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Search class="h-5 w-5 text-navy-400" />
  </div>
  
  <input
    type="text"
    bind:this={searchInput}
    bind:value={$searchQuery}
    placeholder="Search tasks..."
    class="block w-full pl-10 pr-8 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent text-sm transition-colors"
    on:keydown={handleKeydown}
  />

  {#if $searchQuery}
    <button
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-navy-400 hover:text-navy-600"
      on:click={clearSearch}
    >
      <X class="h-4 w-4" />
    </button>
  {/if}
</div>