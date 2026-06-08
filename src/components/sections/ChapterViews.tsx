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
      <div style={{ ...animStyle, width: "100%", maxWidth: "680px" }}>
        {/* Header */}
        <div className="text-center mb-[clamp(16px,2.5vh,28px)]">
          <SubTag>ARRIVAL · OUR ROOMS &amp; FACILITIES</SubTag>
          <h2 className="font-playfair text-[clamp(2rem,4.2vw,3.8rem)] font-bold text-white mb-[6px] tracking-[0.06em] leading-[1.08] [text-shadow:0_0_60px_rgba(0,0,0,0.98),0_4px_40px_rgba(0,0,0,0.9),0_0_100px_rgba(212,175,55,0.1)]">
            Sleep Like You Were Born to This
          </h2>
          <p className="font-cormorant text-[clamp(0.85rem,1.2vw,1rem)] text-brand-gold/70 tracking-[0.18em] m-0 [text-shadow:0_2px_20px_rgba(0,0,0,0.9)]">
            Luxury Rooms &amp; Suites
          </p>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)] mb-[clamp(14px,2vh,24px)]" />

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Room categories"
          className="grid grid-cols-4 gap-[2px] mb-[clamp(14px,2.5vh,28px)] pointer-events-auto"
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
                className={`py-[10px] px-[6px] backdrop-blur-[12px] border-b-2 border-t-0 border-x-0 font-sans text-[9px] tracking-[0.18em] uppercase cursor-pointer transition-all duration-250 ease-in-out leading-[1.4] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)] ${
                  isActive
                    ? "bg-brand-gold/15 border-brand-gold text-brand-gold"
                    : "bg-black/20 border-white/10 text-white/45 hover:bg-black/30 hover:text-white/70"
                }`}
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
          <p className="font-cormorant text-[clamp(1.1rem,1.7vw,1.4rem)] text-brand-gold/90 italic mb-[14px] leading-[1.4] [text-shadow:0_2px_20px_rgba(0,0,0,0.9)]">
            {activeRoom.tagline}
          </p>
          <p className="font-cormorant text-[clamp(0.95rem,1.2vw,1.1rem)] text-white/70 leading-[1.8] mb-[24px] [text-shadow:0_2px_15px_rgba(0,0,0,0.9)]">
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

  const inputClass = "w-full py-[10px] px-[14px] bg-black/35 backdrop-blur-[8px] border border-brand-gold/20 text-white font-sans text-[12px] outline-none transition-colors duration-200 focus:border-brand-gold/50";
  const labelClass = "block font-sans text-[9px] tracking-[0.22em] uppercase text-brand-gold/65 mb-[5px]";

  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[72px] px-[clamp(20px,5vw,60px)] pb-[clamp(60px,8vh,80px)] pointer-events-none">
      <div
        style={animStyle}
        className="w-full max-w-[860px] grid grid-cols-1 md:grid-cols-[1fr_1.15fr] border-t border-brand-gold/20 border-b border-brand-gold/5"
      >
        {/* Left info */}
        <div className="p-[clamp(24px,3.5vw,44px)] border-r border-brand-gold/10 bg-black/20 backdrop-blur-[16px]">
          <SubTag>Contact Information</SubTag>
          <GoldRule width={40} />
          <h2 className="font-playfair text-[clamp(1.5rem,2.5vw,2.2rem)] font-bold text-white mb-[14px] leading-[1.2] [text-shadow:0_2px_30px_rgba(0,0,0,0.9)]">
            Contact Us
          </h2>
          <p className="font-cormorant text-[clamp(0.88rem,1.1vw,1rem)] text-white/65 leading-[1.72] mb-[24px] [text-shadow:0_2px_15px_rgba(0,0,0,0.9)]">
            Have questions or need help with your booking? Our team is always
            ready to assist — feel free to contact us anytime.
          </p>

          {[
            { icon: "📞", label: "Phone", value: "+91 82382 82341 / +91 82382 82361" },
            { icon: "✉️", label: "Email", value: "Hoteltheblackstone@gmail.com" },
            { icon: "🕐", label: "Hours", value: "24/7 Front Desk / Guest Relations" },
            { icon: "📍", label: "Address", value: "150 Ft. Ring Road, Nr. Sokhda Chowkdi, Rajkot - 360006, Gujarat" },
          ].map((item) => (
            <div key={item.label} className="flex gap-[12px] mb-[14px]">
              <span className="text-[12px] opacity-60 mt-[2px] shrink-0">
                {item.icon}
              </span>
              <div>
                <p className="font-sans text-[8px] tracking-[0.22em] uppercase text-brand-gold/50 mb-[2px]">
                  {item.label}
                </p>
                <p className="font-cormorant text-[clamp(0.82rem,0.95vw,0.92rem)] text-white/80 m-0 leading-[1.5] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right form */}
        <div className="p-[clamp(24px,3.5vw,44px)] pointer-events-auto bg-black/25 backdrop-blur-[20px]">
          <SubTag>* Get In Touch</SubTag>
          <GoldRule width={40} />
          <h3 className="font-playfair text-[clamp(1.2rem,2vw,1.55rem)] font-bold text-white mb-[6px] [text-shadow:0_2px_20px_rgba(0,0,0,0.9)]">
            Get In Touch
          </h3>
          <p className="font-cormorant text-[clamp(0.82rem,1vw,0.92rem)] text-white/50 mb-[20px] leading-[1.6]">
            We&apos;d love to hear about your travel plans.
          </p>

          {status === "success" ? (
            <div className="p-[28px] text-center border border-brand-gold/25 bg-brand-gold/5">
              <p className="font-playfair text-[1.25rem] text-brand-gold mb-[6px]">
                Message Sent
              </p>
              <p className="font-cormorant text-white/60 text-[0.95rem] m-0">
                Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[12px]">
              <div>
                <label htmlFor="cs-name" className={labelClass}>Name *</label>
                <input id="cs-name" name="name" type="text" required autoComplete="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label htmlFor="cs-email" className={labelClass}>Email *</label>
                  <input id="cs-email" name="email" type="email" required autoComplete="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="cs-phone" className={labelClass}>Phone *</label>
                  <input id="cs-phone" name="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+91 00000 00000" />
                </div>
              </div>
              <div>
                <label htmlFor="cs-service" className={labelClass}>Service Interested In</label>
                <select id="cs-service" name="service" value={form.service} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
                  <option value="" className="bg-[#111]">Select a service…</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#111]">{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cs-message" className={labelClass}>Message *</label>
                <textarea id="cs-message" name="message" required rows={3} value={form.message} onChange={handleChange} className={`${inputClass} resize-y leading-[1.6]`} placeholder="Tell us about your plans…" />
              </div>
              {status === "error" && (
                <p className="font-sans text-[10px] text-[#ff6464] m-0">
                  Please fill in all required fields with valid information.
                </p>
              )}
              <div className="mt-[4px]">
                <GoldButton fullWidth type="submit">
                  {status === "submitting" ? "Sending…" : "Send Message"}
                </GoldButton>
              </div>
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
