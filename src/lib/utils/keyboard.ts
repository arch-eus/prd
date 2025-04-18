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
  showSettings: () => void;
  submitForm: () => void;
  closeModals: () => void;
  navigatePrevWeek: () => void;
  navigateNextWeek: () => void;
  searchInput: HTMLInputElement | null;
}

export function setupKeyboardShortcuts({
  showHelp,
  showNewTask,
  showSettings,
  submitForm,
  closeModals,
  navigatePrevWeek,
  navigateNextWeek,
  searchInput
}: KeyboardHandlers) {
  return function handleKeydown(event: KeyboardEvent) {
    // Handle Ctrl+Enter for form submission
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      submitForm();
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
      case ',':
        event.preventDefault();
        showSettings();
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
      case 'ArrowLeft':
        if (!event.altKey && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          navigatePrevWeek();
        }
        break;
      case 'ArrowRight':
        if (!event.altKey && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          navigateNextWeek();
        }
        break;
    }
  };
}