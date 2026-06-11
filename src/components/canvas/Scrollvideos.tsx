'use client';

import { useRef, useEffect, useCallback, CSSProperties } from 'react';
import { HeroOverlay, HeroOverlayRef } from "@/components/sections/HeroOverlay";
import { ChapterViews, ChapterViewsRef } from "@/components/sections/ChapterViews";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransitionStyle = 'warp' | 'blend' | 'none';

// Only types that are actually wired up in page.tsx
type OverlayType = 'hero' | 'reception' | 'dining' | 'rooms' | 'contact';

const CHAPTER_INDEX: Record<OverlayType, number | null> = {
  hero: null, // uses HeroOverlay directly
  reception: 1,
  dining: 2,
  rooms: 4,
  contact: 6,
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
  onBookingRequest,
  height = 800,
}: {
  src: string;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
  enterStyle?: TransitionStyle;
  exitStyle?: TransitionStyle;
  overlayType?: OverlayType;
  id?: string;
  onBookingRequest?: (context: string) => void;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HeroOverlayRef | ChapterViewsRef | null>(null);

  // Whether this section is near/in the viewport — gated by IntersectionObserver
  const isVisibleRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Refs for tracking DOM and seek state for performance
  const isInitializedRef = useRef(false);
  const animatedProgressRef = useRef(0);
  const velocityRef = useRef(0);          // spring velocity (units/s)
  const lastTimeRef = useRef<number>(-1); // for delta-time calculation
  const lastAppliedTimeRef = useRef(-1);
  const lastAppliedOpacityRef = useRef(-1);
  const lastAppliedScaleRef = useRef(-1);
  const lastAppliedBlurRef = useRef(-1);

  // ─── Tick: runs inside rAF, only when visible ──────────────────────────────

  const tickRef = useRef<() => void>(() => { });

  const tick = useCallback(() => {
    if (!isVisibleRef.current) return;

    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video || isNaN(video.duration)) {
      rafIdRef.current = requestAnimationFrame(tickRef.current);
      return;
    }

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollableDistance = rect.height - windowHeight;
    const scrolled = -rect.top;

    let targetProgress = scrolled / scrollableDistance;
    targetProgress = Math.max(0, Math.min(1, targetProgress));

    // ── Delta-time: physics is frame-rate independent ──
    const now = performance.now();
    const dt = lastTimeRef.current < 0 ? 0.016 : Math.min((now - lastTimeRef.current) / 1000, 0.064); // clamp to 64ms max
    lastTimeRef.current = now;

    // Initialize/snap animated progress on first tick to prevent jump-in animations
    if (!isInitializedRef.current) {
      animatedProgressRef.current = targetProgress;
      velocityRef.current = 0;
      isInitializedRef.current = true;
    }

    // ── Smooth Scroll Physics Model ──────────────────────────────────────────
    // Euler-integrated springs can cause micro-oscillations that force the 
    // video decoder to jitter heavily. We use a frame-rate independent 
    // exponential decay (lerp) for perfectly smooth, monotonic deceleration.
    const decay = 5.0; // Snappiness coefficient (higher = faster catch-up)
    
    let currentProgress = animatedProgressRef.current;
    
    // Frame-rate independent lerp formula: current += (target - current) * (1 - e^(-decay * dt))
    currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-decay * dt));

    // Snap to target when extremely close to prevent endless tiny DOM updates
    if (Math.abs(currentProgress - targetProgress) < 0.00005) {
      currentProgress = targetProgress;
    }

    // Hard-clamp to prevent floating point from ever escaping [0, 1]
    currentProgress = Math.max(0, Math.min(1, currentProgress));

    animatedProgressRef.current = currentProgress;

    // ── Update video time ──
    const targetTime = currentProgress * video.duration;
    // Only write to currentTime if it has changed by more than 1ms
    if (Math.abs(targetTime - lastAppliedTimeRef.current) > 0.001) {
      video.currentTime = targetTime;
      lastAppliedTimeRef.current = targetTime;
    }

    // ── Apply visual transitions directly to DOM (no React re-render) ──
    let opacity = 1;
    let scale = 1;
    let blur = 0;
    const threshold = 0.05;

    if (currentProgress < threshold && enterStyle !== 'none') {
      const t = currentProgress / threshold;
      opacity = t;
      if (enterStyle === 'warp') {
        scale = 1.2 - 0.2 * t;
        blur = 15 * (1 - t);
      }
    } else if (currentProgress > 1 - threshold && exitStyle !== 'none') {
      const t = (currentProgress - (1 - threshold)) / threshold;
      opacity = 1 - t;
      if (exitStyle === 'warp') {
        scale = 1 + 0.2 * t;
        blur = 15 * t;
      }
    }

    // Only update styles if they have changed past a tolerance threshold
    if (Math.abs(opacity - lastAppliedOpacityRef.current) > 0.001) {
      video.style.opacity = String(opacity);
      lastAppliedOpacityRef.current = opacity;
    }

    if (Math.abs(scale - lastAppliedScaleRef.current) > 0.001) {
      video.style.transform = `scale(${scale})`;
      lastAppliedScaleRef.current = scale;
    }

    if (Math.abs(blur - lastAppliedBlurRef.current) > 0.1) {
      video.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
      lastAppliedBlurRef.current = blur;
    }

    // ── Update overlay via Ref (bypasses React render loop) ──
    if (overlayRef.current) {
      overlayRef.current.update(currentProgress);
    }

    rafIdRef.current = requestAnimationFrame(tickRef.current);
  }, [enterStyle, exitStyle]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  // ─── IntersectionObserver: only run rAF when near viewport ───────────────

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
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
          isInitializedRef.current = false; // Reset to allow snapping when returning
          velocityRef.current = 0;          // Drain spring velocity when off-screen
          lastTimeRef.current = -1;         // Reset dt on next entry
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
      isInitializedRef.current = false;
    };
  }, [tick]);

  // ─── Lazy preload: switch from "metadata" to "auto" when near viewport ──

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const preloadObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.preload = 'auto';
          // Only load() if it hasn't started
          if (video.readyState === 0) {
             video.load();
          }
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
      className={`absolute w-full ${className}`}
      style={{ height: `${height}vh`, zIndex, ...style }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          style={{
            // Start hidden; opacity is controlled via JS
            // willChange is toggled dynamically in the IntersectionObserver (Fix #4)
            opacity: 0,
          }}
        />

        {/* Overlays */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          {overlayType === 'hero' && (
            <HeroOverlay ref={overlayRef} />
          )}
          {overlayType !== 'hero' && chapterIndex !== null && (
            <ChapterViews
              ref={overlayRef}
              chapterIndex={chapterIndex}
              onBookingRequest={onBookingRequest}
            />
          )}
        </div>
      </div>
    </div>
  );
}