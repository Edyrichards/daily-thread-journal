
// Common types and utilities for better type safety

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isFromCache?: boolean;
}

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ErrorWithContext extends Error {
  context?: string;
  timestamp?: number;
  userId?: string;
  url?: string;
}

// Utility types
export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Event tracking types
export interface AppEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  timestamp: number;
}
