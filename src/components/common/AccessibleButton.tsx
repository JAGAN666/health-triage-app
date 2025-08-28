"use client";

import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends React.ComponentProps<typeof Button> {
  'aria-label'?: string;
  'aria-describedby'?: string;
  loading?: boolean;
  loadingText?: string;
  successFeedback?: string;
  errorFeedback?: string;
  onPress?: () => void | Promise<void>;
  confirmAction?: boolean;
  confirmMessage?: string;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(({
  children,
  className,
  loading,
  loadingText,
  successFeedback,
  errorFeedback,
  onPress,
  confirmAction,
  confirmMessage,
  disabled,
  onClick,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const { announceSuccess, announceError, announceLoading } = useAccessibility();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || isProcessing || disabled) {
      event.preventDefault();
      return;
    }

    // Handle confirmation if required
    if (confirmAction) {
      const confirmed = window.confirm(confirmMessage || 'Are you sure you want to continue?');
      if (!confirmed) {
        event.preventDefault();
        return;
      }
    }

    // Execute original onClick if provided
    if (onClick) {
      onClick(event);
    }

    // Execute onPress with loading states and announcements
    if (onPress) {
      try {
        setIsProcessing(true);
        announceLoading(loadingText || 'Processing request');
        
        await onPress();
        
        if (successFeedback) {
          announceSuccess(successFeedback);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        announceError(errorFeedback || errorMessage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const isLoading = loading || isProcessing;
  const buttonText = isLoading ? (loadingText || 'Loading...') : children;

  return (
    <Button
      ref={ref}
      className={cn(
        // Ensure minimum touch target size (44px x 44px for WCAG AAA)
        'min-h-[44px] min-w-[44px]',
        // Enhanced focus styles for accessibility
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
        // Loading state styles
        isLoading && 'relative',
        className
      )}
      disabled={disabled || isLoading}
      onClick={handleClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading}
      {...props}
    >
      <span className={isLoading ? 'invisible' : 'visible'}>
        {buttonText}
      </span>
      
      {/* Loading indicator */}
      {isLoading && (
        <span 
          className="absolute inset-0 flex items-center justify-center"
          role="status"
          aria-label={loadingText || 'Loading'}
        >
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
    </Button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;