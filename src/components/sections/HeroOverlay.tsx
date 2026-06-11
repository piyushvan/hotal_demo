"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";

export interface HeroOverlayRef {
  update: (progress: number) => void;
}

export const HeroOverlay = forwardRef<HeroOverlayRef, {}>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ruleTopRef = useRef<HTMLDivElement>(null);
  const ruleBottomRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  const settersRef = useRef<{
    opacity?: any;
    y?: any;
    scale?: any;
    blur?: any;
    ruleTopWidth?: any;
    ruleBottomWidth?: any;
    letterSpacing?: any;
    taglineOpacity?: any;
    scrollCueOpacity?: any;
  }>({});

  const initSetters = () => {
    if (settersRef.current.opacity) return; // already initialized
    if (!containerRef.current) return;

    settersRef.current = {
      opacity: gsap.quickSetter(containerRef.current, "opacity"),
      y: gsap.quickSetter(containerRef.current, "y", "px"),
      scale: gsap.quickSetter(containerRef.current, "scale"),
      blur: gsap.quickSetter(containerRef.current, "filter"),
      ruleTopWidth: gsap.quickSetter(ruleTopRef.current, "width", "px"),
      ruleBottomWidth: gsap.quickSetter(ruleBottomRef.current, "width", "px"),
      letterSpacing: gsap.quickSetter(titleRef.current, "letterSpacing"),
      taglineOpacity: gsap.quickSetter(taglineRef.current, "opacity"),
      scrollCueOpacity: gsap.quickSetter(scrollCueRef.current, "opacity"),
    };
  };

  useImperativeHandle(ref, () => ({
    update: (progress: number) => {
      initSetters();
      const s = settersRef.current;
      if (!s.opacity) return;

      // Phase 1: Approach — text materializes (0 → 0.45)
      // Phase 2: Reading zone — full opacity (0.45 → 0.65)
      // Phase 3: Receding — text fades as you walk past (0.65 → 1)
      let opacity = 0;
      let scale = 0.8;
      let y = 30;
      let blurVal = 8;

      if (progress < 0.45) {
        const t = progress / 0.45;
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        opacity = eased;
        scale = 0.8 + eased * 0.2;
        blurVal = (1 - eased) * 8;
        y = (1 - eased) * 30;
      } else if (progress < 0.65) {
        opacity = 1;
        scale = 1;
        blurVal = 0;
        y = 0;
      } else {
        const t = (progress - 0.65) / 0.35;
        const eased = t * t;
        opacity = 1 - eased;
        scale = 1 + eased * 0.08;
        blurVal = eased * 6;
        y = -eased * 20;
      }

      s.opacity(opacity);
      s.scale(scale);
      s.y(y);
      s.blur(blurVal > 0.2 ? `blur(${blurVal}px)` : "none");

      // Animated rule widths (top and bottom)
      let ruleWidth = 120;
      if (progress < 0.3) {
        ruleWidth = Math.min(120, (progress / 0.3) * 120);
      } else if (progress > 0.7) {
        ruleWidth = Math.max(0, 120 - ((progress - 0.7) / 0.3) * 120);
      }
      s.ruleTopWidth!(String(ruleWidth));
      s.ruleBottomWidth!(String(ruleWidth));

      // Letter spacing
      const tSpacing = Math.min(1, progress / 0.5);
      const letterSpacing = 0.2 + tSpacing * 0.25;
      s.letterSpacing!(`${letterSpacing}em`);

      // Tagline opacity
      const taglineOpacity = progress > 0.1 ? Math.min(1, (progress - 0.1) / 0.2) : 0;
      s.taglineOpacity!(taglineOpacity);

      // Scroll cue opacity
      const scrollCueOpacity = progress < 0.08 ? 1 : Math.max(0, 1 - (progress - 0.08) / 0.1);
      s.scrollCueOpacity!(scrollCueOpacity);
    }
  }));

  return (
    <div
      ref={containerRef}
      aria-label="The Blackstone Hotel — hero title"
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
      style={{
        opacity: 0,
        transform: "translateY(30px) scale(0.8)",
        filter: "blur(8px)",
        transition: "none",
        willChange: "opacity, transform, filter",
      }}
    >
      {/* Top decorative structure */}
      <div className="flex flex-col items-center gap-0 mb-[clamp(16px,2.5vh,32px)]">
        <div
          ref={ruleTopRef}
          style={{
            width: "0px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.9), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="w-[5px] h-[5px] bg-[rgba(212,175,55,0.7)] rotate-45 my-[10px]"
        />
      </div>

      {/* Location tag above name */}
      <p className="font-cormorant text-[clamp(0.6rem,1.4vw,1rem)] font-semibold text-brand-gold tracking-[0.65em] uppercase text-center mb-[clamp(8px,1.5vh,20px)] [text-shadow:0_2px_8px_rgba(0,0,0,0.9),0_0_2px_rgba(0,0,0,0.8)]">
        RAJKOT · GUJARAT
      </p>

      {/* THE BLACKSTONE — Main title */}
      <h1
        ref={titleRef}
        className="font-playfair text-[clamp(2rem,5vw,4.5rem)] font-bold text-[var(--text-primary)] uppercase text-center m-0 leading-none [text-shadow:0_4px_24px_rgba(0,0,0,0.85),0_2px_10px_rgba(0,0,0,0.5)]"
        style={{ letterSpacing: "0.2em" }}
      >
        THE BLACKSTONE
      </h1>

      {/* Divider row */}
      <div className="flex items-center gap-4 my-[clamp(14px,2.5vh,24px)]">
        <div
          style={{
            width: "clamp(40px, 7vw, 100px)",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5))",
          }}
        />
        <div
          aria-hidden="true"
          className="w-[4px] h-[4px] border border-[rgba(212,175,55,0.6)] rotate-45 shrink-0"
        />
        <div
          style={{
            width: "clamp(40px, 7vw, 100px)",
            height: "1px",
            background: "linear-gradient(90deg, rgba(212,175,55,0.5), transparent)",
          }}
        />
      </div>

      {/* HOTEL subtitle */}
      <p className="font-cormorant text-[clamp(0.75rem,2vw,1.5rem)] font-semibold text-brand-gold tracking-[0.75em] uppercase m-0 text-center [text-shadow:0_2px_10px_rgba(0,0,0,0.95),0_0_4px_rgba(0,0,0,0.8)]">
        HOTEL
      </p>

      {/* Bottom rule */}
      <div className="flex flex-col items-center gap-0 mt-[clamp(16px,2.5vh,32px)]">
        <div
          aria-hidden="true"
          className="w-[4px] h-[4px] bg-[rgba(212,175,55,0.5)] rotate-45 mb-[10px]"
        />
        <div
          ref={ruleBottomRef}
          style={{
            width: "0px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.9), transparent)",
          }}
        />
      </div>

      {/* Tagline — appears after name */}
      <p
        ref={taglineRef}
        className="font-cormorant text-[clamp(0.7rem,1.3vw,1.05rem)] font-medium text-white/85 tracking-[0.2em] text-center mt-[clamp(20px,3vh,36px)] italic [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_4px_rgba(0,0,0,0.6)]"
        style={{ opacity: 0 }}
      >
        Where luxury meets legacy
      </p>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-[clamp(28px,4vh,56px)] flex flex-col items-center gap-[10px] transition-opacity duration-400 ease"
        style={{ opacity: 1 }}
      >
        <span className="font-sans text-[9px] tracking-[0.3em] text-white/40 uppercase">
          Scroll to explore
        </span>
        <div className="w-[1px] h-[36px] bg-[linear-gradient(180deg,rgba(212,175,55,0.8),transparent)] animate-[scrollPulse_2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
});

HeroOverlay.displayName = "HeroOverlay";
