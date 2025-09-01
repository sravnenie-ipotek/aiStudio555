/**
 * useScrollLock Hook
 * Custom hook to lock/unlock body scroll (for modals, overlays)
 * @module @aistudio555/ui/hooks/useScrollLock
 */

import { useEffect, useCallback, useState } from 'react';

/**
 * Hook that locks body scroll when enabled
 * Useful for modals, overlays, and mobile menus
 * 
 * @param enabled - Whether scroll lock is enabled
 * 
 * @example
 * ```tsx
 * const [isModalOpen, setIsModalOpen] = useState(false);
 * useScrollLock(isModalOpen);
 * ```
 */
export function useScrollLock(enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Cleanup: restore original scroll
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = '';
    };
  }, [enabled]);
}

/**
 * Hook that provides manual scroll lock controls
 * 
 * @returns Object with lock/unlock functions and current state
 * 
 * @example
 * ```tsx
 * const { isLocked, lock, unlock, toggle } = useScrollLockControls();
 * 
 * return (
 *   <button onClick={toggle}>
 *     {isLocked ? 'Unlock' : 'Lock'} Scroll
 *   </button>
 * );
 * ```
 */
export function useScrollLockControls() {
  const [isLocked, setIsLocked] = useState(false);

  const lock = useCallback(() => {
    if (typeof window === 'undefined') return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    setIsLocked(true);
  }, []);

  const unlock = useCallback(() => {
    if (typeof window === 'undefined') return;

    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    setIsLocked(false);
  }, []);

  const toggle = useCallback(() => {
    if (isLocked) {
      unlock();
    } else {
      lock();
    }
  }, [isLocked, lock, unlock]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isLocked) {
        unlock();
      }
    };
  }, [isLocked, unlock]);

  return {
    isLocked,
    lock,
    unlock,
    toggle,
  };
}

