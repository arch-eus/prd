<script lang="ts">
  import { completedTasks } from '$lib/stores';
  import CompletedTaskList from '$lib/components/CompletedTaskList.svelte';
</script>

<div class="space-y-6">
  <h2 class="text-2xl font-bold text-navy-900 font-jetbrains-mono">Completed Tasks</h2>
  
  {#if $completedTasks.length === 0}
    <p class="text-navy-500 text-center py-8 font-jetbrains-mono">No completed tasks</p>
  {:else}
    <CompletedTaskList tasks={$completedTasks} />
  {/if}
</div>