<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { X } from 'lucide-svelte';
  import type { Task } from '$lib/types/task';
  import { selectedDate } from '$lib/stores/filters';
  import TaskForm from './form/TaskForm.svelte';

  export let show = false;
  export let task: Partial<Task> = {};
  export let isEditing = false;
  export let initialTags: string[] = [];
  let formRef: { handleSubmit: () => void } | null = null;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }

  function handleSubmit(event: CustomEvent) {
    dispatch('submit', event.detail);
    handleClose();
  }

  function submitForm() {
    formRef?.handleSubmit();
  }
  
  // Handle escape key globally for the modal
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && show) {
      event.preventDefault();
      handleClose();
    }
  }
  
  // Set up and tear down the global keydown handler
  let keydownHandler: (e: KeyboardEvent) => void;
  
  onMount(() => {
    keydownHandler = (e) => handleKeydown(e);
    window.addEventListener('keydown', keydownHandler);
  });
  
  onDestroy(() => {
    window.removeEventListener('keydown', keydownHandler);
  });
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div 
      class="absolute inset-0 bg-navy-900/20"
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

        <h2 class="text-xl font-bold mb-4 text-navy-900">
          {isEditing ? 'Edit Task' : 'New Task'}
        </h2>

        <TaskForm 
          bind:this={formRef}
          {task}
          {isEditing}
          selectedTags={task.labels || initialTags}
          selectedDate={$selectedDate}
          {submitForm}
          on:submit={handleSubmit}
        />
        
        <div class="flex justify-end gap-3 mt-6">
          <button 
            class="px-4 py-2 text-navy-700 bg-transparent hover:bg-navy-50 rounded"
            on:click={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}