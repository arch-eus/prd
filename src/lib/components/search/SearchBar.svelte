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
      event.preventDefault();
      clearSearch();
    }
  }
</script>

<div class="relative w-full">
  <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
    <div class="input-group-shim">
      <Search class="w-5 h-5" />
    </div>
    
    <input
      type="text"
      bind:this={searchInput}
      bind:value={$searchQuery}
      placeholder="Search tasks..."
      class="input"
      on:keydown={handleKeydown}
    />

    {#if $searchQuery}
      <button
        class="input-group-shim"
        on:click={clearSearch}
        aria-label="Clear search"
      >
        <X class="w-4 h-4" />
      </button>
    {/if}
  </div>
</div>