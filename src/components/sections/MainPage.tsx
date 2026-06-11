"use client";

import React, { useState, useEffect } from "react";
import ScrollVideo from '@/components/canvas/Scrollvideos';
import { GallerySection } from "@/components/sections/GallerySection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactAndFooter } from "@/components/sections/ContactAndFooter";

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

const VIDEO_URLS = [
  "https://dtq9wpk97lso7h0s.public.blob.vercel-storage.com/part1_scroll.mp4?v=2",
  "https://dtq9wpk97lso7h0s.public.blob.vercel-storage.com/part2_scroll.mp4?v=2",
  "https://dtq9wpk97lso7h0s.public.blob.vercel-storage.com/part3_scroll.mp4?v=2",
  "https://dtq9wpk97lso7h0s.public.blob.vercel-storage.com/part4_scroll.mp4?v=2",
  "https://dtq9wpk97lso7h0s.public.blob.vercel-storage.com/part5_scroll.mp4?v=2",
];

export function MainPage() {
  return (
    <main style={{ background: "#000000", minHeight: "100vh" }}>

      {/* Main visual elements */}
      <div className="relative w-full" style={{ height: `${TOTAL_H}vh` }}>
        {SECTIONS.map((s, i) => {
          return (
            <ScrollVideo
              key={i}
              src={VIDEO_URLS[i]}
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
