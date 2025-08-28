"use client";

import { useEffect, useCallback, useRef, useState } from 'react';
import { screenReaderUtilities, healthcareAccessibility } from '@/utils/accessibility';

/**
 * SSR-safe accessibility hook with proper hydration handling
 */
export function useAccessibility() {
  const [isClient, setIsClient] = useState(false);
  const [prefersReducedMotionState, setPrefersReducedMotionState] = useState(false);
  const announcementRef = useRef<HTMLDivElement | null>(null);
  const emergencyAnnouncementRef = useRef<HTMLDivElement | null>(null);

  // Initialize client-side features
  useEffect(() => {
    setIsClient(true);
    
    // Set up announcement regions
    announcementRef.current = document.getElementById('announcements') as HTMLDivElement;
    emergencyAnnouncementRef.current = document.getElementById('emergency-announcements') as HTMLDivElement;

    // Check motion preferences
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotionState(mediaQuery.matches);
      
      // Listen for changes
      const handleChange = () => setPrefersReducedMotionState(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    // Announce medical disclaimer on page load
    const timer = setTimeout(() => {
      healthcareAccessibility.announceMedicalDisclaimer();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Screen reader announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!isClient) return;
    screenReaderUtilities.announce(message, priority);
  }, [isClient]);

  const announceLoading = useCallback((message?: string) => {
    if (!isClient) return;
    screenReaderUtilities.announceLoading(message);
  }, [isClient]);

  const announceError = useCallback((message: string) => {
    if (!isClient) return;
    screenReaderUtilities.announceError(message);
  }, [isClient]);

  const announceSuccess = useCallback((message: string) => {
    if (!isClient) return;
    screenReaderUtilities.announceSuccess(message);
  }, [isClient]);

  const announceEmergency = useCallback((message: string) => {
    if (!isClient) return;
    healthcareAccessibility.announceEmergency(message);
  }, [isClient]);

  const announceRiskLevel = useCallback((
    riskLevel: 'low' | 'moderate' | 'high' | 'critical', 
    details?: string
  ) => {
    if (!isClient) return;
    healthcareAccessibility.announceRiskLevel(riskLevel, details);
  }, [isClient]);

  // Motion preferences
  const prefersReducedMotion = useCallback(() => {
    return prefersReducedMotionState;
  }, [prefersReducedMotionState]);

  const getAnimationDuration = useCallback((normalDuration: number) => {
    return prefersReducedMotionState ? 0 : normalDuration;
  }, [prefersReducedMotionState]);

  const createSafeAnimation = useCallback((animationProps: any) => {
    if (!isClient || prefersReducedMotionState) {
      return { initial: false, animate: false, exit: false };
    }
    return animationProps;
  }, [isClient, prefersReducedMotionState]);

  // Focus management
  const focusElement = useCallback((selector: string) => {
    if (!isClient) return false;
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      return true;
    }
    return false;
  }, [isClient]);

  const focusFirst = useCallback((containerSelector?: string) => {
    if (!isClient) return false;
    
    const container = containerSelector 
      ? document.querySelector(containerSelector) 
      : document;
      
    if (!container) return false;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return true;
    }
    return false;
  }, [isClient]);

  // Keyboard navigation helpers
  const handleEscapeKey = useCallback((callback: () => void) => {
    if (!isClient) return () => {};
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isClient]);

  // Form accessibility helpers
  const generateFieldId = useCallback((prefix = 'field') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const createFieldProps = useCallback((
    id: string,
    label: string,
    error?: string,
    help?: string,
    required = false
  ) => {
    const describedBy = [];
    if (error) describedBy.push(`${id}-error`);
    if (help) describedBy.push(`${id}-help`);

    return {
      id,
      'aria-label': label,
      'aria-describedby': describedBy.length > 0 ? describedBy.join(' ') : undefined,
      'aria-invalid': error ? 'true' : 'false',
      'aria-required': required,
      required,
    };
  }, []);

  // Page structure helpers
  const setPageTitle = useCallback((title: string) => {
    if (!isClient) return;
    document.title = `${title} - HealthTriage AI`;
    announce(`Page loaded: ${title}`);
  }, [isClient, announce]);

  const announcePageChange = useCallback((pageName: string) => {
    if (!isClient) return;
    announce(`Navigated to ${pageName} page`, 'assertive');
  }, [isClient, announce]);

  // Healthcare-specific accessibility
  const announceHealthData = useCallback((data: {
    metric: string;
    value: string | number;
    unit?: string;
    riskLevel?: 'low' | 'moderate' | 'high' | 'critical';
  }) => {
    if (!isClient) return;
    const message = `${data.metric}: ${data.value}${data.unit ? ` ${data.unit}` : ''}`;
    if (data.riskLevel) {
      announceRiskLevel(data.riskLevel, message);
    } else {
      announce(message);
    }
  }, [isClient, announce, announceRiskLevel]);

  const announceInteractionResult = useCallback((
    action: string, 
    result: 'success' | 'error' | 'warning', 
    message: string
  ) => {
    if (!isClient) return;
    const prefix = `${action} ${result}:`;
    switch (result) {
      case 'success':
        announceSuccess(`${prefix} ${message}`);
        break;
      case 'error':
        announceError(`${prefix} ${message}`);
        break;
      case 'warning':
        announce(`${prefix} ${message}`, 'assertive');
        break;
    }
  }, [isClient, announce, announceSuccess, announceError]);

  // Progress announcement for multi-step processes
  const announceProgress = useCallback((step: number, total: number, stepName?: string) => {
    if (!isClient) return;
    const message = stepName 
      ? `Step ${step} of ${total}: ${stepName}`
      : `Step ${step} of ${total}`;
    announce(message, 'polite');
  }, [isClient, announce]);

  // Loading state management
  const announceLoadingState = useCallback((
    isLoading: boolean, 
    action: string,
    result?: string
  ) => {
    if (!isClient) return;
    if (isLoading) {
      announceLoading(`${action} in progress, please wait`);
    } else if (result) {
      announce(`${action} completed: ${result}`);
    } else {
      announce(`${action} completed`);
    }
  }, [isClient, announce, announceLoading]);

  return {
    // Client state
    isClient,

    // Announcements
    announce,
    announceLoading,
    announceError,
    announceSuccess,
    announceEmergency,
    announceRiskLevel,
    announceHealthData,
    announceInteractionResult,
    announceProgress,
    announceLoadingState,

    // Motion and animations
    prefersReducedMotion,
    getAnimationDuration,
    createSafeAnimation,

    // Focus management
    focusElement,
    focusFirst,

    // Keyboard navigation
    handleEscapeKey,

    // Form helpers
    generateFieldId,
    createFieldProps,

    // Page structure
    setPageTitle,
    announcePageChange,

    // Accessibility state
    isMotionReduced: prefersReducedMotionState,
  };
}

export type AccessibilityHook = ReturnType<typeof useAccessibility>;