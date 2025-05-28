// src/lib/utils.ts
export type LogLevel = 'info' | 'warn' | 'error';

export interface LogDetails {
  message: string;
  error?: unknown; // Allow any error type
  context?: Record<string, unknown>; // For additional context
}

// Placeholder for a real logging service
export const logger = {
  log: (level: LogLevel, details: LogDetails): void => {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] [${level.toUpperCase()}] ${details.message}`, details.error || '', details.context || '');
    // In a real app, this would send data to a logging service like Sentry, Datadog, etc.
    // For example: if (level === 'error' && process.env.NODE_ENV === 'production') { /* send to Sentry */ }
  },
  info: (message: string, context?: Record<string, unknown>) => logger.log('info', { message, context }),
  warn: (message: string, context?: Record<string, unknown>) => logger.log('warn', { message, context }),
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => logger.log('error', { message, error, context }),
};
