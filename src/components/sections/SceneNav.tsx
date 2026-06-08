"use client";

import React, { useMemo, useState } from "react";
import { CHAPTERS, type ChapterData } from "@/lib/chapters";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SceneNavProps {
  currentFrame: number;
  totalFrames: number;
  activeChapter: ChapterData | null;
  onChapterClick?: (chapterId: string, frameStart: number) => void;
}

// ─── SceneNav ─────────────────────────────────────────────────────────────────

export function SceneNav({
  currentFrame,
  totalFrames,
  activeChapter,
  onChapterClick,
}: SceneNavProps) {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  const scrollProgress = useMemo(
    () => Math.min(1, (currentFrame - 1) / (totalFrames - 1)),
    [currentFrame, totalFrames]
  );

  return (
    <>
      {/* ── Top navigation bar ── */}
      <nav
        aria-label="Scene navigation"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px clamp(24px, 4vw, 52px)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Monogram */}
          <div
            aria-hidden="true"
            style={{
              width: "32px",
              height: "32px",
              border: "1px solid rgba(212,175,55,0.35)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "rgba(212,175,55,0.85)",
                lineHeight: 1,
              }}
            >
              B
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(0.7rem, 1.1vw, 0.9rem)",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              THE BLACKSTONE
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "8px",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.65)",
                lineHeight: 1,
              }}
            >
              HOTEL · RAJKOT
            </span>
          </div>
        </div>

        {/* Chapter dots — centered */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            pointerEvents: "auto",
          }}
        >
          {CHAPTERS.map((ch) => {
            const isActive = activeChapter?.id === ch.id;
            const isHovered = hoveredChapter === ch.id;
            return (
              <div
                key={ch.id}
                style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                {/* Tooltip */}
                {isHovered && !isActive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.85)",
                      border: "1px solid rgba(212,175,55,0.2)",
                      padding: "4px 10px",
                      whiteSpace: "nowrap",
                      fontFamily: "'Geist Sans', sans-serif",
                      fontSize: "9px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.7)",
                      pointerEvents: "none",
                    }}
                  >
                    {ch.label}
                  </div>
                )}
                <button
                  type="button"
                  aria-label={`Navigate to ${ch.label}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => onChapterClick?.(ch.id, ch.frameStart)}
                  onMouseEnter={() => setHoveredChapter(ch.id)}
                  onMouseLeave={() => setHoveredChapter(null)}
                  title={ch.label}
                  style={{
                    background: isActive
                      ? "#d4af37"
                      : isHovered
                      ? "rgba(212,175,55,0.5)"
                      : "rgba(255,255,255,0.2)",
                    border: isActive
                      ? "1px solid rgba(212,175,55,0.9)"
                      : "1px solid rgba(255,255,255,0.12)",
                    width: isActive ? "28px" : "7px",
                    height: "7px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: isActive
                      ? "0 0 10px rgba(212,175,55,0.4)"
                      : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Current chapter label (right) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "3px",
            minWidth: "100px",
          }}
        >
          <span
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            {activeChapter?.label ?? ""}
          </span>
          <span
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: "rgba(212,175,55,0.5)",
              textTransform: "uppercase",
            }}
          >
            {String(currentFrame).padStart(4, "0")} / {String(totalFrames).padStart(4, "0")}
          </span>
        </div>
      </nav>

      {/* ── Bottom progress rail ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(255,255,255,0.06)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${scrollProgress * 100}%`,
            background:
              "linear-gradient(90deg, rgba(212,175,55,0.4) 0%, #d4af37 100%)",
            transition: "width 0.12s linear",
            boxShadow: "0 0 6px rgba(212,175,55,0.3)",
          }}
        />
      </div>

      {/* ── Vertical scroll hint on right edge ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "clamp(16px, 2.5vw, 32px)",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          pointerEvents: "none",
          zIndex: 15,
          opacity: scrollProgress < 0.05 ? 0.8 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            fontFamily: "'Geist Sans', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Scroll
        </div>
        <div
          style={{
            width: "1px",
            height: "48px",
            background:
              "linear-gradient(180deg, rgba(212,175,55,0.7), transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>
    </>
  );
}
