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

export default function Home() {
  return (
    <main style={{ background: "#000000", minHeight: "100vh" }}>
      {/*
        ── Chunked Video Scroll Experience ──
        Five scroll-driven video sections stacked vertically.
        Each section is 800vh tall. Videos only preload when near viewport.
      */}
      <div className="relative w-full h-[3460vh]">
        <ScrollVideo src="/scrolling/part1_scroll.mp4" className="top-0 left-0"       zIndex={1} enterStyle="none"  exitStyle="warp"  overlayType="hero"      />
        <ScrollVideo src="/scrolling/part2_scroll.mp4" className="top-[665vh] left-0"  zIndex={2} enterStyle="warp"  exitStyle="blend" overlayType="reception" />
        <ScrollVideo src="/scrolling/part3_scroll.mp4" className="top-[1330vh] left-0" zIndex={3} enterStyle="blend" exitStyle="blend" overlayType="dining"    />
        <ScrollVideo src="/scrolling/part4_scroll.mp4" className="top-[1995vh] left-0" zIndex={4} enterStyle="blend" exitStyle="warp"  overlayType="rooms"     />
        <ScrollVideo src="/scrolling/part5_scroll.mp4" className="top-[2660vh] left-0" zIndex={5} enterStyle="warp"  exitStyle="none"  overlayType="contact"   />
      </div>

      {/* ── Standard Page Content ── */}
      <GallerySection />
      <AboutSection />
      <FaqSection />
      <ContactAndFooter />
    </main>
  );
}
