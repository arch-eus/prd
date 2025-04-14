<script lang="ts">
  import { onDestroy } from 'svelte';

  // Configuration
  const INITIAL_TIME = 20;
  const FADE_STEP = 0.1;
  const FADE_INTERVAL = 50;
  const TIMER_INTERVAL = 1000;

  // Thresholds for color changes (in seconds)
  const THRESHOLDS = {
    GREEN: 13,
    YELLOW: 5,
    RED: 2
  };

  // State
  let timeLeft = INITIAL_TIME;
  let isRunning = false;
  let opacity = 1;
  let fadingIn = false;

  // Intervals
  let timerInterval: ReturnType<typeof setInterval> | undefined;
  let fadeInterval: ReturnType<typeof setInterval> | undefined;

  // Reactive color based on time left
  $: color = getColor(timeLeft);

  // Get color based on time remaining
  function getColor(time: number): string {
    if (time <= THRESHOLDS.RED) return 'bg-red-600';
    if (time <= THRESHOLDS.YELLOW) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  // Handle fading animation
  function startFading() {
    if (fadeInterval) return;
    
    fadeInterval = setInterval(() => {
      opacity = fadingIn 
        ? Math.min(1, opacity + FADE_STEP)
        : Math.max(0, opacity - FADE_STEP);
        
      if (opacity === 0 || opacity === 1) {
        fadingIn = !fadingIn;
      }
    }, FADE_INTERVAL);
  }

  // Start the countdown timer
  function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    timerInterval = setInterval(() => {
      timeLeft = Math.max(0, timeLeft - 1);
      if (timeLeft === 0) startFading();
    }, TIMER_INTERVAL);
  }

  // Reset all states
  function resetTimer() {
    clearInterval(timerInterval);
    clearInterval(fadeInterval);
    fadeInterval = undefined;
    isRunning = false;
    opacity = 1;
    fadingIn = false;
    timeLeft = INITIAL_TIME;
  }

  // Cleanup on component destruction
  onDestroy(() => {
    clearInterval(timerInterval);
    clearInterval(fadeInterval);
  });
</script>

<div class="flex items-center gap-3">
  <!-- Timer cube -->
  <button 
    on:click={startTimer}
    class="relative w-8 h-8 focus:outline-none"
    disabled={isRunning}
  >
    <div 
      class="absolute inset-0 rounded-lg {color} shadow-lg transition-colors duration-200"
      style="transform: rotate(45deg); opacity: {opacity};"
    />
  </button>

  <!-- Controls -->
  <div class="flex flex-col gap-1">
    <!-- Play button -->
    <button
      on:click={startTimer}
      class="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
      disabled={isRunning}
      title="Start Timer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 {isRunning ? 'text-gray-400' : 'text-gray-700'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>

    <!-- Reset button -->
    <button
      on:click={resetTimer}
      class="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
      title="Reset Timer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  </div>
</div>
