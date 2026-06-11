"use client";

import React, { useState, useEffect } from "react";
import ScrollVideo from '@/components/canvas/Scrollvideos';
import { GallerySection } from "@/components/sections/GallerySection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactAndFooter } from "@/components/sections/ContactAndFooter";
import { Preloader } from "@/components/ui/Preloader";

const SECTION_H = 1200; // vh — height of each scroll-video section
const SECTION_STEP = 1000; // vh — distance between each section's start point (overlap = 200vh)
const SECTION_COUNT = 5;
const TOTAL_H = SECTION_STEP * (SECTION_COUNT - 1) + SECTION_H; // 5200vh

const SECTIONS = [
  { enter: "none" as const, exit: "warp" as const, overlay: "hero" as const },
  { enter: "warp" as const, exit: "blend" as const, overlay: "reception" as const },
  { enter: "blend" as const, exit: "blend" as const, overlay: "dining" as const },
  { enter: "blend" as const, exit: "warp" as const, overlay: "rooms" as const },
  { enter: "warp" as const, exit: "none" as const, overlay: "contact" as const },
];

export function MainPage() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoSources, setVideoSources] = useState<string[]>([]);

  useEffect(() => {
    const urls = [
      "/scrolling/part1_scroll.mp4",
      "/scrolling/part2_scroll.mp4",
      "/scrolling/part3_scroll.mp4",
      "/scrolling/part4_scroll.mp4",
      "/scrolling/part5_scroll.mp4",
    ];

    const progressTracker = [0, 0, 0, 0, 0];
    const totalVideos = urls.length;
    const loadedUrls: string[] = [];

    const loadVideo = async (url: string, index: number): Promise<string> => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        if (!response.body) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          loadedUrls.push(blobUrl);
          progressTracker[index] = 100;
          updateTotalProgress();
          return blobUrl;
        }

        const contentLength = response.headers.get("content-length");
        const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
        let loadedBytes = 0;

        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            loadedBytes += value.length;
            if (totalBytes > 0) {
              progressTracker[index] = (loadedBytes / totalBytes) * 100;
              updateTotalProgress();
            }
          }
        }

        const blob = new Blob(chunks as any, { type: "video/mp4" });
        const blobUrl = URL.createObjectURL(blob);
        loadedUrls.push(blobUrl);
        progressTracker[index] = 100;
        updateTotalProgress();
        return blobUrl;
      } catch (err) {
        console.error(`Failed to preload video at index ${index}:`, err);
        progressTracker[index] = 100;
        updateTotalProgress();
        return url;
      }
    };

    const updateTotalProgress = () => {
      const totalPercent = progressTracker.reduce((sum, p) => sum + p, 0) / totalVideos;
      setProgress(Math.round(totalPercent));
    };

    // Trigger all downloads concurrently
    Promise.all(urls.map((url, i) => loadVideo(url, i)))
      .then((sources) => {
        setVideoSources(sources);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setLoading(false);
          }, 800);
        }, 400);
      })
      .catch((err) => {
        console.error("General preloading error:", err);
        setVideoSources(urls);
        setFadeOut(true);
        setTimeout(() => setLoading(false), 800);
      });

    // Cleanup: revoke Blob URLs to free memory
    return () => {
      loadedUrls.forEach((blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
    };
  }, []);

  return (
    <main style={{ background: "#000000", minHeight: "100vh" }}>
      {/* Preloading Screen Overlay */}
      {loading && <Preloader progress={progress} fadeOut={fadeOut} />}

      {/* Main visual elements */}
      <div className="relative w-full" style={{ height: `${TOTAL_H}vh` }}>
        {SECTIONS.map((s, i) => {
          // Use preloaded Blob URL if loaded, else fallback to raw video path
          const videoSrc = videoSources[i] || `/scrolling/part${i + 1}_scroll.mp4`;
          return (
            <ScrollVideo
              key={i}
              src={videoSrc}
              id={s.overlay === "contact" ? "contact-scrolling" : s.overlay}
              className="top-0 left-0"
              style={{ top: `${i * SECTION_STEP}vh` }}
              zIndex={i + 1}
              enterStyle={s.enter}
              exitStyle={s.exit}
              overlayType={s.overlay}
              height={SECTION_H}
            />
          );
        })}
      </div>

      <GallerySection />
      <AboutSection />
      <FaqSection />
      <ContactAndFooter />
    </main>
  );
}
