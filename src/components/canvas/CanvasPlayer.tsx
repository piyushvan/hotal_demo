"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { frameLoader } from "./FrameLoader";

export interface CanvasPlayerProps {
  className?: string;
}

export function CanvasPlayer({ className = "" }: CanvasPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef<number>(1);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    frameLoader.preloadAll().catch((err) => {
      console.warn("[CanvasPlayer] Preloader warning:", err);
    });
  }, []);

  const drawFrame = useCallback((frameIndex: number, width: number, height: number) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      // Deduplication Layer: Terminate paint operation immediately if identical
      if (currentFrameRef.current === frameIndex) {
        return;
      }

      const bitmap = frameLoader.getFrame(frameIndex);
      if (!bitmap) {
        // Graceful fallback structure if frame is not cached yet
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // 2D Canvas implementation of 'object-fit: cover'
      const imageRatio = bitmap.width / bitmap.height;
      const canvasRatio = width / height;
      
      let renderWidth = width;
      let renderHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imageRatio) {
        renderHeight = width / imageRatio;
        offsetY = (height - renderHeight) / 2;
      } else {
        renderWidth = height * imageRatio;
        offsetX = (width - renderWidth) / 2;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bitmap, offsetX, offsetY, renderWidth, renderHeight);

      currentFrameRef.current = frameIndex;
    } catch (error) {
      console.warn("[CanvasPlayer] Failed to draw frame:", error);
    }
  }, []);

  const renderLoop = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (canvas && container) {
        const { clientWidth, clientHeight } = container;
        
        // Dynamically track layout viewport size
        if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
          console.log(`[CanvasPlayer] Resizing viewport to ${clientWidth}x${clientHeight}`);
          canvas.width = clientWidth;
          canvas.height = clientHeight;
          // Force redraw by recalculating aspect bounds immediately
          // without resetting the active loaded frame index cache
          drawFrame(Math.round(targetFrameRef.current), canvas.width, canvas.height);
        }

        // Ensure we don't request a frame beyond total actual frames
        const frameToDraw = Math.min(Math.max(1, Math.round(targetFrameRef.current)), 1065);
        
        drawFrame(frameToDraw, canvas.width, canvas.height);
      }
    } catch (error) {
      console.warn("[CanvasPlayer] Error in render loop:", error);
    }

    animationFrameId.current = requestAnimationFrame(renderLoop);
  }, [drawFrame]);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      // Explicit cleanup phase on component unmount to prevent memory leaks
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [renderLoop]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      try {
        // Progress scaled from 0 to 1073 based on normalized mock wheel event delta
        const delta = Math.sign(e.deltaY) * 5; // Normalized delta
        targetFrameRef.current += delta;
        
        if (targetFrameRef.current < 0) targetFrameRef.current = 0;
        if (targetFrameRef.current > 1065) targetFrameRef.current = 1065;
      } catch (error) {
        console.warn("[CanvasPlayer] Error processing wheel event:", error);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
