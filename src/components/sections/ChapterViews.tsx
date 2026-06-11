"use client";

import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";
import { GoldRule, SubTag, GoldButton } from "@/components/ui/DesignSystem";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChapterViewsProps {
  chapterIndex: number;
  onBookingRequest?: (context: string) => void;
}

export interface ChapterViewsRef {
  update: (progress: number) => void;
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
  maxWidth?: string;
  style?: React.CSSProperties;
}

const ContentBlock = forwardRef<HTMLDivElement, ContentBlockProps>(
  ({ children, maxWidth = "540px", style }, ref) => {
    return (
      <div ref={ref} style={{ ...style, maxWidth, width: "100%" }}>
        {children}
      </div>
    );
  }
);
ContentBlock.displayName = "ContentBlock";

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

// ─── Chapter 1 → Reception (Video 2) ──────────────────────────────────────────

function ReceptionSection({
  elementRef,
  onBookingRequest,
}: {
  elementRef: React.RefObject<HTMLDivElement | null>;
  onBookingRequest?: (ctx: string) => void;
}) {
  return (
    <SectionShell side="right">
      <ContentBlock
        ref={elementRef}
        style={{
          opacity: 0,
          transform: "translate(0px, 20px) scale(0.85)",
          transformOrigin: "right center",
          filter: "blur(10px)",
          willChange: "opacity, transform, filter",
        }}
      >
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

// ─── Chapter 2 → Dining (Video 3) ─────────────────────────────────────────────

function DiningSection({
  elementRef,
  onBookingRequest,
}: {
  elementRef: React.RefObject<HTMLDivElement | null>;
  onBookingRequest?: (ctx: string) => void;
}) {
  return (
    <SectionShell side="left">
      <ContentBlock
        ref={elementRef}
        style={{
          opacity: 0,
          transform: "translate(0px, 20px) scale(0.85)",
          transformOrigin: "left center",
          filter: "blur(10px)",
          willChange: "opacity, transform, filter",
        }}
      >
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

// ─── Chapter 4 → Rooms & Suites ───────────────────────────────────────────────

const ROOM_DATA = [
  {
    key: "club",
    name: "Club Room",
    description:
      "Flagship standard — ergonomic workspace, high-speed fibre Wi-Fi, 43-inch Smart 4K TV, and a bed engineered for deep, restorative sleep.",
  },
  {
    key: "quad",
    name: "Quad Room",
    description:
      "Built for the group that travels as one — family reunions, colleague trips, friend getaways — the Quad Room provides two double beds within a generously proportioned space.",
  },
  {
    key: "suite",
    name: "Suite Room",
    description:
      "Enter a room that unfolds. The Suite at The Blackstone offers a separate living zone, expanded wardrobe space, premium bathroom with freestanding bath, and views that remind you exactly where you are.",
  },
  {
    key: "superdeluxe",
    name: "Super Deluxe",
    description:
      "The Super Deluxe Room occupies the top tier of our standard accommodation — a space where every detail has been magnified. Larger footprint, premium furniture, enhanced minibar.",
  },
] as const;

function RoomsSection({
  elementRef,
  onBookingRequest,
}: {
  elementRef: React.RefObject<HTMLDivElement | null>;
  onBookingRequest?: (ctx: string) => void;
}) {
  return (
    <SectionShell side="left">
      <div
        ref={elementRef}
        style={{
          opacity: 0,
          transform: "translateY(20px) scale(0.85)",
          transformOrigin: "left center",
          filter: "blur(10px)",
          willChange: "opacity, transform, filter",
          width: "100%",
          maxWidth: "520px",
        }}
        className="pointer-events-auto"
      >
        {/* Header */}
        <div className="text-left mb-[20px]">
          <SubTag>Luxury Rooms &amp; Suites</SubTag>
          <h2 className="font-playfair text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-white leading-[1.1] [text-shadow:0_4px_20px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.8)]">
            A Sanctuary Awaits
          </h2>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[linear-gradient(90deg,var(--color-brand-gold),transparent)] mb-[32px]" />

        {/* Animated Room Sequences — 100% GPU-composited CSS animation */}
        <div className="relative min-h-[220px]">
          {ROOM_DATA.map((room, index) => {
            const cardStyle: React.CSSProperties = {
              animationName: "cycleRooms",
              animationDuration: "16s",
              animationIterationCount: "infinite",
              animationDelay: `${index * -4}s`,
              animationPlayState: "var(--play-state, paused)",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            };

            return (
              <div key={room.key} style={cardStyle}>
                <h3 className="font-playfair text-[clamp(1.3rem,1.8vw,1.8rem)] text-brand-gold mb-[10px] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                  {room.name}
                </h3>
                <p className="font-cormorant text-[clamp(0.95rem,1.2vw,1.1rem)] text-white/90 leading-[1.7] mb-[24px] [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_24px_rgba(0,0,0,0.7)]">
                  {room.description}
                </p>
                <GoldButton onClick={() => onBookingRequest?.(room.key)}>
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

// ─── Chapter 6 → Contact ──────────────────────────────────────────────────────

function ContactSection({ elementRef }: { elementRef: React.RefObject<HTMLDivElement | null> }) {
  const [menuOpen, setMenuOpen] = useState<"dining" | "banquet" | "contact" | null>(null);

  return (
    <>
      <div className="absolute inset-0 flex items-end justify-center pb-[clamp(60px,10vh,100px)] pointer-events-none z-10">
        <div
          ref={elementRef}
          style={{
            opacity: 0,
            transform: "translateY(32px) scale(0.72)",
            filter: "blur(10px)",
            willChange: "opacity, transform, filter",
          }}
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

export const ChapterViews = forwardRef<ChapterViewsRef, ChapterViewsProps>(
  ({ chapterIndex, onBookingRequest }, ref) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const settersRef = useRef<{
      opacity?: any;
      x?: any;
      y?: any;
      scale?: any;
      blur?: any;
      playState?: any;
    }>({});

    const initSetters = () => {
      if (settersRef.current.opacity) return;
      if (!elementRef.current) return;

      settersRef.current = {
        opacity: gsap.quickSetter(elementRef.current, "opacity"),
        x: gsap.quickSetter(elementRef.current, "x", "px"),
        y: gsap.quickSetter(elementRef.current, "y", "px"),
        scale: gsap.quickSetter(elementRef.current, "scale"),
        blur: gsap.quickSetter(elementRef.current, "filter"),
        playState: (val: string) => {
          elementRef.current?.style.setProperty("--play-state", val);
        },
      };
    };

    useImperativeHandle(ref, () => ({
      update: (progress: number) => {
        initSetters();
        const s = settersRef.current;
        if (!s.opacity) return;

        let opacity = 0;
        let scale = 0.85;
        let x = 0;
        let y = 0;
        let blur = 0;

        if (chapterIndex === 1) {
          // Reception animation calculation
          if (progress < 0.1) {
            opacity = 0;
            scale = 0.85;
            blur = 10;
            y = 20;
          } else if (progress < 0.2) {
            const t = (progress - 0.1) / 0.1;
            opacity = t;
            scale = 0.85 + t * 0.15; // 0.85 → 1.0
            blur = 10 * (1 - t);
            y = 20 * (1 - t);
          } else if (progress < 0.5) {
            const t = (progress - 0.2) / 0.3;
            opacity = 1;
            scale = 1;
            x = t * 80;
            blur = 0;
          } else if (progress < 0.6) {
            const t = (progress - 0.5) / 0.1;
            opacity = 1 - t;
            scale = 1;
            blur = t * 15;
            x = 80 + t * 30;
          } else {
            opacity = 0;
            scale = 0.85;
            blur = 10;
          }

          s.opacity(opacity);
          s.x(x);
          s.y(y);
          s.scale(scale);
          s.blur(blur > 0.5 ? `blur(${blur}px)` : "none");

        } else if (chapterIndex === 2) {
          // Dining animation calculation
          if (progress < 0.1) {
            const t = progress / 0.1;
            opacity = t;
            scale = 0.85 + t * 0.15; // 0.85 → 1.0
            blur = 10 * (1 - t);
            y = 20 * (1 - t);
          } else if (progress < 0.5) {
            const t = (progress - 0.1) / 0.4;
            opacity = 1;
            scale = 1;
            x = -(t * 20);
            blur = 0;
          } else if (progress < 0.7) {
            const t = (progress - 0.5) / 0.2;
            opacity = 1 - t;
            scale = 1;
            blur = t * 15;
            x = -20 - (t * 80);
          } else {
            opacity = 0;
            scale = 0.85;
            blur = 10;
          }

          s.opacity(opacity);
          s.x(x);
          s.y(y);
          s.scale(scale);
          s.blur(blur > 0.5 ? `blur(${blur}px)` : "none");

        } else if (chapterIndex === 4) {
          // Rooms animation calculation
          if (progress < 0.15) {
            const t = progress / 0.15;
            opacity = t;
            blur = 10 * (1 - t);
            y = 20 * (1 - t);
          } else if (progress < 0.85) {
            opacity = 1;
            blur = 0;
          } else {
            const t = (progress - 0.85) / 0.15;
            opacity = 1 - t;
            blur = t * 10;
            y = -(t * 20);
          }

          s.opacity(opacity);
          s.x(x);
          s.y(y);
          s.scale(scale);
          s.blur(blur > 0.5 ? `blur(${blur}px)` : "none");

          const isActive = progress > 0.05 && progress < 0.95;
          s.playState!(isActive ? "running" : "paused");

        } else if (chapterIndex === 6) {
          // Cinematic text/Contact animation calculation
          const approachEnd = 0.18;
          const readingEnd = 0.9;
          const exitStagger = 0;
          const p = Math.max(0, progress - exitStagger);

          let scaleCinematic = 0.72;
          let yCinematic = 32;
          let blurCinematic = 10;

          if (p <= 0) {
            opacity = 0;
            scaleCinematic = 0.72;
            yCinematic = 32;
            blurCinematic = 10;
          } else if (p < approachEnd) {
            const t = p / approachEnd;
            const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            opacity = e;
            scaleCinematic = 0.72 + e * 0.28;
            yCinematic = (1 - e) * 32;
            blurCinematic = (1 - e) * 10;
          } else if (p < readingEnd) {
            opacity = 1;
            scaleCinematic = 1;
            yCinematic = 0;
            blurCinematic = 0;
          } else {
            const t = (p - readingEnd) / (1 - readingEnd);
            const e = t * t;
            opacity = 1 - e;
            scaleCinematic = 1 + e * 0.12;
            yCinematic = -e * 18;
            blurCinematic = e * 5;
          }

          s.opacity(opacity);
          s.x(0);
          s.y(yCinematic);
          s.scale(scaleCinematic);
          s.blur(blurCinematic > 0.5 ? `blur(${blurCinematic}px)` : "none");
        }
      },
    }));

    switch (chapterIndex) {
      case 1:
        return <ReceptionSection elementRef={elementRef} onBookingRequest={onBookingRequest} />;
      case 2:
        return <DiningSection elementRef={elementRef} onBookingRequest={onBookingRequest} />;
      case 4:
        return <RoomsSection elementRef={elementRef} onBookingRequest={onBookingRequest} />;
      case 6:
        return <ContactSection elementRef={elementRef} />;
      default:
        return null;
    }
  }
);
ChapterViews.displayName = "ChapterViews";
