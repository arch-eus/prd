<script lang="ts">
  import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
  import type { Task } from '$lib/types/task';
  
  export let tasks: Task[] = [];
  export let selectedDate: Date = new Date();
  
  $: weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(selectedDate), i)
  );
  
  $: tasksByDate = weekDays.map(date => ({
    date,
    tasks: tasks.filter(task => task.dueDate && isSameDay(new Date(task.dueDate), date))
  }));
</script>

<div class="mb-8 overflow-x-auto">
  <div class="flex gap-2 min-w-max">
    {#each tasksByDate as { date, tasks }, i (date)}
      <div class="flex-1 min-w-[200px]">
        <div class="text-center mb-2 p-2 {isToday(date) ? 'bg-blue-50 dark:bg-blue-900 rounded' : ''}">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {format(date, 'EEE')}
          </div>
          <div class="font-semibold">
            {format(date, 'd MMM')}
          </div>
        </div>
        <div class="space-y-2">
          {#each tasks as task}
            <div class="p-2 bg-white dark:bg-gray-800 rounded shadow-sm text-sm">
              {task.title}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>