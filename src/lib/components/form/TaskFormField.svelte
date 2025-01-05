<script lang="ts">
  export let id: string;
  export let label = '';
</script>

<div class="relative">
  {#if label}
    <label for={id} class="block text-sm font-medium text-navy-700 mb-1">
      {label}
    </label>
  {/if}
  <slot />
</div>