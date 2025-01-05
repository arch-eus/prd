```svelte
<script lang="ts">
  import { X, Tag } from 'lucide-svelte';
  import { derived } from 'svelte/store';
  import { taskStore } from '$lib/stores';
  
  export let selectedTags: string[] = [];
  let tagInput = '';
  
  const allTags = derived(taskStore, $store => {
    const tags = new Set<string>();
    $store.tasks.forEach(task => {
      task.labels?.forEach(label => tags.add(label));
    });
    return Array.from(tags).sort();
  });
  
  $: suggestions = $allTags.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase()) &&
    !selectedTags.includes(tag)
  );
  
  function addTag(tag: string) {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      selectedTags = [...selectedTags, trimmedTag];
    }
    tagInput = '';
  }
  
  function removeTag(tag: string) {
    selectedTags = selectedTags.filter(t => t !== tag);
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && tagInput) {
      event.preventDefault();
      addTag(tagInput);
    }
  }
</script>

<div class="relative">
  <div class="flex flex-wrap gap-2 mb-2">
    {#each selectedTags as tag}
      <span class="inline-flex items-center gap-1 px-2 py-1 bg-navy-50 text-navy-700 text-sm rounded group">
        <Tag class="w-3 h-3" />
        {tag}
        <button
          type="button"
          class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
          on:click={() => removeTag(tag)}
        >
          <X class="w-3 h-3" />
        </button>
      </span>
    {/each}
  </div>

  <div class="relative">
    <input
      type="text"
      bind:value={tagInput}
      placeholder="Add tag"
      on:keydown={handleKeydown}
      class="w-full px-0 text-navy-700 bg-transparent border-0 border-b-2 border-navy-100 focus:ring-0 focus:border-navy-600 placeholder-navy-300"
    />
    
    {#if tagInput && suggestions.length > 0}
      <div class="absolute z-10 mt-1 w-full bg-white border border-navy-200 rounded-md shadow-lg">
        {#each suggestions as tag}
          <button
            type="button"
            class="w-full text-left px-3 py-2 text-sm hover:bg-navy-50 flex items-center gap-2"
            on:click={() => addTag(tag)}
          >
            <Tag class="w-4 h-4" />
            {tag}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
```