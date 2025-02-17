<script lang="ts">
  import { format } from 'date-fns';
  import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-svelte';
  
  export let currentDate: Date;
  
  function goToToday() {
    currentDate = new Date();
  }

  function previousWeek() {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 7);
    currentDate = date;
  }

  function nextWeek() {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 7);
    currentDate = date;
  }
</script>

<div class="flex items-center justify-between mb-4">
  <div class="flex items-center gap-2">
    <h2 class="h2">{format(currentDate, 'MMMM yyyy')}</h2>
    <button
      class="btn-icon variant-ghost-surface"
      on:click={goToToday}
      title="Go to today"
    >
      <CalendarDays class="w-5 h-5" />
    </button>
  </div>

  <div class="flex items-center gap-1">
    <button
      class="btn-icon variant-ghost-surface"
      on:click={previousWeek}
      title="Previous week"
    >
      <ChevronLeft class="w-4 h-4" />
    </button>
    <button
      class="btn-icon variant-ghost-surface"
      on:click={nextWeek}
      title="Next week"
    >
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</div>