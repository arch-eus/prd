<script lang="ts">
  import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

  export let dueDate: Date;
  
  $: leadTime = (() => {
    const days = differenceInDays(new Date(), dueDate);
    if (days < 7) return `${days}d`;
    
    const weeks = differenceInWeeks(new Date(), dueDate);
    if (weeks < 4) return `${weeks}w`;
    
    return `${differenceInMonths(new Date(), dueDate)}m`;
  })();
</script>

<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
  +{leadTime}
</span>