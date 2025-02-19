<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Circle, CheckCircle } from 'lucide-svelte';
  import type { Task } from '$lib/types/task';
  import TagInput from './TagInput.svelte';
  import { normalizeDate, dateToInputValue } from '$lib/utils/dateUtils';
  import { isBefore, startOfTomorrow } from 'date-fns';
  
  export let task: Partial<Task> = {};
  export let isEditing = false;
  export let selectedDate: Date | null = new Date();
  export let submitForm: () => void;
  
  const dispatch = createEventDispatcher();
  
  let title = task.title || '';
  let description = task.description || '';
  let notes = task.notes || '';
  let dueDate = dateToInputValue(task.dueDate ? normalizeDate(task.dueDate) : selectedDate);
  let selectedTags = task.labels || [];
  let recurrence = task.recurrence || null;
  let titleInput: HTMLInputElement;

  // Set initial status based on due date
  $: isCompleted = task.status === 'completed' || 
                   (!isEditing && dueDate && isBefore(new Date(dueDate), startOfTomorrow()));

  onMount(() => {
    titleInput?.focus();
  });
  
  function handleSubmit(e?: Event) {
    e?.preventDefault();
    
    if (!title.trim()) return;
    
    const taskData = {
      title,
      description,
      notes,
      dueDate: dueDate ? normalizeDate(dueDate) : new Date(),
      labels: selectedTags,
      status: isCompleted ? 'completed' : 'todo',
      recurrence
    };
    
    dispatch('submit', { task: taskData });
  }

  function handleKeydown(event: KeyboardEvent) {
    // Submit form on Ctrl+Enter
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
</script>

<form on:submit={handleSubmit} class="card p-4 space-y-4" on:keydown={handleKeydown}>
  <div class="flex items-center gap-4">
    <button
      type="button"
      class="btn-icon variant-ghost-surface"
      on:click={() => isCompleted = !isCompleted}
      aria-label="Toggle task status"
    >
      {#if isCompleted}
        <CheckCircle class="w-5 h-5" />
      {:else}
        <Circle class="w-5 h-5" />
      {/if}
    </button>

    <div class="flex-1">
      <input
        bind:this={titleInput}
        type="text"
        bind:value={title}
        class="input"
        placeholder="What needs to be done?"
        required
        id="task-title"
        aria-label="Task title"
      />
    </div>
  </div>

  <label for="task-description" class="label">
    <span>Description</span>
    <textarea
      id="task-description"
      bind:value={description}
      class="textarea"
      rows="2"
      placeholder="Add description (optional)"
    ></textarea>
  </label>

  <div class="grid grid-cols-2 gap-4">
    <label class="label">
      <span>Due Date</span>
      <input
        type="date"
        bind:value={dueDate}
        class="input"
        required
      />
    </label>

    <label class="label">
      <span>Recurrence</span>
      <select
        bind:value={recurrence}
        class="select"
      >
        <option value={null}>No recurrence</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="yearly">Yearly</option>
      </select>
    </label>
  </div>

  <label class="label">
    <span>Notes</span>
    <textarea
      bind:value={notes}
      class="textarea"
      rows="2"
      placeholder="Add notes (optional)"
    ></textarea>
  </label>

  <label class="label">
    <span>Tags</span>
    <TagInput 
      bind:selectedTags 
      on:keydown={handleKeydown}
    />
  </label>
</form>