/**
 * useMediaQuery Hook
 * Custom hook for responsive design media queries
 * @module @aistudio555/ui/hooks/useMediaQuery
 */

import { useState, useEffect } from 'react';

interface UseMediaQueryOptions {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
}

/**
 * Custom hook to track media query matches
 * @param query - CSS media query string
 * @param options - Configuration options
 * @returns boolean indicating if the media query matches
 * 
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * ```
 */
export function useMediaQuery(
  query: string, 
  options: UseMediaQueryOptions = {}
): boolean {
  const {
    defaultValue = false,
    initializeWithValue = true,
  } = options;

  const getMatches = (query: string): boolean => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const matchMedia = window.matchMedia(query);
    
    // Set initial value
    setMatches(matchMedia.matches);

    // Create listener function
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    matchMedia.addListener(handleChange);

    // Cleanup function
    return () => {
      matchMedia.removeListener(handleChange);
    };
  }, [query]);

  return matches;
}

// Predefined breakpoint hooks for common use cases
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)');

// Dark mode detection
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

// Reduced motion detection
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');