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

<div class="mb-8 font-jetbrains-mono">
  <CalendarHeader bind:currentDate={selectedDate} />
  
  <div class="mt-4 max-w-screen-sm">
    <WeekDays />
    
    <div class="grid grid-cols-7 gap-1">
      {#each weekDays as date}
        <button
          class="w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-colors relative
            {isToday(date) ? 'text-teal-600 font-bold ring-2 ring-teal-500' : 'text-navy-800'}
            {isSelected(date) ? 'bg-navy-600 !text-white' : ''}
            {!isToday(date) && !isSelected(date) ? 'hover:bg-navy-50' : ''}"
          on:click={() => selectedDate = startOfDay(date)}
        >
          {format(date, 'd')}
        </button>
      {/each}
    </div>
  </div>
</div>