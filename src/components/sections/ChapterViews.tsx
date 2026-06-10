"use client";

import React, { useMemo, useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChapterViewsProps {
  chapterIndex: number;
  progress: number;
  onBookingRequest?: (context: string) => void;
}

// ─── Cinematic "Walking Text" Animation Hook ──────────────────────────────────
//
// Simulates the sensation of reading text while walking:
// - Text starts small and blurred (far away)
// - Grows and sharpens as you "approach" it
// - Holds at full clarity during the reading zone
// - Scales up very slightly and fades as you "walk past" it
//
function useCinematicText(
  progress: number,
  {
    approachEnd = 0.22,
    readingEnd = 0.72,
    exitStagger = 0,
  }: { approachEnd?: number; readingEnd?: number; exitStagger?: number } = {}
): React.CSSProperties {
  return useMemo(() => {
    const p = Math.max(0, progress - exitStagger);

    let opacity = 0;
    let scale = 0.72;
    let translateY = 32;
    let blur = 10;

    if (p <= 0) {
      // Not yet visible
      opacity = 0;
      scale = 0.72;
      translateY = 32;
      blur = 10;
    } else if (p < approachEnd) {
      // Phase 1: Approaching — text comes toward you
      const t = p / approachEnd;
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out
      opacity = e;
      scale = 0.72 + e * 0.28;
      translateY = (1 - e) * 32;
      blur = (1 - e) * 10;
    } else if (p < readingEnd) {
      // Phase 2: Full clarity — reading zone
      opacity = 1;
      scale = 1;
      translateY = 0;
      blur = 0;
    } else {
      // Phase 3: Receding — text grows subtly (walking past) and fades
      const t = (p - readingEnd) / (1 - readingEnd);
      const e = t * t;
      opacity = 1 - e;
      scale = 1 + e * 0.12; // subtle "walking past" enlargement
      translateY = -e * 18;
      blur = e * 5;
    }

    return {
      opacity,
      transform: `translateY(${translateY}px) scale(${scale})`,
      filter: blur > 0.5 ? `blur(${blur}px)` : "none",
      willChange: "opacity, transform, filter",
    };
  }, [progress, approachEnd, readingEnd, exitStagger]);
}

// ─── Reusable Transparent Components ─────────────────────────────────────────

function GoldRule({ width = 52 }: { width?: number }) {
  return (
    <div
      className="h-[1px] bg-[linear-gradient(90deg,var(--color-brand-gold),rgba(212,175,55,0.2))] mb-[20px]"
      style={{ width: `${width}px` }}
    />
  );
}

function SubTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-brand-gold/75 mb-[10px] font-normal">
      {children}
    </p>
  );
}

function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-playfair text-[clamp(2rem,4.5vw,4.2rem)] font-bold text-white mb-[20px] leading-[1.1] max-w-[620px] [text-shadow:0_0_60px_rgba(0,0,0,0.95),0_4px_40px_rgba(0,0,0,0.9),0_0_100px_rgba(212,175,55,0.1)]">
      {children}
    </h2>
  );
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-cormorant text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.85] text-white/80 mb-[28px] max-w-[480px] font-normal [text-shadow:0_2px_20px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.8)]">
      {children}
    </p>
  );
}

function GoldButton({
  children,
  onClick,
  fullWidth = false,
  type = "button"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`pointer-events-auto inline-flex items-center gap-[10px] py-[13px] px-[32px] bg-black/30 border border-brand-gold/55 text-brand-gold font-sans text-[10px] font-semibold tracking-[0.24em] uppercase cursor-pointer transition-all duration-200 ease-in-out backdrop-blur-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:bg-brand-gold hover:text-black hover:border-brand-gold hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] ${
        fullWidth ? "w-full justify-center" : ""
      } group`}
    >
      {children}
      <span className="opacity-70 text-[10px] group-hover:text-black">→</span>
    </button>
  );
}

// ─── Transparent Section Shell ────────────────────────────────────────────────

interface SectionShellProps {
  children: React.ReactNode;
  side?: "left" | "right" | "center";
  verticalAlign?: "center" | "bottom" | "top";
}

