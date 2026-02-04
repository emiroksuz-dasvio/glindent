import { useState, useEffect } from 'react';

/**
 * Hook to detect if user is visiting the site for the first time
 * Uses localStorage to track first visit
 * 
 * @returns {Object} { isFirstVisit: boolean, hasChecked: boolean }
 */
export function useFirstVisit(): { isFirstVisit: boolean; hasChecked: boolean } {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      const storageKey = 'glindent_first_visit';
      const hasVisitedBefore = localStorage.getItem(storageKey);

      if (!hasVisitedBefore) {
        // First visit
        setIsFirstVisit(true);
        // Mark that user has visited
        localStorage.setItem(storageKey, 'true');
      } else {
        // Not first visit
        setIsFirstVisit(false);
      }

      setHasChecked(true);
    } catch (error) {
      // Handle cases where localStorage is not available
      console.warn('localStorage not available:', error);
      setIsFirstVisit(false);
      setHasChecked(true);
    }
  }, []);

  return { isFirstVisit, hasChecked };
}

export default useFirstVisit;
