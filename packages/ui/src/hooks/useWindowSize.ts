/**
 * useWindowSize Hook
 * Custom hook to track window dimensions
 * @module @aistudio555/ui/hooks/useWindowSize
 */

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Hook that tracks the current window size
 * Returns undefined during SSR to avoid hydration mismatches
 * 
 * @returns Object with current window width and height
 * 
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 * 
 * return (
 *   <div>
 *     Window size: {width} x {height}
 *   </div>
 * );
 * ```
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

/**
 * Hook that tracks if the window width is below a certain breakpoint
 * 
 * @param breakpoint - Breakpoint in pixels (default: 768)
 * @returns boolean indicating if window is below breakpoint
 * 
 * @example
 * ```tsx
 * const isMobile = useIsSmallScreen(768);
 * const isTablet = useIsSmallScreen(1024);
 * ```
 */
export function useIsSmallScreen(breakpoint: number = 768): boolean {
  const { width } = useWindowSize();
  return width !== undefined ? width < breakpoint : false;
}

/**
 * Hook that returns the current breakpoint name based on Tailwind CSS breakpoints
 * 
 * @returns Current breakpoint name
 * 
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint();
 * // Returns: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * ```
 */
export function useBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  const { width } = useWindowSize();

  if (width === undefined) return 'xs';
  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 640) return 'sm';
  return 'xs';
}