function SectionShell({
  children,
  side = "right",
  verticalAlign = "center",
}: SectionShellProps) {
  const justifyClass = 
    side === "left" ? "justify-start" : 
    side === "right" ? "justify-end" : "justify-center";
    
  const alignClass = 
    verticalAlign === "top" ? "items-start" : 
    verticalAlign === "bottom" ? "items-end pb-[clamp(60px,8vh,100px)]" : "items-center pb-[clamp(60px,8vh,80px)]";

  return (
    <div className={`absolute inset-0 flex px-[clamp(24px,5.5vw,80px)] pt-[80px] pointer-events-none ${alignClass} ${justifyClass}`}>
      {children}
    </div>
  );
}

// ─── Transparent Content Block ────────────────────────────────────────────────

interface ContentBlockProps {
  children: React.ReactNode;
  animStyle: React.CSSProperties;
  maxWidth?: string;
}

function ContentBlock({ children, animStyle, maxWidth = "540px" }: ContentBlockProps) {
  return (
    <div style={{ ...animStyle, maxWidth, width: "100%" }}>
      {children}
    </div>
  );
}

// ─── Custom Animation for Reception (Video 2) ───────────────────────────────
function useReceptionAnimation(progress: number): React.CSSProperties {
  return useMemo(() => {
    let opacity = 0;
    let translateX = 0;
    let translateY = 0;
    let scale = 0.85; // Text slightly smaller overall as requested
    let blur = 0;

    if (progress < 0.1) {
      // 0 to 1s (0.0 to 0.1): Invisible
      opacity = 0;
      blur = 10;
      translateY = 20;
    } else if (progress < 0.2) {
      // 1s to 2s (0.1 to 0.2): Fade in and clear
      const t = (progress - 0.1) / 0.1;
      opacity = t;
      blur = 10 * (1 - t);
      translateY = 20 * (1 - t);
    } else if (progress < 0.5) {
      // 2s to 5s (0.2 to 0.5): Move right relative to starting position
      const t = (progress - 0.2) / 0.3;
      opacity = 1;
      translateX = t * 80; // Drift smoothly right by 80px
      blur = 0;
    } else if (progress < 0.6) {
      // 5s to 6s (0.5 to 0.6): Fade out with animation
      const t = (progress - 0.5) / 0.1;
      opacity = 1 - t;
      blur = t * 15;
      scale = 0.85 + t * 0.08; // slightly scale up while fading
      translateX = 80 + t * 30; // continue drifting
    } else {
      // After 6s: completely gone (before the camera starts walking around the corner)
      opacity = 0;
      blur = 10;
    }

    return {
      opacity,
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transformOrigin: "right center", // Keep scaling anchored to the right since it's on the right side
      filter: blur > 0.5 ? `blur(${blur}px)` : "none",
      willChange: "opacity, transform, filter",
    };
  }, [progress]);
}

// ─── Chapter 1 → Reception ────────────────────────────────────────────────────

function ReceptionSection({
  progress,
  onBookingRequest,
}: {
  progress: number;
  onBookingRequest?: (ctx: string) => void;
}) {
  const animStyle = useReceptionAnimation(progress);

  return (
    <SectionShell side="right">
      <ContentBlock animStyle={animStyle}>
        <SubTag>A lobby that whispers heritage and roars luxury.</SubTag>
        <GoldRule />
        <SectionHeadline>Your Story Begins at First Light</SectionHeadline>
        <SectionBody>
          Step through our doors and into a world where first impressions are
          permanent impressions. The Blackstone reception is designed as an
          overture — a visual symphony of dark Marquina marble, warm amber
          light, and hand-selected cognac leather. Here, every guest is greeted
          not as a visitor, but as a distinguished arrival.
        </SectionBody>
        <GoldButton onClick={() => onBookingRequest?.("reception")}>
          Meet Our Concierge
        </GoldButton>
      </ContentBlock>
    </SectionShell>
  );
}

