"use client";

import React, { useMemo, useState, useCallback } from "react";

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

// ─── Shared Design Tokens ─────────────────────────────────────────────────────

const GOLD = "#d4af37";
const GOLD_ALPHA = (a: number) => `rgba(212,175,55,${a})`;
const WHITE_ALPHA = (a: number) => `rgba(255,255,255,${a})`;

// ─── Reusable Transparent Components ─────────────────────────────────────────

function GoldRule({ width = 52 }: { width?: number }) {
  return (
    <div
      style={{
        width,
        height: "1px",
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_ALPHA(0.2)})`,
        marginBottom: "20px",
      }}
    />
  );
}

function SubTag({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Geist Sans', sans-serif",
        fontSize: "10px",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: GOLD_ALPHA(0.75),
        margin: "0 0 10px 0",
        fontWeight: 400,
      }}
    >
      {children}
    </p>
  );
}

function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'Playfair Display', 'Georgia', serif",
        fontSize: "clamp(2rem, 4.5vw, 4.2rem)",
        fontWeight: 700,
        color: "#ffffff",
        margin: "0 0 20px 0",
        lineHeight: 1.1,
        textShadow:
          "0 0 60px rgba(0,0,0,0.95), 0 4px 40px rgba(0,0,0,0.9), 0 0 100px rgba(212,175,55,0.1)",
        maxWidth: "620px",
      }}
    >
      {children}
    </h2>
  );
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
        lineHeight: 1.85,
        color: WHITE_ALPHA(0.82),
        margin: "0 0 28px 0",
        maxWidth: "480px",
        fontWeight: 400,
        textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8)",
      }}
    >
      {children}
    </p>
  );
}

function GoldButton({
  children,
  onClick,
  fullWidth = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        pointerEvents: "auto",
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "13px 32px",
        width: fullWidth ? "100%" : undefined,
        justifyContent: fullWidth ? "center" : undefined,
        background: hovered
          ? GOLD
          : "rgba(0,0,0,0.3)",
        border: `1px solid ${GOLD_ALPHA(hovered ? 1 : 0.55)}`,
        color: hovered ? "#000000" : GOLD,
        fontFamily: "'Geist Sans', sans-serif",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "background 0.22s ease, color 0.22s ease, border-color 0.22s ease",
        boxShadow: hovered
          ? `0 4px 20px ${GOLD_ALPHA(0.3)}`
          : "0 4px 24px rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {children}
      <span style={{ opacity: 0.7, fontSize: "10px" }}>→</span>
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
  const justifyMap = {
    left: "flex-start",
    right: "flex-end",
    center: "center",
  } as const;

  const alignMap = {
    center: "center",
    bottom: "flex-end",
    top: "flex-start",
  } as const;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: alignMap[verticalAlign],
        justifyContent: justifyMap[side],
        padding:
          verticalAlign === "bottom"
            ? "80px clamp(24px, 5.5vw, 80px) clamp(60px, 8vh, 100px)"
            : "80px clamp(24px, 5.5vw, 80px) clamp(60px, 8vh, 80px)",
        pointerEvents: "none",
      }}
    >
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
    <div
      style={{
        ...animStyle,
        maxWidth,
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

// ─── Chapter 1 → Reception ────────────────────────────────────────────────────

function ReceptionSection({
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

// ─── Chapter 2 → Dining ───────────────────────────────────────────────────────

function DiningSection({
  progress,
  onBookingRequest,
}: {
  progress: number;
  onBookingRequest?: (ctx: string) => void;
}) {
  const animStyle = useCinematicText(progress, { approachEnd: 0.2, readingEnd: 0.72 });

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

function RoomsSection({
  progress,
  onBookingRequest,
}: {
  progress: number;
  onBookingRequest?: (ctx: string) => void;
}) {
  const animStyle = useCinematicText(progress, {
    approachEnd: 0.18,
    readingEnd: 0.82,
  });
  const [activeTab, setActiveTab] = useState<string>("club");
  const activeRoom = ROOM_DATA.find((r) => r.key === activeTab) ?? ROOM_DATA[0];

  return (
    <SectionShell side="center">
      <div
        style={{
          ...animStyle,
          width: "100%",
          maxWidth: "680px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(16px, 2.5vh, 28px)" }}>
          <SubTag>ARRIVAL · OUR ROOMS &amp; FACILITIES</SubTag>
          <h2
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(2rem, 4.2vw, 3.8rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 6px 0",
              letterSpacing: "0.06em",
              lineHeight: 1.08,
              textShadow:
                "0 0 60px rgba(0,0,0,0.98), 0 4px 40px rgba(0,0,0,0.9), 0 0 100px rgba(212,175,55,0.1)",
            }}
          >
            Sleep Like You Were Born to This
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
              color: GOLD_ALPHA(0.7),
              letterSpacing: "0.18em",
              margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.9)",
            }}
          >
            Luxury Rooms &amp; Suites
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${GOLD_ALPHA(0.3)}, transparent)`,
            marginBottom: "clamp(14px, 2vh, 24px)",
          }}
        />

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Room categories"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2px",
            marginBottom: "clamp(14px, 2.5vh, 28px)",
            pointerEvents: "auto",
          }}
        >
          {ROOM_DATA.map((room) => {
            const isActive = activeTab === room.key;
            return (
              <button
                key={room.key}
                role="tab"
                aria-selected={isActive}
                aria-controls={`room-panel-${room.key}`}
                id={`room-tab-${room.key}`}
                onClick={() => setActiveTab(room.key)}
                style={{
                  padding: "10px 6px",
                  background: isActive
                    ? "rgba(212,175,55,0.15)"
                    : "rgba(0,0,0,0.2)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderBottom: isActive
                    ? `2px solid ${GOLD}`
                    : "2px solid rgba(255,255,255,0.08)",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  color: isActive ? GOLD : WHITE_ALPHA(0.45),
                  fontFamily: "'Geist Sans', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  lineHeight: 1.4,
                  textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                }}
              >
                {room.name}
              </button>
            );
          })}
        </div>

        {/* Room info */}
        <div
          id={`room-panel-${activeRoom.key}`}
          role="tabpanel"
          aria-labelledby={`room-tab-${activeRoom.key}`}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(1.1rem, 1.7vw, 1.4rem)",
              color: GOLD_ALPHA(0.92),
              fontStyle: "italic",
              margin: "0 0 14px 0",
              lineHeight: 1.4,
              textShadow: "0 2px 20px rgba(0,0,0,0.9)",
            }}
          >
            {activeRoom.tagline}
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
              color: WHITE_ALPHA(0.7),
              lineHeight: 1.8,
              margin: "0 0 24px 0",
              textShadow: "0 2px 15px rgba(0,0,0,0.9)",
            }}
          >
            {activeRoom.description}
          </p>
          <GoldButton
            onClick={() => onBookingRequest?.(activeRoom.key)}
            fullWidth
          >
            BOOK YOUR ROOM
          </GoldButton>
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

