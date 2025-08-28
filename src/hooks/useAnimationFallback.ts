"use client";

import { useState, useEffect } from 'react';

interface AnimationCapability {
  supportsAnimations: boolean;
  preferReducedMotion: boolean;
  animationFallbackActive: boolean;
}

export function useAnimationFallback(): AnimationCapability {
  const [supportsAnimations, setSupportsAnimations] = useState(true);
  const [preferReducedMotion, setPreferReducedMotion] = useState(false);
  const [animationFallbackActive, setAnimationFallbackActive] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreferReducedMotion(mediaQuery.matches);

    // Listen for changes to motion preference
    const handleChange = (e: MediaQueryListEvent) => {
      setPreferReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Test animation capability
    const testAnimationSupport = () => {
      try {
        // Test CSS animation support
        const testElement = document.createElement('div');
        testElement.style.animation = 'test 1s linear';
        
        // Test transform support
        testElement.style.transform = 'translateX(0px)';
        
        // Basic capability check passed
        setSupportsAnimations(true);
      } catch (error) {
        console.warn('Animation capability test failed:', error);
        setSupportsAnimations(false);
        setAnimationFallbackActive(true);
      }
    };

    // Test Framer Motion compatibility
    const testFramerMotion = () => {
      try {
        // Simple test to see if motion components can render
        const motionTest = setTimeout(() => {
          // If we reach this timeout, Framer Motion might have issues
          console.warn('Framer Motion initialization timeout - enabling fallback mode');
          setAnimationFallbackActive(true);
        }, 3000);

        // Clear timeout if everything is working
        const clearTest = () => {
          clearTimeout(motionTest);
        };

        // Listen for any animation-related errors
        window.addEventListener('error', (event) => {
          if (event.error && 
              (event.error.message?.includes('motion') || 
               event.error.message?.includes('framer'))) {
            console.warn('Framer Motion error detected:', event.error);
            setAnimationFallbackActive(true);
            clearTimeout(motionTest);
          }
        });

        return clearTest;
      } catch (error) {
        console.warn('Framer Motion test failed:', error);
        setAnimationFallbackActive(true);
        return () => {};
      }
    };

    testAnimationSupport();
    const cleanup = testFramerMotion();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      cleanup();
    };
  }, []);

  // Activate fallback if user prefers reduced motion
  useEffect(() => {
    if (preferReducedMotion) {
      setAnimationFallbackActive(true);
    }
  }, [preferReducedMotion]);

  return {
    supportsAnimations,
    preferReducedMotion,
    animationFallbackActive: animationFallbackActive || preferReducedMotion
  };
}