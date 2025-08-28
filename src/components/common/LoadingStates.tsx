/**
 * Professional Loading States for Healthcare Platform
 * WCAG compliant loading indicators with healthcare theming
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Heart, Activity, Brain, Shield } from 'lucide-react';

interface LoadingStateProps {
  variant?: 'spinner' | 'pulse' | 'skeleton' | 'medical' | 'healthcare';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  variant = 'medical', 
  size = 'md', 
  message = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerSizes = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
        <p className="mt-2 text-sm text-gray-600 font-medium">{message}</p>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <p className="mt-2 text-sm text-gray-600 font-medium">{message}</p>
      </div>
    );
  }

  if (variant === 'medical') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Stethoscope className={`${sizeClasses[size]} text-blue-600`} />
          <motion.div
            className="absolute inset-0 border-2 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <p className="mt-3 text-sm text-gray-600 font-medium">{message}</p>
      </div>
    );
  }

  if (variant === 'healthcare') {
    const icons = [Stethoscope, Heart, Activity, Brain, Shield];
    
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <div className="relative">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.4,
                ease: "easeInOut"
              }}
            >
              <Icon className={`${sizeClasses[size]} text-blue-600`} />
            </motion.div>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-600 font-medium">{message}</p>
      </div>
    );
  }

  // Skeleton variant
  return (
    <div className={`${className} space-y-3`}>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

// Page loading component
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading healthcare platform...' }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200/50">
      <LoadingState variant="healthcare" size="lg" message={message} />
    </div>
  </div>
);

// Component loading overlay
export const ComponentLoader: React.FC<{ message?: string; className?: string }> = ({ 
  message = 'Loading...', 
  className = '' 
}) => (
  <div className={`absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl ${className}`}>
    <LoadingState variant="medical" size="md" message={message} />
  </div>
);

// Card skeleton loader
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

export default LoadingState;