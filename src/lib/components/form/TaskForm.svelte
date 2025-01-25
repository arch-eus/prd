<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Circle, CheckCircle, Send } from 'lucide-svelte';
  import type { Task } from '$lib/types/task';
  import TagInput from './TagInput.svelte';
  import TaskFormField from './TaskFormField.svelte';
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
  let isCompleted = task.status === 'completed';
  
  // Update completed status when due date changes (only for new tasks)
  $: {
    if (!isEditing && dueDate) {
      const dueDateTime = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      isCompleted = isBefore(dueDateTime, today);
    }
  }

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
      status: isCompleted ? 'completed' as const : 'todo' as const,
      completedAt: isCompleted ? new Date() : undefined,
      recurrence
    };
    
    dispatch('submit', { task: taskData });
  }

  function handleKeydown(event: KeyboardEvent) {
    // Prevent form submission on regular Enter
    if (event.key === 'Enter' && !event.ctrlKey) {
      event.preventDefault();
      return;
    }
    
    // Submit form on Ctrl+Enter
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
</script>

<form on:submit={handleSubmit} class="space-y-4" on:keydown={handleKeydown}>
  <div class="flex items-center gap-4">
    <button
      type="button"
      class="text-navy-400 hover:text-navy-600 transition-colors"
      on:click={() => {
        isCompleted = !isCompleted;
      }}
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
        class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors"
        placeholder="What needs to be done?"
        required
      />
    </div>

    <button
      type="submit"
      class="text-navy-400 hover:text-navy-600 transition-colors"
      aria-label="Submit task"
    >
      <Send class="w-5 h-5" />
    </button>
  </div>

  <TaskFormField id="description">
    <textarea
      id="description"
      bind:value={description}
      class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors"
      rows="2"
      placeholder="Add description (optional)"
    ></textarea>
  </TaskFormField>

  <div class="grid grid-cols-2 gap-4">
    <TaskFormField id="dueDate">
      <input
        type="date"
        id="dueDate"
        bind:value={dueDate}
        class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors"
        required
      />
    </TaskFormField>

    <TaskFormField id="recurrence">
      <select
        id="recurrence"
        bind:value={recurrence}
        class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors appearance-none"
      >
        <option value={null}>No recurrence</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="yearly">Yearly</option>
      </select>
    </TaskFormField>
  </div>

  <TaskFormField id="notes">
    <textarea
      id="notes"
      bind:value={notes}
      class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors"
      rows="2"
      placeholder="Add notes (optional)"
    ></textarea>
  </TaskFormField>

  <TaskFormField id="tags">
    <TagInput 
      bind:selectedTags 
      on:keydown={handleKeydown}
    />
  </TaskFormField>
</form>
