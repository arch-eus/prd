<script lang="ts">
  import { Tag } from 'lucide-svelte';
  import { derived } from 'svelte/store';
  import { taskStore } from '$lib/stores';

  export let selectedTags: string[] = [];

  const allTags = derived(taskStore, $store => {
    const tags = new Set<string>();
    $store.tasks.forEach(task => {
      task.labels?.forEach(label => tags.add(label));
    });
    return Array.from(tags).sort();
  });

  function toggleTag(tag: string) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
  }
</script>

<div class="flex flex-wrap gap-2 mb-6">
  {#each $allTags as tag}
    <button
      class="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors font-jetbrains-mono
        {selectedTags.includes(tag)
          ? 'bg-navy-600 text-white'
          : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}"
      on:click={() => toggleTag(tag)}
    >
      <Tag class="w-3 h-3" />
      {tag}
    </button>
  {/each}
</div>