<script lang="ts">
  import { Search, X } from 'lucide-svelte';
  import { searchQuery, isSearchActive } from '$lib/stores/search';
  import SearchResults from './SearchResults.svelte';
  import { createEventDispatcher } from 'svelte';

  export let searchInput: HTMLInputElement | null = null;
  
  const dispatch = createEventDispatcher();

  function clearSearch() {
    $searchQuery = '';
    $isSearchActive = false;
    searchInput?.blur();
  }

  function handleFocus() {
    $isSearchActive = true;
  }

  function handleBlur() {
    // Small delay to allow clicking search results
    setTimeout(() => {
      if (!$searchQuery.trim()) {
        $isSearchActive = false;
      }
    }, 200);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      clearSearch();
      searchInput?.blur();
    }
  }
  
  // Forward events from search results
  function handleEdit(event: CustomEvent) {
    dispatch('edit', event.detail);
  }
  
  function handleShowDetails(event: CustomEvent) {
    dispatch('showDetails', event.detail);
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
    on:focus={handleFocus}
    on:blur={handleBlur}
  />

  {#if $searchQuery}
    <button
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-navy-400 hover:text-navy-600"
      on:click={clearSearch}
    >
      <X class="h-4 w-4" />
    </button>
  {/if}
  
  <SearchResults 
    on:edit={handleEdit}
    on:showDetails={handleShowDetails}
  />
</div>