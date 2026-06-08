import type { Metadata } from "next";
import { CanvasPlayer } from "@/components/canvas/CanvasPlayer";
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
      {/* ── Canvas Experience ──
          CanvasPlayer manages a tall scrolling container.
          The canvas itself is position: sticky. 
          When the user scrolls past its container, the rest of the page appears normally.
      */}
      <CanvasPlayer />

      {/* ── Standard Page Content ── */}
      <GallerySection />
      <AboutSection />
      <FaqSection />
      <ContactAndFooter />
    </main>
  );
}
