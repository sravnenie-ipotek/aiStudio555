/**
 * useClickOutside Hook
 * Custom hook to detect clicks outside of an element
 * @module @aistudio555/ui/hooks/useClickOutside
 */

import { useEffect, useRef } from 'react';

/**
 * Hook that triggers a callback when clicking outside of the referenced element
 * 
 * @param handler - Function to call when clicking outside
 * @param enabled - Whether the hook is enabled (default: true)
 * @returns ref to attach to the element
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const ref = useClickOutside(() => setIsOpen(false));
 * 
 * return (
 *   <div ref={ref}>
 *     {isOpen && <div>Dropdown content</div>}
 *   </div>
 * );
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler, enabled]);

  return ref;
}

/**
 * Hook that triggers a callback when pressing Escape key
 * 
 * @param handler - Function to call when pressing Escape
 * @param enabled - Whether the hook is enabled (default: true)
 * 
 * @example
 * ```tsx
 * useEscapeKey(() => setIsOpen(false));
 * ```
 */
export function useEscapeKey(
  handler: (event: KeyboardEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handler, enabled]);
}