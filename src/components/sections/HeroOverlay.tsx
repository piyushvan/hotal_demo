"use client";

import React, { useMemo } from "react";

export interface HeroOverlayProps {
  /** 0–1 progress within the hero chapter. */
  progress: number;
}

export function HeroOverlay({ progress }: HeroOverlayProps) {
  // Walking text effect: text grows as user approaches (0→0.5), 
  // then fades and shrinks slightly as user passes (0.5→1)
  const { opacity, scale, translateY, blur } = useMemo(() => {
    // Phase 1: Approach — text materializes (0 → 0.45)
    // Phase 2: Reading zone — full opacity (0.45 → 0.65)
    // Phase 3: Receding — text fades as you walk past (0.65 → 1)
    let opacity = 0;
    let scale = 0.8;
    let translateY = 0;
    let blur = 8;

    if (progress < 0.45) {
      // Approaching: scale from 0.8 → 1, blur clears, opacity rises
      const t = progress / 0.45;
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out
      opacity = eased;
      scale = 0.8 + eased * 0.2;
      blur = (1 - eased) * 8;
      translateY = (1 - eased) * 30;
    } else if (progress < 0.65) {
      // Reading zone: fully visible
      opacity = 1;
      scale = 1;
      blur = 0;
      translateY = 0;
    } else {
      // Receding: scale up slightly (going past), fade out
      const t = (progress - 0.65) / 0.35;
      const eased = t * t; // ease-in
      opacity = 1 - eased;
      scale = 1 + eased * 0.08; // slight scale up as you "walk past"
      blur = eased * 6;
      translateY = -eased * 20;
    }

    return { opacity, scale, translateY, blur };
  }, [progress]);

  // Animated rule width
  const ruleWidth = useMemo(() => {
    if (progress < 0.3) return Math.min(120, (progress / 0.3) * 120);
    if (progress > 0.7) return Math.max(0, 120 - ((progress - 0.7) / 0.3) * 120);
    return 120;
  }, [progress]);

  // Letter spacing opens as text appears
  const letterSpacing = useMemo(() => {
    const t = Math.min(1, progress / 0.5);
    return 0.2 + t * 0.25;
  }, [progress]);

  return (
    <div
      aria-label="The Blackstone Hotel — hero title"
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        filter: blur > 0.2 ? `blur(${blur}px)` : "none",
        transition: "none",
        willChange: "opacity, transform, filter",
      }}
    >
      {/* Top decorative structure */}
      <div className="flex flex-col items-center gap-0 mb-[clamp(16px,2.5vh,32px)]">
        <div
          style={{
            width: `${ruleWidth}px`,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.9), transparent)",
            transition: "width 0.05s linear",
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
        className="font-playfair text-[clamp(2rem,5vw,4.5rem)] font-bold text-[var(--text-primary)] uppercase text-center m-0 leading-none [text-shadow:0_4px_24px_rgba(0,0,0,0.85),0_2px_10px_rgba(0,0,0,0.5)]"
        style={{ letterSpacing: `${letterSpacing}em` }}
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
          style={{
            width: `${ruleWidth}px`,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.9), transparent)",
          }}
        />
      </div>

      {/* Tagline — appears after name */}
      <p
        className="font-cormorant text-[clamp(0.7rem,1.3vw,1.05rem)] font-medium text-white/85 tracking-[0.2em] text-center mt-[clamp(20px,3vh,36px)] italic [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_4px_rgba(0,0,0,0.6)]"
        style={{ opacity: progress > 0.1 ? Math.min(1, (progress - 0.1) / 0.2) : 0 }}
      >
        Where luxury meets legacy
      </p>

      {/* Scroll cue */}
      <div
        className="absolute bottom-[clamp(28px,4vh,56px)] flex flex-col items-center gap-[10px] transition-opacity duration-400 ease"
        style={{ opacity: progress < 0.08 ? 1 : Math.max(0, 1 - (progress - 0.08) / 0.1) }}
      >
        <span className="font-sans text-[9px] tracking-[0.3em] text-white/40 uppercase">
          Scroll to explore
        </span>
        <div className="w-[1px] h-[36px] bg-[linear-gradient(180deg,rgba(212,175,55,0.8),transparent)] animate-[scrollPulse_2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
