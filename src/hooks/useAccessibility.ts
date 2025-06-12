
import { useEffect, useRef } from 'react';

export const useAccessibility = () => {
  // Focus management for dynamic content
  const useFocusOnMount = () => {
    const ref = useRef<HTMLElement>(null);
    
    useEffect(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, []);
    
    return ref;
  };

  // Announce to screen readers
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Skip to main content
  const skipToMainContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trap focus within a container
  const useFocusTrap = (isActive: boolean) => {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (!isActive || !containerRef.current) return;

      const container = containerRef.current;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          firstElement.focus();
        }
      };

      container.addEventListener('keydown', handleTabKey);
      container.addEventListener('keydown', handleEscapeKey);

      // Focus first element when trap becomes active
      firstElement?.focus();

      return () => {
        container.removeEventListener('keydown', handleTabKey);
        container.removeEventListener('keydown', handleEscapeKey);
      };
    }, [isActive]);

    return containerRef;
  };

  return {
    useFocusOnMount,
    announceToScreenReader,
    skipToMainContent,
    useFocusTrap
  };
};
