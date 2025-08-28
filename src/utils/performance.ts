/**
 * Performance Optimization Utilities
 * Target: Sub-2-second load times for hackathon competition
 */

import React, { useEffect, useRef, useCallback } from 'react';

// Web Vitals thresholds for excellent performance
export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift (score)
  
  // Additional metrics
  FCP: 1800, // First Contentful Paint (ms)
  TTFB: 600, // Time to First Byte (ms)
  TTI: 3800, // Time to Interactive (ms)
} as const;

/**
 * Performance monitoring and optimization hook
 */
export function usePerformanceMonitor() {
  const performanceRef = useRef<{
    loadStart: number;
    renderStart: number;
    measurements: Record<string, number>;
  }>({
    loadStart: performance.now(),
    renderStart: 0,
    measurements: {},
  });

  const startMeasurement = useCallback((name: string) => {
    performanceRef.current.measurements[`${name}_start`] = performance.now();
  }, []);

  const endMeasurement = useCallback((name: string) => {
    const startTime = performanceRef.current.measurements[`${name}_start`];
    if (startTime) {
      const duration = performance.now() - startTime;
      performanceRef.current.measurements[name] = duration;
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 16) {
        console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
    return 0;
  }, []);

  const getMeasurements = useCallback(() => {
    return { ...performanceRef.current.measurements };
  }, []);

  useEffect(() => {
    performanceRef.current.renderStart = performance.now();
    
    return () => {
      const totalRenderTime = performance.now() - performanceRef.current.renderStart;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Component render time: ${totalRenderTime.toFixed(2)}ms`);
      }
    };
  }, []);

  return {
    startMeasurement,
    endMeasurement,
    getMeasurements,
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        callback(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observerRef.current.observe(targetRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return targetRef;
}

/**
 * Lazy loading hook with performance optimization
 */
export function useLazyLoading<T>(
  loader: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const loadedRef = useRef(false);

  const load = useCallback(async () => {
    if (loadedRef.current || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const startTime = performance.now();
      const result = await loader();
      const loadTime = performance.now() - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Lazy load completed in ${loadTime.toFixed(2)}ms`);
      }
      
      setData(result);
      loadedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Load failed'));
    } finally {
      setLoading(false);
    }
  }, deps);

  const intersectionRef = useIntersectionObserver((isIntersecting) => {
    if (isIntersecting && !loadedRef.current) {
      load();
    }
  });

  return {
    data,
    loading,
    error,
    load,
    intersectionRef,
  };
}

/**
 * Debounced value hook for performance optimization
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttled callback hook
 */
export function useThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args: Args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
}

/**
 * Resource preloading utilities
 */
export const preloadUtils = {
  /**
   * Preload critical CSS
   */
  preloadCss: (href: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
    
    // Load the actual stylesheet
    setTimeout(() => {
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = href;
      document.head.appendChild(styleLink);
    }, 0);
  },

  /**
   * Preload critical JavaScript
   */
  preloadJs: (src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = src;
    document.head.appendChild(link);
  },

  /**
   * Preload images
   */
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },

  /**
   * Preload critical resources
   */
  preloadCriticalResources: () => {
    // Preload critical fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.type = 'font/woff2';
    fontPreload.crossOrigin = 'anonymous';
    fontPreload.href = '/fonts/inter-var.woff2';
    document.head.appendChild(fontPreload);
  },
};

/**
 * Web Vitals measurement
 */
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  // Measure LCP (Largest Contentful Paint)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    const lcp = lastEntry.startTime;
    
    if (lcp > PERFORMANCE_THRESHOLDS.LCP) {
      console.warn(`LCP: ${lcp.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.LCP}ms)`);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Measure FID (First Input Delay)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      const fid = entry.processingStart - entry.startTime;
      
      if (fid > PERFORMANCE_THRESHOLDS.FID) {
        console.warn(`FID: ${fid.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.FID}ms)`);
      }
    });
  }).observe({ entryTypes: ['first-input'] });

  // Measure CLS (Cumulative Layout Shift)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    
    if (clsValue > PERFORMANCE_THRESHOLDS.CLS) {
      console.warn(`CLS: ${clsValue.toFixed(3)} (threshold: ${PERFORMANCE_THRESHOLDS.CLS})`);
    }
  }).observe({ entryTypes: ['layout-shift'] });
}

/**
 * Bundle size analysis utilities
 */
export const bundleOptimization = {
  /**
   * Dynamic import with error handling
   */
  dynamicImport: async <T>(importFn: () => Promise<T>): Promise<T | null> => {
    try {
      const startTime = performance.now();
      const module = await importFn();
      const loadTime = performance.now() - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Dynamic import loaded in ${loadTime.toFixed(2)}ms`);
      }
      
      return module;
    } catch (error) {
      console.error('Dynamic import failed:', error);
      return null;
    }
  },

  /**
   * Check if code splitting is effective
   */
  analyzeBundleSize: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resourceEntries = performance.getEntriesByType('resource');
      
      const jsEntries = resourceEntries.filter(entry => 
        entry.name.includes('.js') && !entry.name.includes('chunk')
      );
      
      const totalJSSize = jsEntries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
      
      console.log(`Total JS bundle size: ${(totalJSSize / 1024).toFixed(2)} KB`);
      console.log(`Page load time: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
    }
  },
};

/**
 * React performance optimization utilities
 */
export const reactOptimization = {
  /**
   * Memoization helper with performance tracking
   */
  memoWithPerf: <T extends (...args: any[]) => any>(fn: T, deps?: React.DependencyList): T => {
    return React.useMemo(() => {
      const startTime = performance.now();
      const result = fn();
      const computeTime = performance.now() - startTime;
      
      if (process.env.NODE_ENV === 'development' && computeTime > 5) {
        console.warn(`Expensive computation: ${computeTime.toFixed(2)}ms`);
      }
      
      return result;
    }, deps) as T;
  },

  /**
   * Callback with performance tracking
   */
  callbackWithPerf: <T extends (...args: any[]) => any>(fn: T, deps?: React.DependencyList): T => {
    return React.useCallback((...args) => {
      const startTime = performance.now();
      const result = fn(...args);
      const executeTime = performance.now() - startTime;
      
      if (process.env.NODE_ENV === 'development' && executeTime > 16) {
        console.warn(`Slow callback execution: ${executeTime.toFixed(2)}ms`);
      }
      
      return result;
    }, deps) as T;
  },
};

/**
 * Image optimization utilities
 */
export const imageOptimization = {
  /**
   * Get optimized image URL based on device capabilities
   */
  getOptimizedImageUrl: (src: string, width?: number, quality = 85) => {
    // In a real app, this would integrate with Next.js Image optimization or a CDN
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    params.set('q', quality.toString());
    
    return `${src}?${params.toString()}`;
  },

  /**
   * Lazy load images with intersection observer
   */
  useLazyImage: (src: string, options: IntersectionObserverInit = {}) => {
    const [imageSrc, setImageSrc] = React.useState<string>('');
    const [isLoaded, setIsLoaded] = React.useState(false);
    
    const imgRef = useIntersectionObserver((isIntersecting) => {
      if (isIntersecting && !isLoaded) {
        setImageSrc(src);
        setIsLoaded(true);
      }
    }, options);

    return { imgRef, imageSrc, isLoaded };
  },
};

export type PerformanceHook = ReturnType<typeof usePerformanceMonitor>;