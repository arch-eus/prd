<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Check, Trash2 } from 'lucide-svelte';
  
  export let isCompleted = false;
  
  const dispatch = createEventDispatcher();
</script>

<div class="flex items-center gap-2">
  <button
    class="w-5 h-5 rounded-full border-2 border-navy-200 hover:border-navy-600 flex items-center justify-center transition-colors"
    on:click={() => dispatch('complete')}
    aria-label="Toggle task completion"
  >
    {#if isCompleted}
      <Check class="w-3 h-3 text-navy-600" />
    {/if}
  </button>

  <button
    class="p-2 hover:bg-red-50 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
    on:click={() => dispatch('delete')}
    aria-label="Delete task"
  >
    <Trash2 class="w-4 h-4" />
  </button>
</div>