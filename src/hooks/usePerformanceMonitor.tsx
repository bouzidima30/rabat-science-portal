
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  connectionType?: string;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTimeRef = useRef<number>(performance.now());
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const startTime = startTimeRef.current;
    
    // Measure render time
    const renderTime = performance.now() - startTime;
    
    // Get memory usage if available
    const memoryUsage = (performance as any).memory?.usedJSHeapSize;
    
    // Get connection info if available
    const connection = (navigator as any).connection;
    const connectionType = connection?.effectiveType;

    // Measure load time from navigation start
    const navigationStart = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigationStart ? navigationStart.loadEventEnd - navigationStart.navigationStart : 0;

    const performanceMetrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      memoryUsage,
      connectionType
    };

    setMetrics(performanceMetrics);

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚀 Performance Metrics: ${componentName}`);
      console.log(`Render time: ${renderTime.toFixed(2)}ms`);
      console.log(`Load time: ${loadTime.toFixed(2)}ms`);
      if (memoryUsage) {
        console.log(`Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      }
      if (connectionType) {
        console.log(`Connection: ${connectionType}`);
      }
      console.groupEnd();
    }

    // Report slow renders
    if (renderTime > 100) {
      console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName]);

  return metrics;
};

// Hook for measuring specific operations
export const useOperationTimer = () => {
  const startTimer = useRef<number | null>(null);

  const start = (operationName: string) => {
    startTimer.current = performance.now();
    console.time(operationName);
  };

  const end = (operationName: string) => {
    if (startTimer.current) {
      const duration = performance.now() - startTimer.current;
      console.timeEnd(operationName);
      
      if (duration > 500) {
        console.warn(`⚠️ Slow operation: ${operationName} took ${duration.toFixed(2)}ms`);
      }
      
      startTimer.current = null;
      return duration;
    }
    return 0;
  };

  return { start, end };
};

// Hook for monitoring bundle size and lazy loading
export const useBundleMonitor = () => {
  useEffect(() => {
    // Monitor script loading
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;

    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        fetch(src, { method: 'HEAD' })
          .then(response => {
            const contentLength = response.headers.get('content-length');
            if (contentLength) {
              totalSize += parseInt(contentLength);
            }
          })
          .catch(() => {
            // Ignore errors for cross-origin scripts
          });
      }
    });

    // Log bundle information
    setTimeout(() => {
      if (totalSize > 0) {
        console.log(`📦 Estimated bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
      }
    }, 1000);
  }, []);
};
