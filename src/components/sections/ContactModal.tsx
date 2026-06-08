"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactModalProps {
  isOpen: boolean;
  context?: string;
  onClose: () => void;
}

type RoomType = "Club Room" | "Quad Room" | "Suite Room" | "Super Deluxe Room" | "";

interface BookingFormState {
  fullName: string;
  phone: string;
  email: string;
  guests: string;
  checkIn: string;
  checkOut: string;
  roomType: RoomType;
  specialRequirements: string;
}

const contextToRoomType: Record<string, RoomType> = {
  club: "Club Room",
  quad: "Quad Room",
  suite: "Suite Room",
  superdeluxe: "Super Deluxe Room",
};

const GUEST_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8+"] as const;
const ROOM_OPTIONS: RoomType[] = ["Club Room", "Quad Room", "Suite Room", "Super Deluxe Room"];

// ─── Design constants ─────────────────────────────────────────────────────────

const GOLD = "#d4af37";
const GOLD_ALPHA = (a: number) => `rgba(212,175,55,${a})`;
const WHITE_ALPHA = (a: number) => `rgba(255,255,255,${a})`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function GoldRule({ width = 48 }: { width?: number }) {
  return (
    <div
      style={{
        width,
        height: "1px",
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_ALPHA(0.25)})`,
        marginBottom: "18px",
      }}
    />
  );
}

function SubTag({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Geist Sans', sans-serif",
      fontSize: "9px",
      letterSpacing: "0.35em",
      textTransform: "uppercase",
      color: GOLD_ALPHA(0.7),
      margin: "0 0 8px 0",
    }}>
      {children}
    </p>
  );
}

// ─── ContactModal ─────────────────────────────────────────────────────────────

export function ContactModal({ isOpen, context = "", onClose }: ContactModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const derivedRoomType: RoomType = contextToRoomType[context] ?? "";

  const [form, setForm] = useState<BookingFormState>({
    fullName: "",
    phone: "",
    email: "",
    guests: "2",
    checkIn: "",
    checkOut: "",
    roomType: derivedRoomType,
    specialRequirements: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (isOpen) {
      setForm((prev) => ({ ...prev, roomType: contextToRoomType[context] ?? prev.roomType }));
      setStatus("idle");
    }
  }, [isOpen, context]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = overlay.querySelectorAll<HTMLElement>(focusableSelector);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    firstFocusable?.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) { e.preventDefault(); lastFocusable?.focus(); }
      } else {
        if (document.activeElement === lastFocusable) { e.preventDefault(); firstFocusable?.focus(); }
      }
    };
    overlay.addEventListener("keydown", handleTab);
    return () => overlay.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    }, []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.checkIn || !form.checkOut) {
          setStatus("error");
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) { setStatus("error"); return; }
        if (form.checkIn && form.checkOut && form.checkIn >= form.checkOut) { setStatus("error"); return; }
        setStatus("submitting");
        setTimeout(() => {
          console.log("[BookingModal] Reservation payload:", {
            fullName: form.fullName.trim(), phone: form.phone.trim(), email: form.email.trim(),
            guests: form.guests, checkIn: form.checkIn, checkOut: form.checkOut,
            roomType: form.roomType, specialRequirements: form.specialRequirements.trim(),
          });
          setStatus("success");
        }, 1600);
      } catch (err) {
        console.warn("[BookingModal] Submission error:", err);
        setStatus("error");
      }
    }, [form]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    }, [onClose]
  );

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.05)",
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
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Booking and Contact Modal"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 100,
        padding: "clamp(16px, 4vw, 40px)",
        animation: "modalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {/* Decorative corner brackets on the overlay */}
      {(["tl","tr","bl","br"] as const).map((pos) => (
        <div
          key={pos}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "28px",
            height: "28px",
            ...(pos === "tl" ? { top: 24, left: 24, borderTop: `1px solid ${GOLD_ALPHA(0.3)}`, borderLeft: `1px solid ${GOLD_ALPHA(0.3)}` } : {}),
            ...(pos === "tr" ? { top: 24, right: 24, borderTop: `1px solid ${GOLD_ALPHA(0.3)}`, borderRight: `1px solid ${GOLD_ALPHA(0.3)}` } : {}),
            ...(pos === "bl" ? { bottom: 24, left: 24, borderBottom: `1px solid ${GOLD_ALPHA(0.3)}`, borderLeft: `1px solid ${GOLD_ALPHA(0.3)}` } : {}),
            ...(pos === "br" ? { bottom: 24, right: 24, borderBottom: `1px solid ${GOLD_ALPHA(0.3)}`, borderRight: `1px solid ${GOLD_ALPHA(0.3)}` } : {}),
          }}
        />
      ))}

      <div
        style={{
          width: "100%",
          maxWidth: "920px",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)",
          background: "rgba(6,4,2,0.97)",
          borderTop: `1px solid ${GOLD_ALPHA(0.4)}`,
          borderBottom: `1px solid ${GOLD_ALPHA(0.12)}`,
          boxShadow: `0 48px 120px rgba(0,0,0,0.9), 0 0 0 1px ${GOLD_ALPHA(0.06)}`,
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking modal"
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            width: "32px",
            height: "32px",
            background: "transparent",
            border: `1px solid ${GOLD_ALPHA(0.25)}`,
            color: WHITE_ALPHA(0.6),
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            transition: "border-color 0.2s, color 0.2s",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Left info panel */}
        <div
          style={{
            padding: "clamp(28px, 3.5vw, 50px)",
            borderRight: `1px solid ${GOLD_ALPHA(0.1)}`,
          }}
        >
          <SubTag>FIND US</SubTag>
          <GoldRule width={40} />
          <h2
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 6px 0",
              lineHeight: 1.18,
            }}
          >
            We Are Where You Need Us to Be
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
              color: GOLD_ALPHA(0.65),
              margin: "0 0 24px 0",
              lineHeight: 1.5,
            }}
          >
            150 Ft. Ring Road, Nr. Sokhda Chowkdi, Rajkot - 06
          </p>

          {[
            { label: "Address", value: "150 Ft. Ring Road, Nr. Sokhda Chowkdi, Survey No. 88/4, Plot No. 1, Rajkot - 360006, Gujarat, India" },
            { label: "Direct Lines", value: "+91 82382 82341  /  +91 82382 82361" },
            { label: "General Enquiries", value: "Hoteltheblackstone@gmail.com" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: "18px" }}>
              <p style={{ fontFamily: "'Geist Sans', sans-serif", fontSize: "8px", letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD_ALPHA(0.5), margin: "0 0 4px 0" }}>
                {item.label}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontSize: "clamp(0.88rem, 1vw, 0.98rem)", color: WHITE_ALPHA(0.78), margin: 0, lineHeight: 1.55 }}>
                {item.value}
              </p>
            </div>
          ))}

          {/* Map embed */}
          <div style={{ marginTop: "20px", marginBottom: "20px", height: "160px", border: `1px solid ${GOLD_ALPHA(0.12)}`, overflow: "hidden" }}>
            <iframe
              title="The Blackstone Hotel location"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(0.92) hue-rotate(180deg) saturate(0.8)" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.3!2d70.7864!3d22.3121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cbb1aa6a3a3d%3A0x3bb2c3c3f3c3c3c3!2sThe%20Blackstone%20Hotel!5e0!3m2!1sen!2sin!4v1717750000000!5m2!1sen!2sin"
            />
          </div>

          {/* Driving directions */}
          <div>
            <p style={{ fontFamily: "'Geist Sans', sans-serif", fontSize: "8px", letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD_ALPHA(0.5), margin: "0 0 10px 0" }}>
              Driving Directions
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {[
                { label: "From Airport", href: "https://maps.google.com/maps/dir/Rajkot+Airport/The+Blackstone+Hotel+Rajkot" },
                { label: "From Railway Station", href: "https://maps.google.com/maps/dir/Rajkot+Junction/The+Blackstone+Hotel+Rajkot" },
                { label: "From Bus Stand", href: "https://maps.google.com/maps/dir/Rajkot+ST+Bus+Stand/The+Blackstone+Hotel+Rajkot" },
              ].map((dir) => (
                <a
                  key={dir.label}
                  href={dir.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    fontFamily: "'Geist Sans', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: GOLD_ALPHA(0.75),
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: "8px" }}>→</span>
                  {dir.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right booking form */}
        <div style={{ padding: "clamp(28px, 3.5vw, 50px)" }}>
          <SubTag>RESERVE YOUR SANCTUARY</SubTag>
          <GoldRule width={40} />
          <h3
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(1.3rem, 2.2vw, 1.85rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 22px 0",
            }}
          >
            Booking Form
          </h3>

          {status === "success" ? (
            <div style={{ padding: "36px 20px", textAlign: "center", border: `1px solid ${GOLD_ALPHA(0.22)}` }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: GOLD, margin: "0 0 10px 0" }}>
                Booking Received
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: WHITE_ALPHA(0.6), lineHeight: 1.7, margin: "0 0 20px 0" }}>
                Thank you, {form.fullName.split(" ")[0]}. Our concierge team will confirm your reservation shortly.
              </p>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: "11px 28px", background: "transparent", border: `1px solid ${GOLD_ALPHA(0.5)}`, color: GOLD, fontFamily: "'Geist Sans', sans-serif", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label htmlFor="bk-fullName" style={labelStyle}>Full Name *</label>
                <input id="bk-fullName" name="fullName" type="text" required autoComplete="name" value={form.fullName} onChange={handleChange} style={inputStyle} placeholder="Your full name" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label htmlFor="bk-phone" style={labelStyle}>Phone *</label>
                  <input id="bk-phone" name="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+91 00000 00000" />
                </div>
                <div>
                  <label htmlFor="bk-email" style={labelStyle}>Email *</label>
                  <input id="bk-email" name="email" type="email" required autoComplete="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label htmlFor="bk-guests" style={labelStyle}>Number of Guests</label>
                <select id="bk-guests" name="guests" value={form.guests} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  {GUEST_OPTIONS.map((g) => (
                    <option key={g} value={g} style={{ background: "#111" }}>
                      {g} {g === "8+" ? "Guests or more" : g === "1" ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label htmlFor="bk-checkIn" style={labelStyle}>Check-in Date *</label>
                  <input id="bk-checkIn" name="checkIn" type="date" required value={form.checkIn} onChange={handleChange} style={{ ...inputStyle, colorScheme: "dark" }} />
                </div>
                <div>
                  <label htmlFor="bk-checkOut" style={labelStyle}>Check-out Date *</label>
                  <input id="bk-checkOut" name="checkOut" type="date" required value={form.checkOut} onChange={handleChange} style={{ ...inputStyle, colorScheme: "dark" }} />
                </div>
              </div>

              <div>
                <label htmlFor="bk-roomType" style={labelStyle}>Room Type</label>
                <select id="bk-roomType" name="roomType" value={form.roomType} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" style={{ background: "#111" }}>Select room type…</option>
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r} value={r} style={{ background: "#111" }}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="bk-special" style={labelStyle}>Special Requirements</label>
                <textarea id="bk-special" name="specialRequirements" rows={3} value={form.specialRequirements} onChange={handleChange} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }} placeholder="dietary preferences, airport pickup, bedding layout…" />
              </div>

              {status === "error" && (
                <p style={{ fontFamily: "'Geist Sans', sans-serif", fontSize: "10px", color: "rgba(255,100,100,0.85)", margin: 0 }}>
                  Please fill in all required fields with valid information.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                style={{
                  width: "100%",
                  padding: "13px 28px",
                  background: status === "submitting" ? GOLD_ALPHA(0.3) : GOLD_ALPHA(0.1),
                  border: `1px solid ${GOLD_ALPHA(0.55)}`,
                  color: GOLD,
                  fontFamily: "'Geist Sans', sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  cursor: status === "submitting" ? "not-allowed" : "pointer",
                  transition: "background 0.22s ease",
                  marginTop: "2px",
                }}
              >
                {status === "submitting" ? "Sending…" : "Send My Booking →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
