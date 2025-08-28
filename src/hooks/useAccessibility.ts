"use client";

import { useEffect, useCallback, useRef } from 'react';
import { screenReaderUtilities, motionAccessibility, healthcareAccessibility } from '@/utils/accessibility';

/**
 * Custom hook for accessibility features and utilities
 * Provides comprehensive WCAG AAA compliance support
 */
export function useAccessibility() {
  const announcementRef = useRef<HTMLDivElement | null>(null);
  const emergencyAnnouncementRef = useRef<HTMLDivElement | null>(null);

  // Initialize accessibility features
  useEffect(() => {
    // Set up announcement regions
    announcementRef.current = document.getElementById('announcements') as HTMLDivElement;
    emergencyAnnouncementRef.current = document.getElementById('emergency-announcements') as HTMLDivElement;

    // Announce medical disclaimer on page load
    const timer = setTimeout(() => {
      healthcareAccessibility.announceMedicalDisclaimer();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Screen reader announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    screenReaderUtilities.announce(message, priority);
  }, []);

  const announceLoading = useCallback((message?: string) => {
    screenReaderUtilities.announceLoading(message);
  }, []);

  const announceError = useCallback((message: string) => {
    screenReaderUtilities.announceError(message);
  }, []);

  const announceSuccess = useCallback((message: string) => {
    screenReaderUtilities.announceSuccess(message);
  }, []);

  const announceEmergency = useCallback((message: string) => {
    healthcareAccessibility.announceEmergency(message);
  }, []);

  const announceRiskLevel = useCallback((
    riskLevel: 'low' | 'moderate' | 'high' | 'critical', 
    details?: string
  ) => {
    healthcareAccessibility.announceRiskLevel(riskLevel, details);
  }, []);

  // Motion preferences
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return motionAccessibility.prefersReducedMotion();
  }, []);

  const getAnimationDuration = useCallback((normalDuration: number) => {
    return motionAccessibility.getAnimationDuration(normalDuration);
  }, []);

  const createSafeAnimation = useCallback((animationProps: any) => {
    return motionAccessibility.createSafeAnimation(animationProps);
  }, []);

  // Focus management
  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      return true;
    }
    return false;
  }, []);

  const focusFirst = useCallback((containerSelector?: string) => {
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
  }, []);

  // Keyboard navigation helpers
  const handleEscapeKey = useCallback((callback: () => void) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleArrowNavigation = useCallback((
    containerSelector: string,
    onArrowUp?: () => void,
    onArrowDown?: () => void,
    onArrowLeft?: () => void,
    onArrowRight?: () => void
  ) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const container = document.querySelector(containerSelector);
      if (!container?.contains(event.target as Node)) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onArrowRight?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    document.title = `${title} - HealthTriage AI`;
    announce(`Page loaded: ${title}`);
  }, [announce]);

  const announcePageChange = useCallback((pageName: string) => {
    announce(`Navigated to ${pageName} page`, 'assertive');
  }, [announce]);

  // Healthcare-specific accessibility
  const announceHealthData = useCallback((data: {
    metric: string;
    value: string | number;
    unit?: string;
    riskLevel?: 'low' | 'moderate' | 'high' | 'critical';
  }) => {
    const message = `${data.metric}: ${data.value}${data.unit ? ` ${data.unit}` : ''}`;
    if (data.riskLevel) {
      announceRiskLevel(data.riskLevel, message);
    } else {
      announce(message);
    }
  }, [announce, announceRiskLevel]);

  const announceInteractionResult = useCallback((
    action: string, 
    result: 'success' | 'error' | 'warning', 
    message: string
  ) => {
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
  }, [announce, announceSuccess, announceError]);

  // Progress announcement for multi-step processes
  const announceProgress = useCallback((step: number, total: number, stepName?: string) => {
    const message = stepName 
      ? `Step ${step} of ${total}: ${stepName}`
      : `Step ${step} of ${total}`;
    announce(message, 'polite');
  }, [announce]);

  // Loading state management
  const announceLoadingState = useCallback((
    isLoading: boolean, 
    action: string,
    result?: string
  ) => {
    if (isLoading) {
      announceLoading(`${action} in progress, please wait`);
    } else if (result) {
      announce(`${action} completed: ${result}`);
    } else {
      announce(`${action} completed`);
    }
  }, [announce, announceLoading]);

  return {
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
    handleArrowNavigation,

    // Form helpers
    generateFieldId,
    createFieldProps,

    // Page structure
    setPageTitle,
    announcePageChange,

    // Accessibility state
    isMotionReduced: prefersReducedMotion(),
  };
}

/**
 * Hook for managing focus trap in modals and dialogs
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableSelector = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ].join(', ');

    const focusableElements = container.querySelectorAll(focusableSelector) as NodeListOf<HTMLElement>;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [containerRef]);
}

/**
 * Hook for managing ARIA live regions
 */
export function useAriaLive() {
  const announceToRegion = useCallback((
    message: string, 
    regionId: string, 
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    const region = document.getElementById(regionId);
    if (region) {
      region.setAttribute('aria-live', priority);
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }, []);

  return { announceToRegion };
}

export type AccessibilityHook = ReturnType<typeof useAccessibility>;