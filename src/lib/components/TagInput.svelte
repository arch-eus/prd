<script lang="ts">
  import { X } from 'lucide-svelte';
  import { allTagsStore } from '$lib/stores/tagStore';
  
  export let selectedTags: string[] = [];
  export let placeholder = 'Add tags...';
  export let ariaLabel = 'Tag input';
  
  let tagInput = '';
  let dropdownVisible = false;
  let selectedIndex = -1;
  let inputElement: HTMLInputElement;
  
  $: filteredTags = tagInput 
    ? $allTagsStore
        .filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()))
        .filter(tag => !selectedTags.includes(tag))
    : [];

  function addTag(tag: string) {
    if (!selectedTags.includes(tag)) {
      selectedTags = [...selectedTags, tag];
    }
    tagInput = '';
    dropdownVisible = false;
    selectedIndex = -1;
  }
  
  function removeTag(tag: string) {
    selectedTags = selectedTags.filter(t => t !== tag);
  }

  function handleKeydown(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filteredTags.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          addTag(filteredTags[selectedIndex]);
        } else if (tagInput) {
          addTag(tagInput);
        }
        break;
      case 'Escape':
        dropdownVisible = false;
        selectedIndex = -1;
        break;
    }
  }
</script>

<div class="relative w-full">
  <div class="flex flex-wrap gap-2 p-2 border rounded-md">
    {#each selectedTags as tag (tag)}
      <span class="flex items-center gap-1 px-2 py-1 bg-navy-100 rounded-full">
        {tag}
        <button
          type="button"
          class="hover:text-red-600"
          on:click={() => removeTag(tag)}
          aria-label="Remove {tag} tag"
        >
          <X size={16} />
        </button>
      </span>
    {/each}
    <input
      bind:value={tagInput}
      bind:this={inputElement}
      type="text"
      {placeholder}
      aria-label={ariaLabel}
      class="flex-1 min-w-[120px] outline-none"
      on:focus={() => dropdownVisible = true}
      on:blur={() => setTimeout(() => dropdownVisible = false, 200)}
      on:keydown={handleKeydown}
    />
  </div>

  {#if dropdownVisible && filteredTags.length > 0}
    <ul
      class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto"
      role="listbox"
    >
      {#each filteredTags as tag, i (tag)}
        <li
          role="option"
          aria-selected={i === selectedIndex}
          class="px-3 py-2 hover:bg-navy-50 cursor-pointer
            {i === selectedIndex ? 'bg-navy-50' : ''}"
          on:mousedown={() => addTag(tag)}
        >
          {tag}
        </li>
      {/each}
    </ul>
  {/if}
</div>