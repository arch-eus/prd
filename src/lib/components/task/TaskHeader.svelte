<script lang="ts">
  import type { Task } from '$lib/utils/types';
  import TaskTitle from './TaskTitle.svelte';
  import TaskMetadata from './TaskMetadata.svelte';

  export let task: Task;
</script>

<div class="space-y-2">
  <TaskTitle {task} />
  <TaskMetadata {task} />
</div>