"use client";

import { useEffect } from 'react';

export default function AnalyticsTracker() {
  useEffect(() => {
    // Only run if Google Analytics is loaded
    if (typeof window === 'undefined') return;

    let interactionTimeout: NodeJS.Timeout | null = null;
    let hasInteracted = false;

    // Function to log custom engagement ping 
    const sendInteractionEvent = (actionType: string) => {
      // Throttle events so we don't spam Google Analytics
      if (interactionTimeout) return;
      
      const gtag = (window as any).gtag;
      if (typeof gtag === 'function') {
        gtag('event', 'tool_interaction', {
          event_category: 'engagement',
          event_label: actionType,
          value: 1
        });
        hasInteracted = true;
      }

      // Allow tracking again after 3 seconds
      interactionTimeout = setTimeout(() => {
        interactionTimeout = null;
      }, 3000);
    };

    // Attach silent listeners to document to capture interactions
    const handleInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // If user clicks a button, copies text, or changes an input field
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button')
      ) {
         sendInteractionEvent('interaction_' + target.tagName.toLowerCase());
      }
    };

    const handleCopy = () => {
      sendInteractionEvent('content_copied');
    };

    // 1. Silent scroll ping to guarantee minor engagement is tracked
    const handleScroll = () => {
        if (!hasInteracted) {
             sendInteractionEvent('page_scrolled');
             window.removeEventListener('scroll', handleScroll);
        }
    };

    document.addEventListener('click', handleInteraction, { passive: true });
    document.addEventListener('change', handleInteraction, { passive: true });
    document.addEventListener('copy', handleCopy, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('change', handleInteraction);
      document.removeEventListener('copy', handleCopy);
      window.removeEventListener('scroll', handleScroll);
      if (interactionTimeout) clearTimeout(interactionTimeout);
    };
  }, []);

  // Returns nothing, completely invisible to the user
  return null;
}
