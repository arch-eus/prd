<script lang="ts">
  import { derived } from 'svelte/store';
  import { taskStore } from '$lib/stores';
  import { Tag } from 'lucide-svelte';
  
  export let selectedTags: string[] = [];
  export let vertical = false;
  export let ariaLabel = 'Filter by tags';
  
  // Memoize popular tags to prevent unnecessary recalculations
  const popularTags = derived(taskStore, ($store) => {
    const tagCounts = new Map<string, number>();
    
    $store.tasks.forEach(task => {
      task.labels?.forEach(label => {
        tagCounts.set(label, (tagCounts.get(label) ?? 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  });
  
  function toggleTag(tag: string) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
  }

  function handleKeydown(event: KeyboardEvent, tag: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTag(tag);
    }
  }
</script>

<div 
  class={`flex gap-2 ${vertical ? 'flex-col' : 'flex-wrap'}`}
  role="toolbar"
  aria-label={ariaLabel}
>
  {#each $popularTags as tag (tag)}
    <button
      type="button"
      class="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors
        {selectedTags.includes(tag)
          ? 'bg-navy-600 text-white hover:bg-navy-700'
          : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}"
      on:click={() => toggleTag(tag)}
      on:keydown={(e) => handleKeydown(e, tag)}
      aria-pressed={selectedTags.includes(tag)}
    >
      <Tag size={16} aria-hidden="true" />
      <span>{tag}</span>
    </button>
  {/each}
</div>