"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} role="status" aria-label={text || "Loading"}>
      <motion.div
        className={cn("border-4 border-gray-200 border-t-blue-600 rounded-full", sizeClasses[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
      <span className="sr-only">{text || "Loading content, please wait"}</span>
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
  text?: string;
}

export function LoadingDots({ className, text }: LoadingDotsProps) {
  return (
    <div className={cn("flex items-center justify-center space-x-1", className)} role="status" aria-label={text || "Loading"}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-blue-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          aria-hidden="true"
        />
      ))}
      {text && <span className="ml-3 text-sm text-gray-600">{text}</span>}
      <span className="sr-only">{text || "Loading content, please wait"}</span>
    </div>
  );
}

interface LoadingPulseProps {
  className?: string;
  text?: string;
}

export function LoadingPulse({ className, text }: LoadingPulseProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} role="status" aria-label={text || "Loading"}>
      <motion.div
        className="w-8 h-8 bg-blue-600 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
      <span className="sr-only">{text || "Loading content, please wait"}</span>
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingCard({ title, description, className }: LoadingCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-lg border border-gray-200 shadow-sm", className)}>
      <div className="animate-pulse space-y-4">
        {title && (
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            {description && <div className="h-4 bg-gray-200 rounded w-3/4"></div>}
          </div>
        )}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, children, loadingText, className }: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            {loadingText && (
              <p className="mt-4 text-sm text-gray-600 font-medium">{loadingText}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn("h-4 bg-gray-200 rounded", className)}
          style={{
            width: i === lines - 1 ? `${60 + Math.random() * 30}%` : '100%',
          }}
        />
      ))}
    </div>
  );
}

// Health-themed loading states
interface HealthLoadingProps {
  type: 'analyzing' | 'diagnosing' | 'processing' | 'connecting';
  className?: string;
}

export function HealthLoading({ type, className }: HealthLoadingProps) {
  const messages = {
    analyzing: "Analyzing health data...",
    diagnosing: "Processing symptoms...",
    processing: "Running AI analysis...",
    connecting: "Connecting to healthcare systems..."
  };

  const icons = {
    analyzing: "🔍",
    diagnosing: "⚕️",
    processing: "🧠",
    connecting: "🔗"
  };

  return (
    <div className={cn("text-center py-12", className)}>
      <motion.div
        className="text-4xl mb-4"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {icons[type]}
      </motion.div>
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-lg font-medium text-gray-700">{messages[type]}</p>
      <p className="text-sm text-gray-500 mt-2">Please wait while we process your request</p>
    </div>
  );
}