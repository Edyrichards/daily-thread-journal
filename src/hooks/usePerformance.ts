
import React, { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentMounts: number;
  memoryUsage?: number;
}

interface UsePerformanceOptions {
  trackRenders?: boolean;
  trackMemory?: boolean;
  logToConsole?: boolean;
}

export const usePerformance = (
  componentName: string, 
  options: UsePerformanceOptions = {}
) => {
  const {
    trackRenders = true,
    trackMemory = false,
    logToConsole = false
  } = options;

  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  const metrics = useRef<PerformanceMetrics>({
    renderTime: 0,
    componentMounts: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    if (trackRenders) {
      renderCount.current += 1;
      metrics.current.componentMounts = renderCount.current;
      
      const renderTime = performance.now() - startTime.current;
      metrics.current.renderTime = renderTime;

      if (trackMemory && (performance as any).memory) {
        metrics.current.memoryUsage = (performance as any).memory.usedJSHeapSize;
      }

      if (logToConsole) {
        console.log(`[Performance] ${componentName}:`, {
          renders: renderCount.current,
          renderTime: `${renderTime.toFixed(2)}ms`,
          memory: trackMemory ? `${(metrics.current.memoryUsage! / 1024 / 1024).toFixed(2)}MB` : 'N/A'
        });
      }
    }

    return () => {
      startTime.current = performance.now();
    };
  });

  const logMetrics = () => {
    console.log(`[Performance Metrics] ${componentName}:`, metrics.current);
  };

  return {
    metrics: metrics.current,
    logMetrics
  };
};
