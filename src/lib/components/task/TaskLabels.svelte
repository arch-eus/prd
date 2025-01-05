<script lang="ts">
  import { Tag } from 'lucide-svelte';
  
  export let labels: string[] = [];
</script>

{#if labels.length}
  <div class="flex gap-1 flex-wrap">
    {#each labels as label}
      <span class="flex items-center gap-1 text-xs bg-navy-50 text-navy-700 px-1.5 py-0.5 rounded">
        <Tag class="w-3 h-3" />
        {label}
      </span>
    {/each}
  </div>
{/if}