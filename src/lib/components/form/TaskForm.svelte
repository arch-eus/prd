<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import type { Task } from '$lib/types/task';
  import TagInput from './TagInput.svelte';
  import TaskFormField from './TaskFormField.svelte';
  import { normalizeDate, dateToInputValue } from '$lib/utils/dateUtils';
  import { Mic, MicOff, Check } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  
  export let task: Partial<Task> = {};
  export let isEditing = false;
  export let selectedDate: Date | null = new Date();
  export let submitForm: () => void;
  
  const dispatch = createEventDispatcher();
  
  let title = task.title || '';
  let description = task.description || '';
  let notes = task.notes || '';
  let status = task.status || 'todo';
  
  // Set initial completed state
  // 1. If editing a task, use its status
  // 2. If creating a task for a past date, default to completed
  // 3. Otherwise, default to not completed
  let completed;
  if (task.id) {
    // Existing task - use its status
    completed = status === 'completed';
  } else if (selectedDate && new Date(selectedDate) < new Date(new Date().setHours(0,0,0,0))) {
    // New task for a past date - default to completed
    completed = true;
  } else {
    // New task for today or future - default to not completed
    completed = false;
  }
  // Handle different date formats that might be passed
  let dueDate = '';
  try {
    // Enhanced date handling with robust error checking
    if (task.dueDate) {
      // Log type for debugging
      console.debug('Task due date type:', typeof task.dueDate, task.dueDate);
      
      // Handle various data types that might be stored
      let normalizedDate: Date | undefined;
      
      if (task.dueDate instanceof Date) {
        // Direct Date object
        if (!isNaN(task.dueDate.getTime())) {
          normalizedDate = task.dueDate;
        } else {
          console.warn('Invalid Date object in task:', task.dueDate);
        }
      } else if (typeof task.dueDate === 'string') {
        // ISO string or other string format
        try {
          const parsedDate = new Date(task.dueDate);
          if (!isNaN(parsedDate.getTime())) {
            normalizedDate = parsedDate;
          } else {
            console.warn('Invalid date string in task:', task.dueDate);
          }
        } catch (parseError) {
          console.error('Error parsing date string:', task.dueDate, parseError);
        }
      } else if (typeof task.dueDate === 'object' && task.dueDate !== null) {
        // Could be a non-standard object with date information
        console.warn('Received object instead of Date for dueDate:', task.dueDate);
        try {
          // Try to extract date string if possible
          const dateStr = task.dueDate.toString();
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            normalizedDate = parsedDate;
          }
        } catch (objError) {
          console.error('Error extracting date from object:', objError);
        }
      }
      
      // Generate input value from normalized date or use fallback
      if (normalizedDate) {
        dueDate = dateToInputValue(normalizeDate(normalizedDate));
      } else if (selectedDate) {
        // Fall back to selected date if task due date is invalid
        dueDate = dateToInputValue(normalizeDate(selectedDate));
      } else {
        // Ultimate fallback to today
        dueDate = dateToInputValue(normalizeDate(new Date()));
      }
    } else if (selectedDate) {
      // No task due date, use selected date
      dueDate = dateToInputValue(normalizeDate(selectedDate));
    } else {
      // Default to today as last resort
      dueDate = dateToInputValue(normalizeDate(new Date()));
    }
  } catch (error) {
    console.error('Error processing due date:', error);
    // Default to today if there's an error
    dueDate = dateToInputValue(normalizeDate(new Date()));
  }
  
  // Verify we have a valid date string
  if (!dueDate) {
    console.warn('Generated empty date string, defaulting to today');
    dueDate = dateToInputValue(normalizeDate(new Date()));
  }
  let selectedTags: string[] = task.labels || [];
  let recurrence = task.recurrence || null;
  let titleInput: HTMLInputElement;
  
  // Speech recognition variables
  let recognition: any = null;
  let isListening = false;
  let transcript = '';
  let focusedField: 'title' | 'description' | 'notes' | null = null;
  
  // Initialize speech recognition if available
  function setupSpeechRecognition() {
    try {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript;
              
              // Add the transcript to the currently focused field
              if (focusedField === 'title') {
                title = (title + ' ' + transcript).trim();
              } else if (focusedField === 'description') {
                description = (description + ' ' + transcript).trim();
              } else if (focusedField === 'notes') {
                notes = (notes + ' ' + transcript).trim();
              }
              
              transcript = '';
            } else {
              transcript += event.results[i][0].transcript;
            }
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          isListening = false;
        };
        
        recognition.onend = () => {
          isListening = false;
        };
      }
    } catch (e) {
      console.error('Speech recognition not supported:', e);
      recognition = null;
    }
  }
  
  // Toggle speech recognition
  function toggleSpeechRecognition(field: 'title' | 'description' | 'notes') {
    if (!recognition) {
      setupSpeechRecognition();
    }
    
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    if (isListening && focusedField === field) {
      recognition.stop();
      isListening = false;
      focusedField = null;
    } else {
      if (isListening) {
        recognition.stop();
      }
      
      focusedField = field;
      transcript = '';
      recognition.start();
      isListening = true;
    }
  }

  onMount(() => {
    titleInput?.focus();
  });
  
  function handleSubmit(e?: Event) {
    e?.preventDefault();
    
    if (!title.trim()) return;
    
    // Stop speech recognition if it's active
    if (isListening && recognition) {
      recognition.stop();
      isListening = false;
    }
    
    // Enhanced date validation and normalization
    let formDate: Date;
    try {
      // First try to use the input date value
      if (dueDate) {
        const tempDate = new Date(dueDate);
        // Verify it's a valid date
        if (!isNaN(tempDate.getTime())) {
          formDate = tempDate;
        } else {
          console.warn('Invalid date input value, using today:', dueDate);
          formDate = new Date();
        }
      } else {
        // No date value, use today
        formDate = new Date();
      }
      
      // Extra validation to ensure we have a valid date
      if (!(formDate instanceof Date) || isNaN(formDate.getTime())) {
        console.warn('Date validation failed, using current date as fallback');
        formDate = new Date();
      }
    } catch (error) {
      console.error('Error processing form date:', error);
      formDate = new Date();
    }
    
    // Set task status based on the completed toggle
    const taskStatus = completed ? 'completed' : 'todo';
    
    // Calculate completedAt date for completed tasks
    const completedAt = taskStatus === 'completed' ? (task.completedAt || new Date()) : undefined;
    
    // Log the final date for debugging
    console.debug('Submitting task with date:', formDate, formDate instanceof Date);
    
    const taskData = {
      title,
      description,
      notes,
      dueDate: formDate,
      labels: selectedTags,
      status: taskStatus,
      completedAt,
      recurrence
    };
    
    dispatch('submit', { task: taskData });
  }
