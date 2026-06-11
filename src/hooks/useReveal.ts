'use client';
import { useEffect, useRef } from 'react';

/**
 * Attach this ref to a container element.
 * Every child with [data-reveal] will fade + slide in once it enters
 * the viewport. The observer disconnects after all elements are visible.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  options?: Partial<IntersectionObserverInit>
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Observe children tagged [data-reveal]; fall back to the container itself
    const targets = container.querySelectorAll<HTMLElement>('[data-reveal]');
    const els: HTMLElement[] = targets.length ? Array.from(targets) : [container];

    let remaining = els.length;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
            remaining -= 1;
            if (remaining <= 0) observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  // Run once on mount — deps intentionally empty
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}
