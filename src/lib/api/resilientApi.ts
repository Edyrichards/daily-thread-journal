
// Resilient API wrapper with retry logic and offline handling
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isFromCache: boolean;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

class ResilientApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private requestQueue: Array<() => Promise<any>> = [];
  private isOnline = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.requestQueue.length === 0) return;

    const requests = [...this.requestQueue];
    this.requestQueue = [];

    for (const request of requests) {
      try {
        await request();
      } catch (error) {
        console.error('Queued request failed:', error);
      }
    }
  }

  private getCacheKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}${paramString}`;
  }

  private isValidCacheEntry(entry: { data: any; timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt);
    return Math.min(delay, config.maxDelay);
  }

  async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retryConfig: Partial<RetryConfig> = {},
    cacheTTL = 5 * 60 * 1000 // 5 minutes default
  ): Promise<ApiResponse<T>> {
    const config = { ...defaultRetryConfig, ...retryConfig };
    const cacheKey = this.getCacheKey(url, options.body ? JSON.parse(options.body as string) : undefined);

    // Check cache first
    const cachedEntry = this.cache.get(cacheKey);
    if (cachedEntry && this.isValidCacheEntry(cachedEntry)) {
      return {
        data: cachedEntry.data,
        error: null,
        isFromCache: true
      };
    }

    // If offline, return cached data or error
    if (!this.isOnline) {
      if (cachedEntry) {
        return {
          data: cachedEntry.data,
          error: null,
          isFromCache: true
        };
      }
      return {
        data: null,
        error: 'No internet connection and no cached data available',
        isFromCache: false
      };
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful response
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: cacheTTL
        });

        return {
          data,
          error: null,
          isFromCache: false
        };

      } catch (error) {
        lastError = error as Error;
        console.warn(`API request attempt ${attempt + 1} failed:`, error);

        // Don't retry on the last attempt
        if (attempt < config.maxRetries) {
          const delay = this.calculateDelay(attempt, config);
          await this.sleep(delay);
        }
      }
    }

    // All retries failed - check for stale cache data
    if (cachedEntry) {
      console.warn('Using stale cache data due to API failure');
      return {
        data: cachedEntry.data,
        error: `API unavailable: ${lastError?.message}`,
        isFromCache: true
      };
    }

    return {
      data: null,
      error: lastError?.message || 'Unknown error occurred',
      isFromCache: false
    };
  }

  async queueRequest<T>(requestFn: () => Promise<T>): Promise<T | null> {
    if (this.isOnline) {
      return await requestFn();
    }

    return new Promise((resolve) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          console.error('Queued request failed:', error);
          resolve(null);
        }
      });
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const resilientApi = new ResilientApiService();
