"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { frameLoader } from "./FrameLoader";
import { TOTAL_FRAMES, LERP_FACTOR } from "@/lib/constants";
import {
  CHAPTERS,
  getActiveChapter,
  getChapterProgress,
  type ChapterData,
} from "@/lib/chapters";
import { HeroOverlay } from "@/components/sections/HeroOverlay";
import { ChapterViews } from "@/components/sections/ChapterViews";
import { ContactModal } from "@/components/sections/ContactModal";
import { SceneNav } from "@/components/sections/SceneNav";

export interface CanvasPlayerProps {
  className?: string;
}

// ─── Scroll Settings ────────────────────────────────────────────────────────
const PIXELS_PER_FRAME = 4;

export function CanvasPlayer({ className = "" }: CanvasPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  const targetFrameRef = useRef<number>(1);
  const displayFrameRef = useRef<number>(1);
  const lastDrawnRef = useRef<number>(-1);
  const animationFrameId = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaderFading, setLoaderFading] = useState(false);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeChapter, setActiveChapter] = useState<ChapterData | null>(CHAPTERS[0]);
  const [chapterProgress, setChapterProgress] = useState(0);

  // Booking modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState("");

  const handleBookingRequest = useCallback((context: string) => {
    setModalContext(context);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => setModalOpen(false), []);

  const handleChapterClick = useCallback((_chapterId: string, frameStart: number) => {
    try {
      const clamped = Math.min(Math.max(1, frameStart), TOTAL_FRAMES);
      const targetScrollY = (clamped - 1) * PIXELS_PER_FRAME;
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    } catch (error) {
      console.warn("[CanvasPlayer] handleChapterClick error:", error);
    }
  }, []);

  // ─── Preloader ────────────────────────────────────────────────────────────

  useEffect(() => {
    const progressInterval = setInterval(() => {
      const pct = Math.round(
        (frameLoader.getLoadedCount() / frameLoader.getTotalFrames()) * 100
      );
      setLoadProgress(pct);
    }, 200);

    frameLoader.onReady(() => {
      clearInterval(progressInterval);
      setLoadProgress(100);
      setLoaderFading(true);
      setTimeout(() => {
        setIsLoading(false);
        setLoaderFading(false);
      }, 800);
    });

    frameLoader.preloadAll().catch((err) => {
      console.warn("[CanvasPlayer] Preloader warning:", err);
    });

    return () => clearInterval(progressInterval);
  }, []);

  // ─── Scroll → Frame Mapping ───────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const rawFrame = Math.floor(scrollY / PIXELS_PER_FRAME) + 1;
      const clampedFrame = Math.min(Math.max(1, rawFrame), TOTAL_FRAMES);
      targetFrameRef.current = clampedFrame;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize frame on mount in case the page is reloaded halfway down
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Draw ────────────────────────────────────────────────────────────────

  const drawFrame = useCallback(
    (frameIndex: number, width: number, height: number) => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const resolvedIndex = frameLoader.getNearestLoadedFrame(frameIndex);
        if (lastDrawnRef.current === resolvedIndex) return;

        const bitmap = frameLoader.getFrame(resolvedIndex);
        if (!bitmap) return;

        const imageRatio = bitmap.width / bitmap.height;
        const canvasRatio = width / height;
        let renderWidth = width, renderHeight = height, offsetX = 0, offsetY = 0;

        if (canvasRatio > imageRatio) {
          renderHeight = width / imageRatio;
          offsetY = (height - renderHeight) / 2;
        } else {
          renderWidth = height * imageRatio;
          offsetX = (width - renderWidth) / 2;
        }

        ctx.drawImage(bitmap, offsetX, offsetY, renderWidth, renderHeight);
        lastDrawnRef.current = resolvedIndex;
      } catch (error) {
        console.warn("[CanvasPlayer] Failed to draw frame:", error);
      }
    },
    []
  );

  // ─── Render Loop ────────────────────────────────────────────────────────

  useEffect(() => {
    const renderLoop = () => {
      try {
        const canvas = canvasRef.current;
        const sticky = stickyRef.current;

        if (canvas && sticky) {
          const { clientWidth, clientHeight } = sticky;
          if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
            canvas.width = clientWidth;
            canvas.height = clientHeight;
            lastDrawnRef.current = -1;
          }

          const gap = targetFrameRef.current - displayFrameRef.current;
          if (Math.abs(gap) > 0.1) {
            displayFrameRef.current += gap * LERP_FACTOR;
          } else {
            displayFrameRef.current = targetFrameRef.current;
          }

          const frameToDraw = Math.min(
            Math.max(1, Math.round(displayFrameRef.current)),
            TOTAL_FRAMES
          );
          
          drawFrame(frameToDraw, canvas.width, canvas.height);

          setCurrentFrame((prev) => {
            if (prev !== frameToDraw) {
              const chapter = getActiveChapter(frameToDraw);
              setActiveChapter(chapter);
              setChapterProgress(
                chapter ? getChapterProgress(frameToDraw, chapter) : 0
              );
              return frameToDraw;
            }
            return prev;
          });
        }
      } catch (error) {
        console.warn("[CanvasPlayer] Error in render loop:", error);
      }
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    animationFrameId.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
    };
  }, [drawFrame]);

  // ─── Render ──────────────────────────────────────────────────────────────

  const isHeroChapter = activeChapter?.id === "hero";
  const isContactChapter = activeChapter?.id === "contact";
  const nonHeroChapterIndex = CHAPTERS.findIndex((c) => c.id === activeChapter?.id);

  return (
    <>
      {/* 
        TALL WRAPPER 
        This ensures the sticky container holds the canvas for the exact amount of scrolling 
        needed to reach the last frame before it unsticks and reveals the gallery.
      */}
      <div
        className={className}
        style={{
          position: "relative",
          minHeight: `calc(${(TOTAL_FRAMES - 1) * PIXELS_PER_FRAME}px + 100vh)`,
          background: "#000000",
        }}
      >
        {/* 
          STICKY CONTAINER 
          This sticks to the viewport while the user scrolls down through the tall wrapper.
          Once the user passes the wrapper, this unsticks and flows upwards normally.
        */}
        <div
          ref={stickyRef}
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Hotel showcase — scroll to explore"
            style={{ width: "100%", height: "100%", display: "block" }}
          />

          {/* Cinematic vignette */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Top gradient for nav */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "120px",
              background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Bottom gradient */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              height: "160px",
              background: "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Left edge accent */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0, left: 0, bottom: 0,
              width: "3px",
              background:
                "linear-gradient(180deg, transparent, rgba(212,175,55,0.4) 40%, rgba(212,175,55,0.2) 70%, transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Scene navigation */}
          {!isLoading && (
            <SceneNav
              currentFrame={currentFrame}
              totalFrames={TOTAL_FRAMES}
              activeChapter={activeChapter}
              onChapterClick={handleChapterClick}
            />
          )}

          {/* Hero overlay */}
          {!isLoading && isHeroChapter && <HeroOverlay progress={chapterProgress} />}

          {/* Chapter content */}
          {!isLoading && !isHeroChapter && !isContactChapter && activeChapter !== null && (
            <ChapterViews
              chapterIndex={nonHeroChapterIndex}
              progress={chapterProgress}
              onBookingRequest={handleBookingRequest}
            />
          )}

          {/* Contact chapter */}
          {!isLoading && isContactChapter && (
            <ChapterViews
              chapterIndex={6}
              progress={chapterProgress}
              onBookingRequest={handleBookingRequest}
            />
          )}

          {/* "Scroll down" prompt near the end of the frames */}
          {!isLoading && currentFrame >= TOTAL_FRAMES - 20 && (
            <div
              style={{
                position: "absolute",
                bottom: "clamp(28px, 5vh, 56px)",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                opacity: Math.min(1, (currentFrame - (TOTAL_FRAMES - 20)) / 20),
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Sans', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.4em",
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                }}
              >
                Scroll to explore more
              </span>
              <div
                style={{
                  width: "1px",
                  height: "40px",
                  background: "linear-gradient(180deg, rgba(212,175,55,0.9), transparent)",
                  animation: "scrollPulse 2s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* Loading overlay */}
          {(isLoading || loaderFading) && (
            <div
              aria-live="polite"
              aria-label={`Loading: ${loadProgress}%`}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#000000",
                color: "#ffffff",
                opacity: loaderFading ? 0 : 1,
                transition: "opacity 0.8s ease",
                zIndex: 50,
              }}
            >
              {(["tl", "tr", "bl", "br"] as const).map((pos) => (
                <div
                  key={pos}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: "40px",
                    height: "40px",
                    ...(pos === "tl" ? { top: 32, left: 32, borderTop: "1px solid rgba(212,175,55,0.5)", borderLeft: "1px solid rgba(212,175,55,0.5)" } : {}),
                    ...(pos === "tr" ? { top: 32, right: 32, borderTop: "1px solid rgba(212,175,55,0.5)", borderRight: "1px solid rgba(212,175,55,0.5)" } : {}),
                    ...(pos === "bl" ? { bottom: 32, left: 32, borderBottom: "1px solid rgba(212,175,55,0.5)", borderLeft: "1px solid rgba(212,175,55,0.5)" } : {}),
                    ...(pos === "br" ? { bottom: 32, right: 32, borderBottom: "1px solid rgba(212,175,55,0.5)", borderRight: "1px solid rgba(212,175,55,0.5)" } : {}),
                  }}
                />
              ))}

              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: "1px", height: "60px",
                    background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.6))",
                    marginBottom: "32px",
                    animation: "lineGrow 1.5s ease forwards",
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    width: "56px", height: "56px",
                    border: "1px solid rgba(212,175,55,0.4)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{
                    width: "40px", height: "40px",
                    border: "1px solid rgba(212,175,55,0.25)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "rgba(212,175,55,0.8)", fontSize: "18px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>B</span>
                  </div>
                </div>
                <p style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: "clamp(1.6rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "0.4em", color: "#ffffff", margin: "0 0 6px 0", textTransform: "uppercase", lineHeight: 1 }}>
                  THE BLACKSTONE
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(0.65rem, 1.2vw, 0.85rem)", letterSpacing: "0.65em", color: "rgba(212,175,55,0.75)", margin: "0 0 40px 0", textTransform: "uppercase" }}>
                  HOTEL · RAJKOT
                </p>
                <div style={{ width: "200px", height: "1px", background: "rgba(255,255,255,0.08)", position: "relative", marginBottom: "16px" }}>
                  <div style={{ position: "absolute", inset: 0, width: `${loadProgress}%`, background: "linear-gradient(90deg, rgba(212,175,55,0.5), #d4af37)", transition: "width 0.3s ease" }} />
                </div>
                <span style={{ fontFamily: "'Geist Sans', sans-serif", fontSize: "10px", letterSpacing: "0.3em", opacity: 0.4, textTransform: "uppercase", color: "#ffffff" }}>
                  Curating your experience
                </span>
                <div
                  aria-hidden="true"
                  style={{
                    width: "1px", height: "60px",
                    background: "linear-gradient(180deg, rgba(212,175,55,0.6), transparent)",
                    marginTop: "32px",
                    animation: "lineGrow 1.5s ease forwards",
                  }}
                />
              </div>
            </div>
          )}

          <style>{`
            @keyframes lineGrow {
              from { opacity: 0; transform: scaleY(0); }
              to   { opacity: 1; transform: scaleY(1); }
            }
            @keyframes scrollPulse {
              0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
              50% { opacity: 1; transform: scaleY(1); }
            }
          `}</style>
        </div>
      </div>

      {/* Booking modal */}
      <ContactModal
        isOpen={modalOpen}
        context={modalContext}
        onClose={handleModalClose}
      />
    </>
  );
}
