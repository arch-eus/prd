<script lang="ts">
  import type { Task } from '$lib/types/task';
  
  export let task: Task;
  export let isDragging = false;
  
  function handleDragStart(e: DragEvent) {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  }
</script>

<div
  draggable="true"
  on:dragstart={handleDragStart}
  on:dragstart
  on:dragover
  on:drop
  class="transition-transform duration-200"
  class:opacity-50={isDragging}
>
  <slot />
</div>