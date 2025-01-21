<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Task } from '$lib/types/task';
  import TagInput from './TagInput.svelte';
  import { normalizeDate, dateToInputValue } from '$lib/utils/dateUtils';
  
  export let task: Partial<Task> = {};
  export let isEditing = false;
  export let selectedDate: Date | null = null;
  
  const dispatch = createEventDispatcher();
  
  let title = task.title || '';
  let description = task.description || '';
  let dueDate = dateToInputValue(task.dueDate ? normalizeDate(task.dueDate) : selectedDate);
  let selectedTags = task.labels || [];
  let recurrence = task.recurrence || null;
  
  function handleSubmit() {
    const taskData = {
      title,
      description,
      dueDate: dueDate ? normalizeDate(dueDate) : undefined,
      labels: selectedTags,
      status: 'todo' as const,
      recurrence
    };
    
    dispatch('submit', { task: taskData });
    
    if (!isEditing) {
      title = '';
      description = '';
      dueDate = '';
      selectedTags = [];
      recurrence = null;
    }
  }
</script>
