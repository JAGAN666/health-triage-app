/**
 * Performance Optimization Hook
 * Provides utilities for performance monitoring and optimization
 */

"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage?: number;
  networkRequests: number;
  cacheHits: number;
  errors: string[];
}

interface PerformanceConfig {
  enableMetrics?: boolean;
  enablePreloading?: boolean;
  enableLazyLoading?: boolean;
  cacheStrategy?: 'memory' | 'localStorage' | 'sessionStorage';
  maxCacheSize?: number;
}

export function usePerformanceOptimization(config: PerformanceConfig = {}) {
  const {
    enableMetrics = true,
    enablePreloading = true,
    enableLazyLoading = true,
    cacheStrategy = 'memory',
    maxCacheSize = 100
  } = config;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentCount: 0,
    networkRequests: 0,
    cacheHits: 0,
    errors: []
  });

  const renderStartTime = useRef<number>(Date.now());
  const cache = useRef<Map<string, any>>(new Map());
  const observer = useRef<IntersectionObserver | null>(null);

  // Performance measurement
  const measureRenderTime = useCallback(() => {
    if (!enableMetrics) return;
    
    const renderTime = Date.now() - renderStartTime.current;
    setMetrics(prev => ({ ...prev, renderTime }));
  }, [enableMetrics]);

  // Memory usage monitoring (if available)
  const measureMemoryUsage = useCallback(() => {
    if (!enableMetrics || !(performance as any).memory) return;
    
    const memory = (performance as any).memory;
    const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    setMetrics(prev => ({ ...prev, memoryUsage }));
  }, [enableMetrics]);

  // Cache management
  const getCachedData = useCallback(<T>(key: string): T | null => {
    if (cacheStrategy === 'memory') {
      return cache.current.get(key) || null;
    } else if (cacheStrategy === 'localStorage') {
      try {
        const data = localStorage.getItem(`perf_cache_${key}`);
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    } else if (cacheStrategy === 'sessionStorage') {
      try {
        const data = sessionStorage.getItem(`perf_cache_${key}`);
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    }
    return null;
  }, [cacheStrategy]);

  const setCachedData = useCallback((key: string, data: any) => {
    if (cacheStrategy === 'memory') {
      // Implement LRU cache
      if (cache.current.size >= maxCacheSize) {
        const firstKey = cache.current.keys().next().value;
        cache.current.delete(firstKey);
      }
      cache.current.set(key, data);
      setMetrics(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
    } else if (cacheStrategy === 'localStorage') {
      try {
        localStorage.setItem(`perf_cache_${key}`, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to cache data in localStorage:', e);
      }
    } else if (cacheStrategy === 'sessionStorage') {
      try {
        sessionStorage.setItem(`perf_cache_${key}`, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to cache data in sessionStorage:', e);
      }
    }
  }, [cacheStrategy, maxCacheSize]);

  // Preload resources
  const preloadResource = useCallback((href: string, type: 'script' | 'style' | 'image' | 'fetch') => {
    if (!enablePreloading) return;

    if (type === 'fetch') {
      // Prefetch data
      fetch(href, { priority: 'low' as any }).catch(() => {});
    } else {
      // Preload other resources
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      
      if (type === 'script') link.as = 'script';
      else if (type === 'style') link.as = 'style';
      else if (type === 'image') link.as = 'image';
      
      document.head.appendChild(link);
    }
  }, [enablePreloading]);

  // Lazy loading observer
  const createLazyLoadObserver = useCallback((callback: (entries: IntersectionObserverEntry[]) => void) => {
    if (!enableLazyLoading || !window.IntersectionObserver) return null;

    observer.current = new IntersectionObserver(
      (entries) => {
        callback(entries);
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    return observer.current;
  }, [enableLazyLoading]);

  // Performance optimization utilities
  const optimizeComponent = useCallback((componentRef: React.RefObject<HTMLElement>) => {
    if (!componentRef.current) return;

    // Apply performance optimizations
    const element = componentRef.current;
    
    // GPU acceleration for animations
    if (element.style) {
      element.style.willChange = 'transform, opacity';
      element.style.transform = 'translateZ(0)'; // Force GPU layer
    }

    // Optimize images
    const images = element.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
      if (!img.decoding) {
        img.decoding = 'async';
      }
    });

    // Optimize videos
    const videos = element.querySelectorAll('video');
    videos.forEach(video => {
      video.preload = 'metadata';
    });
  }, []);

  // Debounced performance monitoring
  const debouncedMetricsUpdate = useCallback(
    debounce(() => {
      measureRenderTime();
      measureMemoryUsage();
    }, 1000),
    [measureRenderTime, measureMemoryUsage]
  );

  // Component performance tracking
  const trackComponentRender = useCallback((componentName: string) => {
    if (!enableMetrics) return;

    setMetrics(prev => ({
      ...prev,
      componentCount: prev.componentCount + 1
    }));

    // Track render in performance timeline if available
    if (performance.mark) {
      performance.mark(`${componentName}-render-start`);
      
      // Schedule end mark
      requestAnimationFrame(() => {
        performance.mark(`${componentName}-render-end`);
        if (performance.measure) {
          try {
            performance.measure(
              `${componentName}-render`,
              `${componentName}-render-start`,
              `${componentName}-render-end`
            );
          } catch (e) {
            // Ignore measurement errors
          }
        }
      });
    }
  }, [enableMetrics]);

  // Error boundary integration
  const trackError = useCallback((error: string) => {
    setMetrics(prev => ({
      ...prev,
      errors: [...prev.errors.slice(-9), error] // Keep last 10 errors
    }));
  }, []);

  // Network request tracking
  const trackNetworkRequest = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      networkRequests: prev.networkRequests + 1
    }));
  }, []);

  // Resource hints for critical resources
  const addResourceHints = useCallback(() => {
    if (!document.head) return;

    const hints = [
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ];

    hints.forEach(hint => {
      const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
        document.head.appendChild(link);
      }
    });
  }, []);

  useEffect(() => {
    renderStartTime.current = Date.now();
    
    // Add resource hints
    addResourceHints();
    
    // Start performance monitoring
    debouncedMetricsUpdate();

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [debouncedMetricsUpdate, addResourceHints]);

  return {
    metrics,
    getCachedData,
    setCachedData,
    preloadResource,
    createLazyLoadObserver,
    optimizeComponent,
    trackComponentRender,
    trackError,
    trackNetworkRequest,
    measureRenderTime,
    measureMemoryUsage
  };
}

// Debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default usePerformanceOptimization;