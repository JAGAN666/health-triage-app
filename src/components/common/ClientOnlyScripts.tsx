"use client";

import { useEffect } from 'react';

export default function ClientOnlyScripts() {
  useEffect(() => {
    // Detect motion preferences and set CSS custom property
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      document.documentElement.style.setProperty(
        '--motion-duration', 
        motionQuery.matches ? '0ms' : '300ms'
      );
    };
    
    updateMotionPreference();
    motionQuery.addEventListener('change', updateMotionPreference);
    
    // High contrast detection
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const updateContrastPreference = () => {
      if (contrastQuery.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };
    
    updateContrastPreference();
    contrastQuery.addEventListener('change', updateContrastPreference);
    
    // Dark mode detection (for future use)
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateDarkModePreference = () => {
      if (darkModeQuery.matches) {
        document.documentElement.classList.add('dark-mode-preference');
      } else {
        document.documentElement.classList.remove('dark-mode-preference');
      }
    };
    
    updateDarkModePreference();
    darkModeQuery.addEventListener('change', updateDarkModePreference);
    
    // Cleanup event listeners
    return () => {
      motionQuery.removeEventListener('change', updateMotionPreference);
      contrastQuery.removeEventListener('change', updateContrastPreference);
      darkModeQuery.removeEventListener('change', updateDarkModePreference);
    };
  }, []);

  return null;
}