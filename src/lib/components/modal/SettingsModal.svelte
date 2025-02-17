<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { X } from 'lucide-svelte';
  import DataManagement from '../settings/DataManagement.svelte';

  export let show = false;
  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }

  function handleSuccess(event: CustomEvent) {
    dispatch('success', event.detail);
    handleClose();
  }

  function handleError(event: CustomEvent) {
    dispatch('error', event.detail);
  }
</script>

<div
  class="fixed inset-0 z-[100] flex items-center justify-center p-4"
  class:hidden={!show}
  transition:fade={{ duration: 200 }}
>
  <div
    class="fixed inset-0 bg-navy-900/20"
    on:click={handleClose}
  />
  
  <div
    class="relative w-full max-w-lg bg-surface rounded-lg shadow-xl"
    on:click|stopPropagation
  >
    <div class="p-6">
      <button
        class="absolute right-4 top-4 text-navy-400 hover:text-navy-600"
        on:click={handleClose}
      >
        <X class="w-5 h-5" />
      </button>

      <h2 class="text-xl font-bold mb-6 text-navy-900">Settings</h2>

      <DataManagement
        on:success={handleSuccess}
        on:error={handleError}
      />
    </div>
  </div>
</div>