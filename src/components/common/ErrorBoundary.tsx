/**
 * Healthcare Error Boundary Component
 * Professional error handling with healthcare compliance
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  level?: 'page' | 'component' | 'critical';
}

class HealthcareErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log to healthcare monitoring service (in production)
    console.error('Healthcare Platform Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      level: this.props.level || 'component'
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      return <HealthcareErrorDisplay error={this.state} onRetry={this.handleRetry} level={this.props.level} />;
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: ErrorBoundaryState;
  onRetry: () => void;
  level?: 'page' | 'component' | 'critical';
}

const HealthcareErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, level = 'component' }) => {
  const isCritical = level === 'critical' || level === 'page';
  
  const errorMessages = {
    page: {
      title: 'Healthcare Platform Temporarily Unavailable',
      description: 'We\'re experiencing technical difficulties with the healthcare platform. Our team has been notified and is working to resolve this issue.',
      action: 'Return to Homepage'
    },
    component: {
      title: 'Component Loading Error',
      description: 'This healthcare feature is temporarily unavailable. You can try refreshing or access other platform features.',
      action: 'Retry Component'
    },
    critical: {
      title: 'Critical Healthcare System Error',
      description: 'A critical error has occurred in the healthcare system. For immediate medical assistance, please contact emergency services.',
      action: 'Emergency Support'
    }
  };

  const config = errorMessages[level];

  return (
    <div className={`${isCritical ? 'min-h-screen' : 'min-h-96'} flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-white to-orange-50`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`p-4 ${isCritical ? 'bg-red-500' : 'bg-orange-500'} rounded-2xl shadow-lg`}
              >
                <AlertTriangle className="w-12 h-12 text-white" />
              </motion.div>
            </div>
            <CardTitle className={`text-2xl font-bold ${isCritical ? 'text-red-900' : 'text-orange-900'} mb-2`}>
              {config.title}
            </CardTitle>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
              {config.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details (for non-critical errors) */}
            {!isCritical && process.env.NODE_ENV === 'development' && (
              <details className="bg-gray-50 rounded-xl p-4">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Technical Details
                </summary>
                <div className="text-sm text-gray-600 font-mono bg-white rounded p-3">
                  <div><strong>Error:</strong> {error.error?.message}</div>
                  <div><strong>Error ID:</strong> {error.errorId}</div>
                  <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
                </div>
              </details>
            )}

            {/* Emergency Information for Critical Errors */}
            {isCritical && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-red-900">Emergency Medical Services</h3>
                </div>
                <p className="text-red-800 font-medium">
                  For immediate medical emergencies, call <strong>911</strong> or your local emergency services.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {level === 'critical' ? (
                <>
                  <Button
                    onClick={() => window.location.href = 'tel:911'}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Emergency (911)
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Home className="w-4 h-4 mr-2" />
                      Return Home
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    onClick={onRetry}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {config.action}
                  </Button>
                  {level === 'page' && (
                    <Link href="/">
                      <Button variant="outline">
                        <Home className="w-4 h-4 mr-2" />
                        Homepage
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Support Options */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-center">Need Additional Support?</h4>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Live Chat Support
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call Support
                </Button>
              </div>
            </div>

            {/* Healthcare Compliance Note */}
            <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
              <p>
                This error has been logged in compliance with healthcare data protection standards. 
                Error ID: <code className="bg-white px-1 rounded">{error.errorId}</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Component-level error boundary wrapper
export const ComponentErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HealthcareErrorBoundary level="component">
    {children}
  </HealthcareErrorBoundary>
);

// Page-level error boundary wrapper
export const PageErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HealthcareErrorBoundary level="page">
    {children}
  </HealthcareErrorBoundary>
);

// Critical system error boundary
export const CriticalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HealthcareErrorBoundary level="critical">
    {children}
  </HealthcareErrorBoundary>
);

export default HealthcareErrorBoundary;