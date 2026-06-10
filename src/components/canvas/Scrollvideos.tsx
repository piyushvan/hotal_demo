'use client';

import { useRef, useEffect, useState, useCallback, CSSProperties } from 'react';
import { HeroOverlay } from "@/components/sections/HeroOverlay";
import { ChapterViews } from "@/components/sections/ChapterViews";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransitionStyle = 'warp' | 'blend' | 'none';

// Only types that are actually wired up in page.tsx
type OverlayType = 'hero' | 'reception' | 'dining' | 'rooms' | 'contact';

const CHAPTER_INDEX: Record<OverlayType, number | null> = {
  hero:      null, // uses HeroOverlay directly
  reception: 1,
  dining:    2,
  rooms:     4,
  contact:   6,
};

// ─── ScrollVideo ──────────────────────────────────────────────────────────────

export default function ScrollVideo({
  src,
  zIndex = 1,
  className = "top-0 left-0",
  style,
  enterStyle = 'warp',
  exitStyle = 'warp',
  overlayType,
  id,
}: {
  src: string;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
  enterStyle?: TransitionStyle;
  exitStyle?: TransitionStyle;
  overlayType?: OverlayType;
  id?: string;
}) {
  // React state is only used for driving overlay components.
  // Video opacity/scale/blur are written directly to DOM for zero-GC perf.
  const [progressState, setProgressState] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);

  // Whether this section is near/in the viewport — gated by IntersectionObserver
  const isVisibleRef = useRef(false);
  const rafIdRef     = useRef<number | null>(null);

  // Track the last React progress we set so we only setState when it meaningfully changes
  const lastReactProgressRef = useRef(-1);

  // ─── Tick: runs inside rAF, only when visible ──────────────────────────────

  const tickRef = useRef<() => void>(() => {});

  const tick = useCallback(() => {
    const container = containerRef.current;
    const video     = videoRef.current;

    if (!container || !video || isNaN(video.duration)) {
      rafIdRef.current = requestAnimationFrame(tickRef.current);
      return;
    }

    const rect             = container.getBoundingClientRect();
    const windowHeight     = window.innerHeight;
    const scrollableDistance = rect.height - windowHeight;
    const scrolled         = -rect.top;

    let progress = scrolled / scrollableDistance;
    progress = Math.max(0, Math.min(1, progress));

    // ── Update video time ──
    video.currentTime = progress * video.duration;

    // ── Apply visual transitions directly to DOM (no React re-render) ──
    let opacity = 1;
    let scale   = 1;
    let blur    = 0;
    const threshold = 0.05;

    if (progress < threshold && enterStyle !== 'none') {
      const t = progress / threshold;
      opacity = t;
      if (enterStyle === 'warp') {
        scale = 1.2 - 0.2 * t;
        blur  = 15 * (1 - t);
      }
    } else if (progress > 1 - threshold && exitStyle !== 'none') {
      const t = (progress - (1 - threshold)) / threshold;
      opacity = 1 - t;
      if (exitStyle === 'warp') {
        scale = 1 + 0.2 * t;
        blur  = 15 * t;
      }
    }

    video.style.opacity   = String(opacity);
    video.style.transform = `scale(${scale})`;
    video.style.filter    = blur > 0.1 ? `blur(${blur}px)` : 'none';

    // ── Throttle React state: only update if progress changed by ≥ 0.001 ──
    const rounded = Math.round(progress * 1000) / 1000;
    if (Math.abs(rounded - lastReactProgressRef.current) >= 0.001) {
      lastReactProgressRef.current = rounded;
      setProgressState(rounded);
    }

    rafIdRef.current = requestAnimationFrame(tickRef.current);
  }, [enterStyle, exitStyle]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  // ─── IntersectionObserver: only run rAF when near viewport ───────────────

  useEffect(() => {
    const container = containerRef.current;
    const video     = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = entry.isIntersecting;

        if (entry.isIntersecting && !wasVisible) {
          // Promote to GPU layer only while visible (Fix #4 — willChange optimization)
          video.style.willChange = 'transform, opacity, filter';
          // Start the rAF loop
          rafIdRef.current = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && wasVisible) {
          // Stop the rAF loop and release GPU layer
          if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
          }
          video.style.willChange = 'auto';
        }
      },
      {
        // Preload video and start rAF when within 100% of viewport height
        rootMargin: '100% 0px 100% 0px',
        threshold: 0,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      video.style.willChange = 'auto';
    };
  }, [tick]);

  // ─── Lazy preload: switch from "none" to "auto" when near viewport ────────

  useEffect(() => {
    const container = containerRef.current;
    const video     = videoRef.current;
    if (!container || !video) return;

    const preloadObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.preload = 'auto';
          video.load();
          preloadObserver.disconnect();
        }
      },
      {
        // Start loading when within 2 viewports of the section
        rootMargin: '200% 0px 200% 0px',
        threshold: 0,
      }
    );

    preloadObserver.observe(container);
    return () => preloadObserver.disconnect();
  }, []);

  // ─── Derive overlay chapterIndex ──────────────────────────────────────────

  const chapterIndex = overlayType ? CHAPTER_INDEX[overlayType] : null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      id={id}
      className={`absolute w-full h-[800vh] ${className}`}
      style={{ zIndex, ...style }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="none"
          style={{
            // Start hidden; opacity is controlled via JS
            // willChange is toggled dynamically in the IntersectionObserver (Fix #4)
            opacity: 0,
          }}
        />

        {/* Overlays */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          {overlayType === 'hero' && (
            <HeroOverlay progress={progressState} />
          )}
          {overlayType !== 'hero' && chapterIndex !== null && (
            <ChapterViews
              chapterIndex={chapterIndex}
              progress={progressState}
            />
          )}
        </div>
      </div>
    </div>
  );
}