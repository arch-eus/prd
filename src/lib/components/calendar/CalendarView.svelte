<script lang="ts">
  import { format, startOfWeek, addDays, isSameDay, startOfDay } from 'date-fns';
  import CalendarHeader from './CalendarHeader.svelte';
  import WeekDays from './WeekDays.svelte';
  import { isToday } from '$lib/utils/dateUtils';
  
  export let selectedDate: Date = startOfDay(new Date());
  
  // Adjust to start week on Monday (1) instead of Sunday (0)
  $: weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  
  $: weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(weekStart, i)
  );
  
  function isSelected(date: Date) {
    return isSameDay(date, selectedDate);
  }
</script>

<div class="card p-4 mb-8">
  <CalendarHeader bind:currentDate={selectedDate} />
  
  <div class="mt-4 max-w-screen-sm">
    <WeekDays />
    
    <div class="grid grid-cols-7 gap-1">
      {#each weekDays as date}
        <button
          class="btn variant-ghost aspect-square p-0 flex items-center justify-center"
          class:variant-filled-primary={isSelected(date)}
          class:variant-soft-secondary={isToday(date) && !isSelected(date)}
          on:click={() => selectedDate = startOfDay(date)}
        >
          <span class="text-base">
            {format(date, 'd')}
          </span>
        </button>
      {/each}
    </div>
  </div>
</div>