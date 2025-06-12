
import { useEffect, useCallback } from 'react';

export const usePerformance = () => {
  // Lazy loading hook for images and components
  const useLazyLoading = (threshold = 0.1) => {
    const observerRef = useCallback((node: HTMLElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold }
      );

      observer.observe(node);

      return () => observer.unobserve(node);
    }, [threshold]);

    return observerRef;
  };

  // Debounce hook for search and input optimization
  const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Performance monitoring
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if ('performance' in window) {
      performance.mark(`${name}-start`);
      fn();
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    } else {
      fn();
    }
  }, []);

  // Report Web Vitals if available
  const reportWebVitals = useCallback(() => {
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Log performance metrics
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`Performance: ${entry.name}`, entry);
        });
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }, []);

  useEffect(() => {
    reportWebVitals();
  }, [reportWebVitals]);

  return {
    useLazyLoading,
    useDebounce,
    measurePerformance,
    reportWebVitals
  };
};
