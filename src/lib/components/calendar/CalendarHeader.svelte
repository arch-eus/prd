<script lang="ts">
  import { format, addWeeks, subWeeks } from 'date-fns';
  import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  
  export let currentDate: Date;
  
  const dispatch = createEventDispatcher();
  
  function goToToday() {
    currentDate = new Date();
    dispatch('navigate', { direction: 'today' });
  }

  function previousWeek() {
    currentDate = subWeeks(currentDate, 1);
    dispatch('navigate', { direction: 'prev' });
  }

  function nextWeek() {
    currentDate = addWeeks(currentDate, 1);
    dispatch('navigate', { direction: 'next' });
  }
</script>

<div class="flex items-center justify-between font-jetbrains-mono mb-4">
  <div class="flex items-center gap-2">
    <h2 class="text-2xl font-bold text-navy-900">
      {format(currentDate, 'MMMM yyyy')}
    </h2>
    <button
      on:click={goToToday}
      class="p-1 hover:text-navy-600 transition-colors"
      title="Go to today"
    >
      <CalendarDays class="w-5 h-5" />
    </button>
  </div>

  <div class="flex items-center gap-1">
    <button
      on:click={previousWeek}
      class="p-2 hover:bg-navy-50 rounded-full transition-colors"
      title="Previous week"
    >
      <ChevronLeft class="w-4 h-4" />
    </button>
    <button
      on:click={nextWeek}
      class="p-2 hover:bg-navy-50 rounded-full transition-colors"
      title="Next week"
    >
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</div>