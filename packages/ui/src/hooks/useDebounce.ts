/**
 * useDebounce Hook
 * Custom hook for debouncing values (delays updates)
 * @module @aistudio555/ui/hooks/useDebounce
 */

import { useState, useEffect } from 'react';

/**
 * Hook that delays updating a value until after a specified delay
 * Useful for search inputs, resize events, etc.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   // This will only run 300ms after user stops typing
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook that debounces a callback function
 * 
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced callback function
 * 
 * @example
 * ```tsx
 * const debouncedSearch = useDebouncedCallback(
 *   (searchTerm: string) => {
 *     performSearch(searchTerm);
 *   },
 *   300
 * );
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  const debouncedCallback = (...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(timer);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}