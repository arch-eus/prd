<script lang="ts">
  import { format } from 'date-fns';
  import { RotateCcw } from 'lucide-svelte';
  
  export let recurrence: string;
  export let nextDueDate: Date;
</script>

<span class="flex items-center gap-1 text-xs text-navy-400">
  <RotateCcw class="w-3 h-3" />
  {recurrence} · next: {format(nextDueDate, 'MMM d')}
</span>