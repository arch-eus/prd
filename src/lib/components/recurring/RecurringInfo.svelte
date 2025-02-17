<script lang="ts">
  import { format } from 'date-fns';
  import { RotateCcw } from 'lucide-svelte';
  
  export let recurrence: string;
  export let nextDueDate: Date;
</script>

<span class="chip variant-soft">
  <RotateCcw class="w-3 h-3" />
  <span>{recurrence} · next: {format(nextDueDate, 'MMM d')}</span>
</span>