type ServiceOption =
  | "Club Room Booking"
  | "Quad Room Booking"
  | "Suite Room Booking"
  | "Super Deluxe Booking"
  | "Banquet Hall Enquiry"
  | "General Enquiry";

const SERVICE_OPTIONS: ServiceOption[] = [
  "Club Room Booking",
  "Quad Room Booking",
  "Suite Room Booking",
  "Super Deluxe Booking",
  "Banquet Hall Enquiry",
  "General Enquiry",
];

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  service: ServiceOption | "";
  message: string;
}

function ContactSection({ progress }: { progress: number }) {
  const animStyle = useCinematicText(progress, {
    approachEnd: 0.18,
    readingEnd: 0.9,
  });

  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
          setStatus("error");
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
          setStatus("error");
          return;
        }
        setStatus("submitting");
        setTimeout(() => {
          setStatus("success");
        }, 1400);
      } catch (err) {
        console.warn("[ContactSection] Submission error:", err);
        setStatus("error");
      }
    },
    [form]
  );

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(8px)",
    border: `1px solid ${GOLD_ALPHA(0.2)}`,
    color: "#ffffff",
    fontFamily: "'Geist Sans', sans-serif",
    fontSize: "12px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Geist Sans', sans-serif",
    fontSize: "9px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: GOLD_ALPHA(0.65),
    marginBottom: "5px",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px clamp(20px, 5vw, 60px) clamp(60px, 8vh, 80px)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          ...animStyle,
          width: "100%",
          maxWidth: "860px",
          display: "grid",
          gridTemplateColumns: "1fr 1.15fr",
          borderTop: `1px solid ${GOLD_ALPHA(0.2)}`,
          borderBottom: `1px solid ${GOLD_ALPHA(0.06)}`,
        }}
      >
        {/* Left info */}
        <div
          style={{
            padding: "clamp(24px, 3.5vw, 44px)",
            borderRight: `1px solid ${GOLD_ALPHA(0.1)}`,
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <SubTag>Contact Information</SubTag>
          <GoldRule width={40} />
          <h2
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 14px 0",
              lineHeight: 1.2,
              textShadow: "0 2px 30px rgba(0,0,0,0.9)",
            }}
          >
            Contact Us
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(0.88rem, 1.1vw, 1rem)",
              color: WHITE_ALPHA(0.65),
              lineHeight: 1.72,
              margin: "0 0 24px 0",
              textShadow: "0 2px 15px rgba(0,0,0,0.9)",
            }}
          >
            Have questions or need help with your booking? Our team is always
            ready to assist — feel free to contact us anytime.
          </p>

          {[
            { icon: "📞", label: "Phone", value: "+91 82382 82341 / +91 82382 82361" },
            { icon: "✉️", label: "Email", value: "Hoteltheblackstone@gmail.com" },
            { icon: "🕐", label: "Hours", value: "24/7 Front Desk / Guest Relations" },
            { icon: "📍", label: "Address", value: "150 Ft. Ring Road, Nr. Sokhda Chowkdi, Rajkot - 360006, Gujarat" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "12px", opacity: 0.6, marginTop: "2px", flexShrink: 0 }}>
                {item.icon}
              </span>
              <div>
                <p style={{ fontFamily: "'Geist Sans', sans-serif", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD_ALPHA(0.5), margin: "0 0 2px 0" }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontSize: "clamp(0.82rem, 0.95vw, 0.92rem)", color: WHITE_ALPHA(0.78), margin: 0, lineHeight: 1.5, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right form */}
        <div
          style={{
            padding: "clamp(24px, 3.5vw, 44px)",
            pointerEvents: "auto",
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <SubTag>* Get In Touch</SubTag>
          <GoldRule width={40} />
          <h3
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(1.2rem, 2vw, 1.55rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 6px 0",
              textShadow: "0 2px 20px rgba(0,0,0,0.9)",
            }}
          >
            Get In Touch
          </h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(0.82rem, 1vw, 0.92rem)", color: WHITE_ALPHA(0.5), margin: "0 0 20px 0", lineHeight: 1.6 }}>
            We&apos;d love to hear about your travel plans.
          </p>

          {status === "success" ? (
            <div style={{ padding: "28px", textAlign: "center", border: `1px solid ${GOLD_ALPHA(0.25)}` }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: GOLD, margin: "0 0 6px 0" }}>
                Message Sent
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", color: WHITE_ALPHA(0.6), fontSize: "0.95rem", margin: 0 }}>
                Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label htmlFor="cs-name" style={labelStyle}>Name *</label>
                <input id="cs-name" name="name" type="text" required autoComplete="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Your full name" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label htmlFor="cs-email" style={labelStyle}>Email *</label>
                  <input id="cs-email" name="email" type="email" required autoComplete="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="cs-phone" style={labelStyle}>Phone *</label>
                  <input id="cs-phone" name="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+91 00000 00000" />
                </div>
              </div>
              <div>
                <label htmlFor="cs-service" style={labelStyle}>Service Interested In</label>
                <select id="cs-service" name="service" value={form.service} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select a service…</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} style={{ background: "#111" }}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cs-message" style={labelStyle}>Message *</label>
                <textarea id="cs-message" name="message" required rows={3} value={form.message} onChange={handleChange} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }} placeholder="Tell us about your plans…" />
              </div>
              {status === "error" && (
                <p style={{ fontFamily: "'Geist Sans', sans-serif", fontSize: "10px", color: "rgba(255,100,100,0.85)", margin: 0 }}>
                  Please fill in all required fields with valid information.
                </p>
              )}
              <GoldButton fullWidth>
                {status === "submitting" ? "Sending…" : "Send Message"}
              </GoldButton>
            </form>
          )}
        </div>
      </div>
    </div>
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