</script>

<form on:submit={handleSubmit} class="space-y-4">
  <TaskFormField id="title">
    <div class="flex items-center">
      <button
        type="button"
        on:click={() => completed = !completed}
        class="flex items-center justify-center mr-3 w-6 h-6 rounded-full border-2 border-navy-200 hover:border-navy-400 transition-colors"
        aria-label={completed ? "Mark as incomplete" : "Mark as completed"}
      >
        {#if completed}
          <Check class="w-3 h-3 text-navy-600" />
        {:else}
          <span class="w-3 h-3"></span>
        {/if}
      </button>
      
      <input
        bind:this={titleInput}
        type="text"
        id="title"
        bind:value={title}
        class="flex-1 px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors {completed ? 'line-through text-gray-500' : ''}"
        placeholder="What needs to be done?"
        required
      />
      <button
        type="button"
        class="ml-2 text-navy-400 hover:text-navy-600"
        on:click={() => toggleSpeechRecognition('title')}
        title={isListening && focusedField === 'title' ? 'Stop recording' : 'Record task title'}
      >
        {#if isListening && focusedField === 'title'}
          <MicOff class="w-4 h-4 text-red-500" />
        {:else}
          <Mic class="w-4 h-4" />
        {/if}
      </button>
    </div>
    
    {#if isListening && focusedField === 'title' && transcript}
      <div class="mt-1 text-xs text-navy-500" transition:fade={{ duration: 100 }}>
        {transcript}...
      </div>
    {/if}
  </TaskFormField>

  <TaskFormField id="description">
    <div class="flex items-center">
      <textarea
        id="description"
        bind:value={description}
        class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors"
        rows="2"
        placeholder="Add description (optional)"
      ></textarea>
      <button
        type="button"
        class="ml-2 text-navy-400 hover:text-navy-600"
        on:click={() => toggleSpeechRecognition('description')}
        title={isListening && focusedField === 'description' ? 'Stop recording' : 'Record description'}
      >
        {#if isListening && focusedField === 'description'}
          <MicOff class="w-4 h-4 text-red-500" />
        {:else}
          <Mic class="w-4 h-4" />
        {/if}
      </button>
    </div>
    
    {#if isListening && focusedField === 'description' && transcript}
      <div class="mt-1 text-xs text-navy-500" transition:fade={{ duration: 100 }}>
        {transcript}...
      </div>
    {/if}
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
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="yearly">Yearly</option>
      </select>
    </TaskFormField>
  </div>


  <TaskFormField id="notes">
    <div class="flex items-center">
      <textarea
        id="notes"
        bind:value={notes}
        class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors"
        rows="2"
        placeholder="Add notes (optional)"
      ></textarea>
      <button
        type="button"
        class="ml-2 text-navy-400 hover:text-navy-600"
        on:click={() => toggleSpeechRecognition('notes')}
        title={isListening && focusedField === 'notes' ? 'Stop recording' : 'Record notes'}
      >
        {#if isListening && focusedField === 'notes'}
          <MicOff class="w-4 h-4 text-red-500" />
        {:else}
          <Mic class="w-4 h-4" />
        {/if}
      </button>
    </div>
    
    {#if isListening && focusedField === 'notes' && transcript}
      <div class="mt-1 text-xs text-navy-500" transition:fade={{ duration: 100 }}>
        {transcript}...
      </div>
    {/if}
  </TaskFormField>

  <TaskFormField id="tags">
    <TagInput 
    bind:selectedTags 
    on:keydown={(e) => {
      if (e.key === 'Enter') {
        if (e.ctrlKey) {
          e.preventDefault(); // Prevent default behavior for Ctrl+Enter
          handleSubmit(); // Custom Ctrl+Enter action
        } else {
          e.preventDefault(); // Prevent default behavior for plain Enter, if necessary
          console.log('Enter pressed, but no action taken.');
        }
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