/**
 * Healthcare Animation Patterns
 * Consistent animations and interactions for HealthTriage AI platform
 */

"use client";

import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { designSystem } from '@/styles/design-system';

// Common Animation Variants
export const animationVariants = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Card animations
  cardHover: {
    initial: { scale: 1, y: 0 },
    whileHover: { scale: 1.02, y: -5 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Medical pulse animation
  medicalPulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  // Fade in sequence
  fadeInSequence: (delay: number = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" }
  }),

  // Slide in from sides
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  },

  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  },

  // Scale in
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  // Emergency pulse (more urgent)
  emergencyPulse: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  // Loading shimmer
  shimmer: {
    animate: {
      backgroundPosition: ['-200% 0', '200% 0'],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  },
} as const;

// Healthcare Loading Spinner
interface HealthcareSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const HealthcareSpinner: React.FC<HealthcareSpinnerProps> = ({
  size = 'md',
  color = '#3b82f6',
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full`}
        style={{ color }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// Medical Pulse Indicator
interface MedicalPulseProps {
  color?: string;
  size?: number;
  intensity?: 'normal' | 'urgent';
  className?: string;
}

export const MedicalPulse: React.FC<MedicalPulseProps> = ({
  color = '#22c55e',
  size = 12,
  intensity = 'normal',
  className = '',
}) => {
  const duration = intensity === 'urgent' ? 1 : 2;
  const scale = intensity === 'urgent' ? [1, 1.3, 1] : [1, 1.1, 1];

  return (
    <div className={`relative ${className}`}>
      <div 
        className="rounded-full"
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: color 
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ 
          scale,
          opacity: [0.7, 0.3, 0.7] 
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Animated Counter
interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  duration = 2,
  className = '',
  formatter = (value) => Math.round(value).toString(),
}) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ textContent: formatter(from) }}
        animate={{ textContent: formatter(to) }}
        transition={{
          duration,
          ease: "easeOut",
        }}
      />
    </motion.span>
  );
};

// Healthcare Progress Bar
interface HealthcareProgressProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const HealthcareProgress: React.FC<HealthcareProgressProps> = ({
  value,
  max = 100,
  color = '#3b82f6',
  height = 8,
  showLabel = false,
  label,
  className = '',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showLabel && <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div 
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Healthcare Toast Animation
interface HealthcareToastProps {
  type: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const HealthcareToast: React.FC<HealthcareToastProps> = ({
  type,
  children,
  onClose,
  className = '',
}) => {
  const typeConfig = {
    success: { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
    warning: { color: '#f59e0b', bg: '#fffbeb', border: '#fed7aa' },
    error: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
    info: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  };

  const config = typeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`rounded-xl border p-4 shadow-lg backdrop-blur-sm ${className}`}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MedicalPulse color={config.color} size={8} />
          <div style={{ color: config.color }}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Animated Healthcare Icon
interface AnimatedHealthcareIconProps {
  icon: React.ComponentType<{ className?: string }>;
  animation?: 'pulse' | 'bounce' | 'rotate' | 'none';
  color?: string;
  size?: string;
  className?: string;
}

export const AnimatedHealthcareIcon: React.FC<AnimatedHealthcareIconProps> = ({
  icon: Icon,
  animation = 'none',
  color = 'currentColor',
  size = 'w-6 h-6',
  className = '',
}) => {
  const animations = {
    pulse: {
      animate: {
        scale: [1, 1.1, 1],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    bounce: {
      animate: {
        y: [0, -4, 0],
      },
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    rotate: {
      animate: {
        rotate: 360,
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    },
    none: {}
  };

  return (
    <motion.div 
      className={className}
      {...animations[animation]}
    >
      <Icon 
        className={size}
        style={{ color }}
      />
    </motion.div>
  );
};

// Healthcare Section Reveal Animation
interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: "easeOut" 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default {
  animationVariants,
  HealthcareSpinner,
  MedicalPulse,
  AnimatedCounter,
  HealthcareProgress,
  HealthcareToast,
  AnimatedHealthcareIcon,
  SectionReveal,
};