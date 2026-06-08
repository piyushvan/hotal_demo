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
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        filter: blur > 0.2 ? `blur(${blur}px)` : "none",
        transition: "none",
        zIndex: 10,
        willChange: "opacity, transform, filter",
      }}
    >
      {/* Top decorative structure */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
          marginBottom: "clamp(16px, 2.5vh, 32px)",
        }}
      >
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
          style={{
            width: "5px",
            height: "5px",
            background: "rgba(212,175,55,0.7)",
            transform: "rotate(45deg)",
            margin: "10px 0",
          }}
        />
      </div>

      {/* Location tag above name */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: "clamp(0.6rem, 1.4vw, 1rem)",
          fontWeight: 600,
          color: "var(--brand-gold)",
          letterSpacing: "0.65em",
          textTransform: "uppercase",
          margin: "0 0 clamp(8px, 1.5vh, 20px) 0",
          textAlign: "center",
          textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)",
        }}
      >
        RAJKOT · GUJARAT
      </p>

      {/* THE BLACKSTONE — Main title */}
      <h1
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: "clamp(2rem, 5vw, 4.5rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: `${letterSpacing}em`,
          textTransform: "uppercase",
          textAlign: "center",
          margin: 0,
          lineHeight: 1,
          textShadow: "0 4px 24px rgba(0,0,0,0.85), 0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        THE BLACKSTONE
      </h1>

      {/* Divider row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          margin: "clamp(14px, 2.5vh, 24px) 0",
        }}
      >
        <div
          style={{
            width: "clamp(40px, 7vw, 100px)",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5))",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            width: "4px",
            height: "4px",
            border: "1px solid rgba(212,175,55,0.6)",
            transform: "rotate(45deg)",
            flexShrink: 0,
          }}
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
      <p
        style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: "clamp(0.75rem, 2vw, 1.5rem)",
          fontWeight: 600,
          color: "var(--brand-gold)",
          letterSpacing: "0.75em",
          textTransform: "uppercase",
          margin: "0",
          textAlign: "center",
          textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.8)",
        }}
      >
        HOTEL
      </p>

      {/* Bottom rule */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
          marginTop: "clamp(16px, 2.5vh, 32px)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "4px",
            height: "4px",
            background: "rgba(212,175,55,0.5)",
            transform: "rotate(45deg)",
            margin: "0 0 10px 0",
          }}
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
        style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: "clamp(0.7rem, 1.3vw, 1.05rem)",
          fontWeight: 500,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.2em",
          textAlign: "center",
          margin: "clamp(20px, 3vh, 36px) 0 0 0",
          fontStyle: "italic",
          opacity: progress > 0.1 ? Math.min(1, (progress - 0.1) / 0.2) : 0,
          textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)",
        }}
      >
        Where luxury meets legacy
      </p>

      {/* Scroll cue */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(28px, 4vh, 56px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          opacity: progress < 0.08 ? 1 : Math.max(0, 1 - (progress - 0.08) / 0.1),
          transition: "opacity 0.4s ease",
        }}
      >
        <span
          style={{
            fontFamily: "'Geist Sans', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
          }}
        >
          Scroll to explore
        </span>
        <div
          style={{
            width: "1px",
            height: "36px",
            background:
              "linear-gradient(180deg, rgba(212,175,55,0.8), transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
