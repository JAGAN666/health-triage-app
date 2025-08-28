"use client";

import React, { Suspense, lazy } from 'react';
import { bundleOptimization } from '@/utils/performance';

// Performance-optimized loading component
const LoadingSpinner = React.memo(() => (
  <div className="flex items-center justify-center p-8" role="status" aria-label="Loading content">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" 
           aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Error boundary for lazy components
class LazyComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Lazy component failed to load:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 text-center text-gray-600">
          <p className="mb-2">Failed to load component</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for lazy loading with error handling
function withLazyLoading<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  displayName?: string
) {
  const LazyComponent = lazy(() => bundleOptimization.dynamicImport(importFn).then(module => 
    module || { default: () => <div>Failed to load component</div> }
  ));
  
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <LazyComponentErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    </LazyComponentErrorBoundary>
  ));

  WrappedComponent.displayName = displayName || 'LazyComponent';
  return WrappedComponent;
}

// Lazy-loaded heavy components
export const LazySymptomChecker = withLazyLoading(
  () => import('@/components/triage/SymptomChecker'),
  'LazySymptomChecker'
);

export const LazyVisualSymptomAnalyzer = withLazyLoading(
  () => import('@/components/triage/VisualSymptomAnalyzer'),
  'LazyVisualSymptomAnalyzer'
);

export const LazyRealTimeVitalMonitor = withLazyLoading(
  () => import('@/components/analytics/RealTimeVitalMonitor'),
  'LazyRealTimeVitalMonitor'
);

export const LazyHealthPredictionEngine = withLazyLoading(
  () => import('@/components/analytics/HealthPredictionEngine'),
  'LazyHealthPredictionEngine'
);

export const LazyFHIRHealthcareIntegration = withLazyLoading(
  () => import('@/components/telehealth/FHIRHealthcareIntegration'),
  'LazyFHIRHealthcareIntegration'
);

export const LazyTelemedicineBookingSystem = withLazyLoading(
  () => import('@/components/telehealth/TelemedicineBookingSystem'),
  'LazyTelemedicineBookingSystem'
);

export const LazyGeofencingEmergencySystem = withLazyLoading(
  () => import('@/components/emergency/GeofencingEmergencySystem'),
  'LazyGeofencingEmergencySystem'
);

export const LazyIoTDeviceIntegration = withLazyLoading(
  () => import('@/components/emergency/IoTDeviceIntegration'),
  'LazyIoTDeviceIntegration'
);

export const LazyBlockchainMedicalRecords = withLazyLoading(
  () => import('@/components/common/BlockchainMedicalRecords'),
  'LazyBlockchainMedicalRecords'
);

export const LazyPopulationHealthAnalytics = withLazyLoading(
  () => import('@/components/analytics/PopulationHealthAnalytics'),
  'LazyPopulationHealthAnalytics'
);

export const LazyHealthcareCostPrediction = withLazyLoading(
  () => import('@/components/analytics/HealthcareCostPrediction'),
  'LazyHealthcareCostPrediction'
);

export const LazyRiskStratificationTools = withLazyLoading(
  () => import('@/components/analytics/RiskStratificationTools'),
  'LazyRiskStratificationTools'
);

export const LazyMoodTracker = withLazyLoading(
  () => import('@/components/common/MoodTracker'),
  'LazyMoodTracker'
);

// Preloader component for critical above-the-fold content
export const CriticalContentPreloader = React.memo(() => {
  React.useEffect(() => {
    // Preload critical components that might be needed immediately
    const criticalImports = [
      () => import('@/components/triage/SymptomChecker'),
      () => import('@/components/analytics/HealthDashboard'),
    ];

    // Preload after initial render to not block critical path
    const timer = setTimeout(() => {
      criticalImports.forEach(importFn => {
        bundleOptimization.dynamicImport(importFn);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
});

CriticalContentPreloader.displayName = 'CriticalContentPreloader';

// Intersection observer-based lazy loader
interface LazyOnScrollProps {
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export const LazyOnScroll = React.memo<LazyOnScrollProps>(({ 
  children, 
  rootMargin = '100px', 
  threshold = 0.1,
  className 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (
        <div className="min-h-[200px] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
});

LazyOnScroll.displayName = 'LazyOnScroll';

// Performance monitoring wrapper
interface PerformanceWrapperProps {
  name: string;
  children: React.ReactNode;
}

export const PerformanceWrapper = React.memo<PerformanceWrapperProps>(({ name, children }) => {
  const renderTime = React.useRef<number>(0);

  React.useEffect(() => {
    const startTime = performance.now();
    renderTime.current = startTime;

    return () => {
      const endTime = performance.now();
      const duration = endTime - renderTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        if (duration > 16) {
          console.warn(`Slow render: ${name} took ${duration.toFixed(2)}ms`);
        } else {
          console.log(`Render time: ${name} took ${duration.toFixed(2)}ms`);
        }
      }
    };
  });

  return <>{children}</>;
});

PerformanceWrapper.displayName = 'PerformanceWrapper';

export { LoadingSpinner, LazyComponentErrorBoundary, withLazyLoading };