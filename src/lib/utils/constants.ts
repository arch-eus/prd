/**
 * Application-wide constants
 */

export const KEYBOARD_SHORTCUTS = {
  SHOW_HELP: '?',
  NEW_TASK: 'n',
  FOCUS_SEARCH: '/',
  GO_TO_TODAY: 't',
  CLOSE: 'Escape'
} as const;

export const TASK_STATUS = {
  TODO: 'todo',
  COMPLETED: 'completed'
} as const;

export const RECURRENCE_OPTIONS = {
  NONE: null,
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
} as const;