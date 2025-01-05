import type { BaseEntity } from './common';
import { RECURRENCE_OPTIONS, TASK_STATUS } from '../constants/task';

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type RecurrenceType = typeof RECURRENCE_OPTIONS[keyof typeof RECURRENCE_OPTIONS];

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

export type NewTask = Omit<Task, keyof BaseEntity | 'order'>;
export type TaskUpdate = Partial<NewTask>;