// ─── Custom Animation for Dining (Video 3) ──────────────────────────────────
function useDiningAnimation(progress: number): React.CSSProperties {
  return useMemo(() => {
    let opacity = 0;
    let translateX = 0;
    let translateY = 0;
    let scale = 0.85; // Keeping text smaller for consistency
    let blur = 0;

    if (progress < 0.1) {
      // 0 to 1s (0.0 to 0.1): Fade in
      const t = progress / 0.1;
      opacity = t;
      blur = 10 * (1 - t);
      translateY = 20 * (1 - t);
    } else if (progress < 0.5) {
      // 1s to 5s (0.1 to 0.5): Stay visible, very subtle drift left
      const t = (progress - 0.1) / 0.4;
      opacity = 1;
      translateX = -(t * 20); // drift left slightly
      blur = 0;
    } else if (progress < 0.7) {
      // 5s to 7s (0.5 to 0.7): Fade out towards the left side
      const t = (progress - 0.5) / 0.2;
      opacity = 1 - t;
      blur = t * 15;
      scale = 0.85 + t * 0.05; // slightly scale up while fading
      translateX = -20 - (t * 80); // move strongly left while fading
    } else {
      // After 7s: completely gone
      opacity = 0;
      blur = 10;
    }

    return {
      opacity,
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transformOrigin: "left center", // Anchored to the left
      filter: blur > 0.5 ? `blur(${blur}px)` : "none",
      willChange: "opacity, transform, filter",
    };
  }, [progress]);
}

// ─── Chapter 2 → Dining ───────────────────────────────────────────────────────

function DiningSection({
  progress,
  onBookingRequest,
}: {
  progress: number;
  onBookingRequest?: (ctx: string) => void;
}) {
  const animStyle = useDiningAnimation(progress);

  return (
    <SectionShell side="left">
      <ContentBlock animStyle={animStyle}>
        <SubTag>Where every meal is a ceremony, every flavour a memory.</SubTag>
        <GoldRule />
        <SectionHeadline>A Table Set for Royalty</SectionHeadline>
        <SectionBody>
          The Blackstone Restaurant is an homage to Gujarati culinary heritage
          elevated through a global lens. Beneath hand-blown pendant lights,
          60+ expertly laid covers await the discerning diner. Our buffet
          spread — rich in regional spice and international subtlety — is
          prepared daily by our executive chef using locally sourced
          ingredients.
        </SectionBody>
        <GoldButton onClick={() => onBookingRequest?.("dining")}>
          Reserve Your Table
        </GoldButton>
      </ContentBlock>
    </SectionShell>
  );
}

// ─── Chapter 3 → Elevator Lobby ───────────────────────────────────────────────

function ElevatorSection({
  progress,
  onBookingRequest,
}: {
  progress: number;
  onBookingRequest?: (ctx: string) => void;
}) {
  const animStyle = useCinematicText(progress, { approachEnd: 0.2, readingEnd: 0.72 });

  return (
    <SectionShell side="right">
      <ContentBlock animStyle={animStyle}>
        <SubTag>The in-between is where the magic lives.</SubTag>
        <GoldRule />
        <SectionHeadline>Every Floor, A New World</SectionHeadline>
        <SectionBody>
          At The Blackstone, the journey to your room is part of the
          experience. Our living green walls — bursting with ferns, moss,
          succulents, and seasonal blooms — transform a functional corridor
          into a sensory pause. The scent of living plants, the stillness of
          marble, the gleam of steel: this is the hotel&apos;s breathing space.
        </SectionBody>
        <GoldButton onClick={() => onBookingRequest?.("elevator")}>
          Discover Your Floor
        </GoldButton>
      </ContentBlock>
    </SectionShell>
  );
}

// ─── Chapter 4 → Rooms & Suites ───────────────────────────────────────────────

