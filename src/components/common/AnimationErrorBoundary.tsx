"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AnimationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    console.error('Animation Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('Animation Error Boundary error details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // In a production app, you might want to send this to an error tracking service
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI without animations
      return (
        <div className="opacity-100 transform-none transition-none">
          {this.props.fallback || this.props.children}
        </div>
      );
    }

    return this.props.children;
  }
}

export default AnimationErrorBoundary;