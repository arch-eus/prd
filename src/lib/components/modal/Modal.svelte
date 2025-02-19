<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { X } from 'lucide-svelte';

  export let show = false;
  export let title: string;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div 
    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    transition:fade={{ duration: 200 }}
  >
    <!-- Backdrop -->
    <button 
      class="fixed inset-0 bg-navy-900/20"
      on:click={handleClose}
      aria-label="Close modal"
    />
    
    <!-- Modal -->
    <div 
      class="relative w-full max-w-lg bg-surface rounded-lg shadow-xl"
      role="dialog"
      aria-modal="true"
      on:click|stopPropagation
    >
      <div class="p-6">
        <button
          class="absolute right-4 top-4 text-navy-400 hover:text-navy-600 transition-colors"
          on:click={handleClose}
        >
          <X class="w-5 h-5" />
        </button>

        <h2 class="text-xl font-bold mb-4 text-navy-900">
          {title}
        </h2>

        <slot />
      </div>
    </div>
  </div>
{/if}