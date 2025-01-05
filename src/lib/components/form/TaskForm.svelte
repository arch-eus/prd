<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import type { Task } from '$lib/types/task';
  import TagInput from './TagInput.svelte';
  import TaskFormField from './TaskFormField.svelte';
  import { normalizeDate, dateToInputValue } from '$lib/utils/dateUtils';
  
  export let task: Partial<Task> = {};
  export let isEditing = false;
  export let selectedDate: Date | null = new Date();
  export let submitForm: () => void;
  
  const dispatch = createEventDispatcher();
  
  let title = task.title || '';
  let description = task.description || '';
  let notes = task.notes || '';
  let dueDate = dateToInputValue(task.dueDate ? normalizeDate(task.dueDate) : selectedDate);
  let selectedTags: string[] = task.labels || [];
  let recurrence = task.recurrence || null;
  let titleInput: HTMLInputElement;

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
      status: 'todo' as const,
      recurrence
    };
    
    dispatch('submit', { task: taskData });
  }
</script>

<form on:submit={handleSubmit} class="space-y-4">
  <TaskFormField id="title">
    <input
      bind:this={titleInput}
      type="text"
      id="title"
      bind:value={title}
      class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors"
      placeholder="What needs to be done?"
      required
    />
  </TaskFormField>

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
      on:keydown={(e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          handleSubmit();
        }
      }}
    />
  </TaskFormField>

  <div class="flex justify-end gap-2">
    <button
      type="submit"
      class="px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700 transition-colors"
    >
      {isEditing ? 'Update' : 'Create'} Task
    </button>
  </div>
</form>