<script lang="ts">
  import { derived } from 'svelte/store';
  import { taskStore } from '$lib/stores';
  import { Tag } from 'lucide-svelte';
  import { selectedTags as tagStore } from '$lib/stores/filters';
  
  // This is just for the binding interface compatibility
  export let selectedTags: string[] = [];
  export let vertical = false;
  
  // Sync local selectedTags with the store
  $: {
    if (JSON.stringify(selectedTags) !== JSON.stringify($tagStore)) {
      // Only update store if there's a difference, to avoid loops
      console.log('Syncing tags to store:', selectedTags);
      tagStore.set(selectedTags);
    }
  }
  
  // Also sync from store to local
  $: {
    selectedTags = [...$tagStore];
  }
  
  const popularTags = derived(taskStore, $store => {
    const tags = new Set<string>();
    $store.tasks.forEach(task => {
      task.labels?.forEach(label => tags.add(label));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  });
  
  function toggleTag(tag: string) {
    console.log('Toggle tag called:', tag);
    tagStore.toggle(tag);
  }
</script>

<div class={`flex gap-2 ${vertical ? 'flex-col' : 'flex-wrap'}`}>
  {#each $popularTags as tag}
    <button
      class="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors
        {$tagStore.includes(tag)
          ? 'bg-navy-600 text-white'
          : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}"
      on:click={() => toggleTag(tag)}
    >
      <Tag class="w-3 h-3" />
      {tag}
    </button>
  {/each}
</div>