const ROOM_DATA = [
  {
    key: "club",
    name: "Club Room",
    tagline: "Precision Designed for the Purposeful Traveller",
    description:
      "Flagship standard — ergonomic workspace, high-speed fibre Wi-Fi, 43-inch Smart 4K TV, and a bed engineered for deep, restorative sleep.",
  },
  {
    key: "quad",
    name: "Quad Room",
    tagline: "Two Beds. One Standard. Boundless Together.",
    description:
      "Built for the group that travels as one — family reunions, colleague trips, friend getaways — the Quad Room provides two double beds within a generously proportioned space.",
  },
  {
    key: "suite",
    name: "Suite Room",
    tagline: "The Suite Life Is Not a Cliché. It Is a Coordinate.",
    description:
      "Enter a room that unfolds. The Suite at The Blackstone offers a separate living zone, expanded wardrobe space, premium bathroom with freestanding bath, and views that remind you exactly where you are.",
  },
  {
    key: "superdeluxe",
    name: "Super Deluxe",
    tagline: "When You Have Earned the Extraordinary",
    description:
      "The Super Deluxe Room occupies the top tier of our standard accommodation — a space where every detail has been magnified. Larger footprint, premium furniture, enhanced minibar.",
  },
] as const;

// ─── Custom Animation for Rooms ───────────────────────────────────────────────
function useRoomsAnimation(progress: number): React.CSSProperties {
  return useMemo(() => {
    let opacity = 0;
    let translateY = 0;
    const scale = 0.85; // Significantly smaller
    let blur = 0;

    if (progress < 0.15) {
      const t = progress / 0.15;
      opacity = t;
      blur = 10 * (1 - t);
      translateY = 20 * (1 - t);
    } else if (progress < 0.85) {
      opacity = 1;
      blur = 0;
    } else {
      const t = (progress - 0.85) / 0.15;
      opacity = 1 - t;
      blur = t * 10;
      translateY = -(t * 20);
    }

    return {
      opacity,
      transform: `translateY(${translateY}px) scale(${scale})`,
      transformOrigin: "left center",
      filter: blur > 0.5 ? `blur(${blur}px)` : "none",
      willChange: "opacity, transform, filter",
    };
  }, [progress]);
}

