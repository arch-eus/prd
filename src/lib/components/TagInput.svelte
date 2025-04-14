<script lang="ts">
  import { X } from 'lucide-svelte';
  import { derived } from 'svelte/store';
  import { taskStore } from '$lib/stores';
  
  export let selectedTags: string[] = [];
  let tagInput = '';
  
  const allTags = derived(taskStore, $store => {
    const tags = new Set<string>();
    $store.tasks.forEach(task => {
      task.labels?.forEach(label => tags.add(label));
    });
    return Array.from(tags);
  });
  
  const filteredTags = derived([allTags], ([$allTags]) => {
    if (!tagInput) return [];
    const input = tagInput.toLowerCase();
    return $allTags
      .filter(tag => tag.toLowerCase().includes(input))
      .filter(tag => !selectedTags.includes(tag));
  });
  
  function addTag(tag: string) {
    if (!selectedTags.includes(tag)) {
      selectedTags = [...selectedTags, tag];
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

<div class="inline-flex flex-wrap items-center gap-2">
  {#each selectedTags as tag}
    <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm group rounded-md">
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

  <div class="relative w-24">
    <input
      type="text"
      bind:value={tagInput}
      placeholder="Add tag"
      on:keydown={handleKeydown}
      class="block w-full border-0 border-b-2 border-gray-200 focus:border-navy-500 focus:ring-0 focus:outline-none text-sm bg-transparent"
    />
    {#if tagInput && $filteredTags.length > 0}
      <div class="absolute left-0 z-10 w-48 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
        {#each $filteredTags as tag}
          <button
            type="button"
            class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
            on:click={() => addTag(tag)}
          >
            {tag}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>