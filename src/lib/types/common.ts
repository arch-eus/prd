export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Status = 'success' | 'error' | 'loading' | 'idle';