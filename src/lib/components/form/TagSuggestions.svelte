<script lang="ts">
  import { Tag } from 'lucide-svelte';
  import { derived } from 'svelte/store';
  import { taskStore } from '$lib/stores';
  
  export let selectedTags: string[] = [];
  export let inputValue = '';
  
  const allTags = derived(taskStore, $store => {
    const tags = new Set<string>();
    $store.tasks.forEach(task => {
      task.labels?.forEach(label => tags.add(label));
    });
    return Array.from(tags).sort();
  });
  
  $: suggestions = derived(allTags, $tags => 
    inputValue
      ? $tags.filter(tag => 
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag)
        )
      : []
  );
</script>

{#if $suggestions.length > 0}
  <div class="absolute z-10 mt-1 w-full bg-white border border-navy-200 rounded-md shadow-lg">
    {#each $suggestions as tag}
      <button
        type="button"
        class="w-full text-left px-3 py-2 text-sm hover:bg-navy-50 flex items-center gap-2"
        on:click={() => dispatch('select', tag)}
      >
        <Tag class="w-4 h-4" />
        {tag}
      </button>
    {/each}
  </div>
{/if}