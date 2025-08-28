/**
 * HealthTriage AI Design System
 * Professional Healthcare Platform Design Tokens
 */

export const designSystem = {
  // Color Palette - Professional Healthcare Theme
  colors: {
    // Primary Healthcare Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main brand blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Secondary Healthcare Colors
    secondary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6', // Professional purple
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },

    // Medical Status Colors
    medical: {
      // Risk Levels
      lowRisk: {
        50: '#f0fdf4',
        500: '#22c55e',
        700: '#15803d',
        900: '#14532d',
      },
      mediumRisk: {
        50: '#fffbeb',
        500: '#f59e0b',
        700: '#d97706',
        900: '#92400e',
      },
      highRisk: {
        50: '#fef2f2',
        500: '#ef4444',
        700: '#dc2626',
        900: '#991b1b',
      },
      critical: {
        50: '#fdf2f8',
        500: '#ec4899',
        700: '#be185d',
        900: '#831843',
      },
    },

    // Feature-Specific Colors
    features: {
      triage: {
        primary: '#3b82f6', // Blue
        secondary: '#93c5fd',
        background: '#eff6ff',
      },
      telehealth: {
        primary: '#8b5cf6', // Purple
        secondary: '#c4b5fd',
        background: '#f5f3ff',
      },
      emergency: {
        primary: '#ef4444', // Red
        secondary: '#fca5a5',
        background: '#fef2f2',
      },
      analytics: {
        primary: '#22c55e', // Green
        secondary: '#86efac',
        background: '#f0fdf4',
      },
    },

    // Neutral Colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Semantic Colors
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Typography Scale
  typography: {
    // Font Families
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
      medical: ['Inter', 'system-ui', 'sans-serif'], // Clean, readable for medical content
    },

    // Font Sizes
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },

    // Font Weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },

    // Line Heights
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  // Spacing Scale
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    medical: '0 4px 20px 0 rgb(59 130 246 / 0.15)', // Medical blue glow
    emergency: '0 4px 20px 0 rgb(239 68 68 / 0.15)', // Emergency red glow
  },

  // Animation & Motion
  animation: {
    // Duration
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms',
    },

    // Easing Functions
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      medical: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth, professional
    },

    // Common animations
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },

    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },

    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  },

  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Healthcare-Specific Design Patterns
  medical: {
    // Risk Level Styling
    riskLevels: {
      low: {
        color: '#22c55e',
        background: '#f0fdf4',
        border: '#bbf7d0',
        icon: '✅',
      },
      medium: {
        color: '#f59e0b',
        background: '#fffbeb',
        border: '#fed7aa',
        icon: '⚠️',
      },
      high: {
        color: '#ef4444',
        background: '#fef2f2',
        border: '#fecaca',
        icon: '🚨',
      },
      critical: {
        color: '#dc2626',
        background: '#fef2f2',
        border: '#fca5a5',
        icon: '🆘',
      },
    },

    // Status Indicators
    status: {
      online: {
        color: '#22c55e',
        pulse: true,
      },
      offline: {
        color: '#6b7280',
        pulse: false,
      },
      monitoring: {
        color: '#3b82f6',
        pulse: true,
      },
      alert: {
        color: '#ef4444',
        pulse: true,
      },
    },
  },

  // Component Variants
  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
        shadow: 'shadows.md',
        hover: {
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          shadow: 'shadows.lg',
        },
      },
      medical: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#ffffff',
        shadow: 'shadows.medical',
      },
      emergency: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#ffffff',
        shadow: 'shadows.emergency',
      },
    },

    card: {
      default: {
        background: '#ffffff',
        border: '#e5e7eb',
        shadow: 'shadows.base',
        borderRadius: 'borderRadius.xl',
      },
      medical: {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '#dbeafe',
        shadow: 'shadows.medical',
        borderRadius: 'borderRadius.2xl',
      },
      feature: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: 'rgba(255, 255, 255, 0.2)',
        shadow: 'shadows.lg',
        borderRadius: 'borderRadius.3xl',
      },
    },
  },
} as const;

// Helper functions for design system usage
export const getFeatureColor = (feature: keyof typeof designSystem.colors.features) => {
  return designSystem.colors.features[feature];
};

export const getRiskLevelStyle = (level: keyof typeof designSystem.medical.riskLevels) => {
  return designSystem.medical.riskLevels[level];
};

export const createGradient = (from: string, to: string) => {
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
};

export type DesignSystem = typeof designSystem;