function RoomsSection({
  progress,
  onBookingRequest,
}: {
  progress: number;
  onBookingRequest?: (ctx: string) => void;
}) {
  const animStyle = useRoomsAnimation(progress);
  const [localTime, setLocalTime] = useState(0);
  const isActive = progress > 0.05 && progress < 0.95;

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let lastTime = Date.now();
    let frameId: number;

    const tick = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      
      setLocalTime((prev) => (prev + dt) % 16);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
      setLocalTime(0);
    };
  }, [isActive]);

  return (
    <SectionShell side="left">
      <div style={{ ...animStyle, width: "100%", maxWidth: "520px" }} className="pointer-events-auto">
        {/* Header */}
        <div className="text-left mb-[20px]">
          <SubTag>Luxury Rooms &amp; Suites</SubTag>
          <h2 className="font-playfair text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-white leading-[1.1] [text-shadow:0_4px_20px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.8)]">
            A Sanctuary Awaits
          </h2>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[linear-gradient(90deg,var(--color-brand-gold),transparent)] mb-[32px]" />

        {/* Animated Room Sequences */}
        <div className="relative min-h-[220px]">
          {ROOM_DATA.map((room, index) => {
            const startT = index * 4;
            const endT = startT + 4;
            
            let opacity = 0;
            let blur = 10;
            let translateY = 20;
            let pointerEvents: "none" | "auto" = "none";

            if (localTime >= startT && localTime < endT) {
              const t = localTime - startT;
              pointerEvents = "auto";
              if (t < 1) {
                // 0 to 1s: enter
                opacity = t;
                blur = 10 * (1 - t);
                translateY = 20 * (1 - t);
              } else if (t < 3) {
                // 1s to 3s: stay
                opacity = 1;
                blur = 0;
                translateY = 0;
              } else {
                // 3s to 4s: exit
                const exitT = t - 3;
                opacity = 1 - exitT;
                blur = 10 * exitT;
                translateY = -20 * exitT;
                if (opacity < 0.5) pointerEvents = "none";
              }
            }

            const style: React.CSSProperties = {
              opacity,
              filter: blur > 0.5 ? `blur(${blur}px)` : "none",
              transform: `translateY(${translateY}px)`,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              pointerEvents,
              willChange: "opacity, filter, transform",
            };

            return (
              <div key={room.key} style={style}>
                <h3 className="font-playfair text-[clamp(1.3rem,1.8vw,1.8rem)] text-brand-gold mb-[10px] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                  {room.name}
                </h3>
                <p className="font-cormorant text-[clamp(0.95rem,1.2vw,1.1rem)] text-white/90 leading-[1.7] mb-[24px] [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_24px_rgba(0,0,0,0.7)]">
                  {room.description}
                </p>
                <GoldButton
                  onClick={() => onBookingRequest?.(room.key)}
                >
                  BOOK {room.name.toUpperCase()}
                </GoldButton>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

// ─── Chapter 5 → Banquet ──────────────────────────────────────────────────────

function BanquetSection({
  progress,
  onBookingRequest,
}: {
  progress: number;
  onBookingRequest?: (ctx: string) => void;
}) {
  const animStyle = useCinematicText(progress, { approachEnd: 0.2, readingEnd: 0.72 });

  return (
    <SectionShell side="right">
      <ContentBlock animStyle={animStyle}>
        <SubTag>
          Weddings. Celebrations. Milestones. All at their most magnificent.
        </SubTag>
        <GoldRule />
        <SectionHeadline>
          Your Greatest Moments Deserve a Grand Stage
        </SectionHeadline>
        <SectionBody>
          The Blackstone Banquet Hall is a canvas for life&apos;s most
          extraordinary chapters. With 200+ guests, a 40-foot ceiling, and
          bespoke event styling available from our in-house décor team, every
          celebration here is tailored to the individual. Wedding mandaps,
          corporate galas, milestone birthdays — our hall transforms to tell
          your story.
        </SectionBody>
        <GoldButton onClick={() => onBookingRequest?.("banquet")}>
          Plan Your Event
        </GoldButton>
      </ContentBlock>
    </SectionShell>
  );
}

// ─── Chapter 6 → Contact ──────────────────────────────────────────────────────



function ContactSection({ progress }: { progress: number }) {
  const animStyle = useCinematicText(progress, {
    approachEnd: 0.18,
    readingEnd: 0.9,
  });

  const [menuOpen, setMenuOpen] = useState<"dining" | "banquet" | "contact" | null>(null);

  return (
    <>
      <div className="absolute inset-0 flex items-end justify-center pb-[clamp(60px,10vh,100px)] pointer-events-none z-10">
        <div
          style={animStyle}
          className="flex flex-wrap justify-center gap-[16px] pointer-events-auto"
        >
          <GoldButton onClick={() => setMenuOpen("contact")}>
            Contact Us
          </GoldButton>
          <GoldButton onClick={() => setMenuOpen("dining")}>
            Dining Menu
          </GoldButton>
          <GoldButton onClick={() => setMenuOpen("banquet")}>
            Banquet Menu
          </GoldButton>
        </div>
      </div>

      {/* Contact Info Modal */}
      {menuOpen === "contact" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px] bg-black/80 backdrop-blur-md pointer-events-auto transition-opacity duration-300">
          <div className="bg-[#0a0a0a] border border-brand-gold/30 p-[clamp(30px,4vw,50px)] max-w-[600px] w-full relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <button 
              onClick={() => setMenuOpen(null)}
              className="absolute top-[20px] right-[20px] text-brand-gold/60 hover:text-brand-gold text-[20px] transition-colors cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="text-center mb-[30px]">
              <SubTag>Get In Touch</SubTag>
              <div className="flex justify-center mt-[10px] mb-[15px]">
                <GoldRule width={60} />
              </div>
              <h3 className="font-playfair text-[clamp(1.8rem,3vw,2.5rem)] text-brand-gold">
                Contact Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-[16px]">
              {[
                { icon: "📞", label: "Phone", value: "+91 82382 82341 / +91 82382 82361" },
                { icon: "✉️", label: "Email", value: "Hoteltheblackstone@gmail.com" },
                { icon: "🕐", label: "Hours", value: "24/7 Front Desk / Guest Relations" },
                { icon: "📍", label: "Address", value: "150 Ft. Ring Road, Nr. Sokhda Chowkdi, Rajkot - 360006, Gujarat" },
              ].map((item) => (
                <div key={item.label} className="flex gap-[16px] bg-white/5 p-[16px] border border-white/10">
                  <span className="text-[18px] opacity-80 shrink-0 mt-[2px]">
                    {item.icon}
                  </span>
                  <div>
                    <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-brand-gold/70 mb-[4px]">
                      {item.label}
                    </p>
                    <p className="font-cormorant text-[1.1rem] text-white/90 m-0 leading-[1.5]">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-[40px] flex justify-center">
              <GoldButton onClick={() => setMenuOpen(null)}>
                Close
              </GoldButton>
            </div>
          </div>
        </div>
      )}

      {/* Menu Card Modal */}
      {(menuOpen === "dining" || menuOpen === "banquet") && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px] bg-black/80 backdrop-blur-md pointer-events-auto transition-opacity duration-300">
          <div className="bg-[#0a0a0a] border border-brand-gold/30 p-[clamp(30px,4vw,50px)] max-w-[700px] w-full text-center relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <button 
              onClick={() => setMenuOpen(null)}
              className="absolute top-[20px] right-[20px] text-brand-gold/60 hover:text-brand-gold text-[20px] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              ✕
            </button>
            <SubTag>
              {menuOpen === "dining" ? "The Blackstone Restaurant" : "The Blackstone Events"}
            </SubTag>
            <div className="flex justify-center mt-[10px] mb-[15px]">
              <GoldRule width={60} />
            </div>
            <h3 className="font-playfair text-[clamp(1.8rem,3vw,2.5rem)] text-brand-gold mb-[15px]">
              {menuOpen === "dining" ? "Dining Menu" : "Banquet Menu"}
            </h3>
            <p className="font-cormorant text-[clamp(1rem,1.2vw,1.1rem)] text-white/70 mb-[40px] max-w-[400px] mx-auto">
              {menuOpen === "dining" 
                ? "An exquisite selection of regional specialties and global cuisine, crafted to perfection." 
                : "Bespoke catering packages and curated multi-course experiences for your grandest celebrations."}
            </p>
            
            {/* Menu Placeholder */}
            <div className="aspect-[1/1.4] sm:aspect-[16/9] w-full border border-white/10 bg-[linear-gradient(135deg,#111,#000)] flex flex-col items-center justify-center p-[20px] relative overflow-hidden">
              <div className="absolute inset-[10px] border border-brand-gold/10 pointer-events-none" />
              <span className="font-playfair text-[3rem] text-brand-gold/20 mb-[10px]">B</span>
              <span className="text-white/40 font-sans text-[10px] sm:text-[12px] tracking-[0.3em] uppercase max-w-[300px] leading-[1.8]">
                {menuOpen === "dining" ? "Menu Content Currently Under Review by Executive Chef" : "Banquet Packages and Pricing Available Upon Request"}
              </span>
            </div>
            
            <div className="mt-[40px] flex justify-center">
              <GoldButton onClick={() => setMenuOpen(null)}>
                Close Menu
              </GoldButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Switcher ────────────────────────────────────────────────────────────

export function ChapterViews({ chapterIndex, progress, onBookingRequest }: ChapterViewsProps) {
  switch (chapterIndex) {
    case 1:
      return <ReceptionSection progress={progress} onBookingRequest={onBookingRequest} />;
    case 2:
      return <DiningSection progress={progress} onBookingRequest={onBookingRequest} />;
    case 3:
      return <ElevatorSection progress={progress} onBookingRequest={onBookingRequest} />;
    case 4:
      return <RoomsSection progress={progress} onBookingRequest={onBookingRequest} />;
    case 5:
      return <BanquetSection progress={progress} onBookingRequest={onBookingRequest} />;
    case 6:
      return <ContactSection progress={progress} />;
    default:
      return null;
  }
}
