/**
 * Keyboard shortcut handler setup
 * 
 * Manages keyboard interactions:
 * - ? : Show help
 * - n : New task
 * - / : Focus search
 * - t : Go to today
 * - Esc: Close modals/clear search
 */
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { selectedDate } from '$lib/stores/filters';
import { searchQuery } from '$lib/stores/search';

interface KeyboardHandlers {
  showHelp: () => void;
  showNewTask: () => void;
  formRef: { handleSubmit: () => void } | null;
  closeModals: () => void;
  searchInput: HTMLInputElement | null;
}

export function setupKeyboardShortcuts({
  showHelp,
  showNewTask,
  formRef,
  closeModals,
  searchInput
}: KeyboardHandlers) {
  return function handleKeydown(event: KeyboardEvent) {
    // Handle Ctrl+Enter for form submission
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      formRef?.handleSubmit?.();
      return;
    }

    // Skip shortcuts when typing in input fields
    // Ignore if typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      // Allow Escape to blur inputs and close modals
      if (event.key === 'Escape') {
        event.preventDefault();
        event.target.blur();
        closeModals();
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        closeModals();
        break;
      case '?':
        event.preventDefault();
        showHelp();
        break;
      case 'n':
        event.preventDefault();
        showNewTask();
        break;
      case '/':
        event.preventDefault();
        searchInput?.focus();
        break;
      case 't':
        event.preventDefault();
        selectedDate.set(new Date());
        goto('/');
        break;
    }
  };
}