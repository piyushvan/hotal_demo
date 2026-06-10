import type { Metadata } from "next";
import ScrollVideo from '@/components/canvas/Scrollvideos';
import { GallerySection } from "@/components/sections/GallerySection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactAndFooter } from "@/components/sections/ContactAndFooter";

export const metadata: Metadata = {
  title: "The Blackstone Hotel — Rajkot's Finest Luxury Experience",
  description:
    "Step into The Blackstone Hotel, Rajkot — an immersive luxury destination offering premium rooms, fine dining, world-class banquet facilities, and 24/7 concierge service. Discover your sanctuary.",
};

// ─── Scroll-video layout constants ───────────────────────────────────────────
// Each section is SECTION_H vh tall with a sticky video inside.
// Sections overlap by SECTION_OVERLAP vh so transitions blend cleanly.
// Total scroll height = SECTION_STEP * (count - 1) + SECTION_H
const SECTION_H    = 800; // vh — height of each scroll-video section
const SECTION_STEP = 665; // vh — distance between each section's start point (overlap = 135vh)
const SECTION_COUNT = 5;
const TOTAL_H = SECTION_STEP * (SECTION_COUNT - 1) + SECTION_H; // 3460vh

const SECTIONS = [
  { src: "/scrolling/part1_scroll.mp4", enter: "none"  as const, exit: "warp"  as const, overlay: "hero"      as const },
  { src: "/scrolling/part2_scroll.mp4", enter: "warp"  as const, exit: "blend" as const, overlay: "reception" as const },
  { src: "/scrolling/part3_scroll.mp4", enter: "blend" as const, exit: "blend" as const, overlay: "dining"    as const },
  { src: "/scrolling/part4_scroll.mp4", enter: "blend" as const, exit: "warp"  as const, overlay: "rooms"     as const },
  { src: "/scrolling/part5_scroll.mp4", enter: "warp"  as const, exit: "none"  as const, overlay: "contact"   as const },
];

export default function Home() {
  return (
    <main style={{ background: "#000000", minHeight: "100vh" }}>
      {/*
        ── Chunked Video Scroll Experience ──
        Five scroll-driven video sections stacked vertically with intentional overlap.
        Each section is 800vh tall; starts are 665vh apart (135vh overlap for transitions).
        Videos only preload when near the viewport (IntersectionObserver).
      */}
      <div className="relative w-full" style={{ height: `${TOTAL_H}vh` }}>
        {SECTIONS.map((s, i) => (
          <ScrollVideo
            key={s.src}
            src={s.src}
            id={s.overlay === "contact" ? "contact-scrolling" : s.overlay}
            className={`top-0 left-0`}
            style={{ top: `${i * SECTION_STEP}vh` }}
            zIndex={i + 1}
            enterStyle={s.enter}
            exitStyle={s.exit}
            overlayType={s.overlay}
          />
        ))}
      </div>

      {/* ── Standard Page Content ── */}
      <GallerySection />
      <AboutSection />
      <FaqSection />
      <ContactAndFooter />
    </main>
  );
}
