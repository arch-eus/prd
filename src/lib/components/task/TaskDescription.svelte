<script lang="ts">
  export let description: string | undefined;
  export let notes: string | undefined;
</script>

{#if description}
  <div class="mt-2">
    <h3 class="text-sm font-medium text-navy-700 mb-1">Description</h3>
    <p class="text-navy-600">{description}</p>
  </div>
{/if}

{#if notes}
  <div class="mt-2">
    <h3 class="text-sm font-medium text-navy-700 mb-1">Notes</h3>
    <p class="text-navy-600 whitespace-pre-line">{notes}</p>
  </div>
{/if}