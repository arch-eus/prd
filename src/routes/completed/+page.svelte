<script lang="ts">
  import { completedTasks } from '$lib/stores';
  import CompletedTaskList from '$lib/components/CompletedTaskList.svelte';
</script>

<div class="max-w-5xl mx-auto space-y-6">
  <h2 class="text-2xl font-bold text-navy-900 font-jetbrains-mono">Completed Tasks</h2>
  
  {#if $completedTasks.length === 0}
    <div class="bg-surface p-8 rounded-lg shadow-soft">
      <p class="text-navy-500 text-center font-jetbrains-mono">No completed tasks</p>
    </div>
  {:else}
    <CompletedTaskList tasks={$completedTasks} />
  {/if}
  }
</div>