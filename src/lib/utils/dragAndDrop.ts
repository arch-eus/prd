import { writable } from 'svelte/store';
import type { Task } from '$lib/types/task';

export function useDragAndDrop(tasks: Task[], taskStore: any) {
  const draggedTask = writable<Task | null>(null);
  const draggedOverTask = writable<Task | null>(null);

  function handleDragStart(task: Task) {
    draggedTask.set(task);
  }

  function handleDragOver(e: DragEvent, task: Task) {
    e.preventDefault();
    draggedOverTask.set(task);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    let currentDraggedTask: Task | null = null;
    let currentDraggedOverTask: Task | null = null;
    
    draggedTask.subscribe(value => currentDraggedTask = value)();
    draggedOverTask.subscribe(value => currentDraggedOverTask = value)();

    if (currentDraggedTask && currentDraggedOverTask && currentDraggedTask.id !== currentDraggedOverTask.id) {
      const newIndex = tasks.findIndex(t => t.id === currentDraggedOverTask?.id);
      taskStore.reorderTasks(currentDraggedTask.id, newIndex);
    }
    
    draggedTask.set(null);
    draggedOverTask.set(null);
  }

  return {
    draggedTask,
    draggedOverTask,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
}