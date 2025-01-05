/**
 * Shared type definitions
 */

export type Status = 'success' | 'error' | 'loading' | 'idle';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'completed';
export type RecurrenceType = 'monthly' | 'quarterly' | 'yearly' | null;

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  notes?: string;
  status: TaskStatus;
  labels: string[];
  dueDate?: Date;
  completedAt?: Date;
  order: number;
  recurrence?: RecurrenceType;
}