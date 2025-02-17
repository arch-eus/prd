<script lang="ts">
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
</script>

<div class="grid grid-cols-7 gap-1 mb-1">
  {#each days as day}
    <div class="text-center p-2">
      <span class="text-sm font-medium text-surface-600-300-token">{day}</span>
    </div>
  {/each}
</div>