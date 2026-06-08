"use client";

import React, { useState, useCallback } from "react";

const GOLD = "#d4af37";
const GOLD_ALPHA = (a: number) => `rgba(212,175,55,${a})`;
const WHITE_ALPHA = (a: number) => `rgba(255,255,255,${a})`;

const QUICK_LINKS = [
  { label: "Home",           href: "#hero"    },
  { label: "About Us",       href: "#about"   },
  { label: "Rooms & Suites", href: "#gallery" },
  { label: "Restaurant",     href: "#gallery" },
  { label: "Banquet Hall",   href: "#gallery" },
  { label: "Gallery",        href: "#gallery" },
  { label: "FAQ",            href: "#faq"     },
] as const;

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

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: ServiceOption | "";
  message: string;
}

function InputField({
  id, label, children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontFamily: "'Geist Sans', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: GOLD_ALPHA(0.65),
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function ContactAndFooter() {
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", service: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [newsEmail, setNewsEmail] = useState("");
  const [newsSubscribed, setNewsSubscribed] = useState(false);

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${GOLD_ALPHA(0.18)}`,
    color: "#ffffff",
    fontFamily: "'Geist Sans', sans-serif",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  };

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
      if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
        setStatus("error");
        return;
      }
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(form.email)) { setStatus("error"); return; }
      setStatus("submitting");
      setTimeout(() => setStatus("success"), 1500);
    },
    [form]
  );

  const handleNewsSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(newsEmail.trim())) return;
      setNewsSubscribed(true);
      setNewsEmail("");
    },
    [newsEmail]
  );

  return (
    <>
      {/* ═══════════════════════════════════════
          CONTACT SECTION
      ═══════════════════════════════════════ */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        style={{
          background: "#060606",
          padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 80px)",
          borderTop: `1px solid ${GOLD_ALPHA(0.12)}`,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(40px, 6vw, 80px)",
              alignItems: "start",
            }}
          >
            {/* Left: Info */}
            <div>
              <p
                style={{
                  fontFamily: "'Geist Sans', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.45em",
                  textTransform: "uppercase",
                  color: GOLD_ALPHA(0.7),
                  margin: "0 0 14px 0",
                }}
              >
                GET IN TOUCH
              </p>
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  background: GOLD,
                  marginBottom: "20px",
                }}
              />
              <h2
                id="contact-heading"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: "clamp(2rem, 3.8vw, 3.5rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: "0 0 18px 0",
                  lineHeight: 1.1,
                }}
              >
                Reach The Blackstone
              </h2>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                  color: WHITE_ALPHA(0.6),
                  lineHeight: 1.8,
                  margin: "0 0 40px 0",
                  maxWidth: "440px",
                }}
              >
                Whether you&apos;re planning a stay, an event, or simply
                curious — we&apos;re here. Our team responds to every enquiry
                with the same care we give each of our guests.
              </p>

              {/* Contact details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {[
                  {
                    icon: "📞",
                    label: "Phone",
                    lines: ["+91 82382 82341", "+91 82382 82361"],
                    href: "tel:+918238282341",
                  },
                  {
                    icon: "✉️",
                    label: "Email",
                    lines: ["Hoteltheblackstone@gmail.com"],
                    href: "mailto:Hoteltheblackstone@gmail.com",
                  },
                  {
                    icon: "📍",
                    label: "Address",
                    lines: [
                      "150 Ft. Ring Road, Nr. Sokhda Chowkdi,",
                      "Rajkot - 360006, Gujarat",
                    ],
                    href: "https://maps.google.com/?q=150+Ft+Ring+Road+Rajkot",
                  },
                  {
                    icon: "🕐",
                    label: "Hours",
                    lines: ["24/7 Front Desk & Guest Relations"],
                    href: null,
                  },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: "16px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        border: `1px solid ${GOLD_ALPHA(0.2)}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "16px",
                        opacity: 0.7,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Geist Sans', sans-serif",
                          fontSize: "8px",
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: GOLD_ALPHA(0.55),
                          margin: "0 0 4px 0",
                        }}
                      >
                        {item.label}
                      </p>
                      {item.lines.map((line, i) =>
                        item.href && i === 0 ? (
                          <a
                            key={i}
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            style={{
                              display: "block",
                              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                              fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                              color: WHITE_ALPHA(0.75),
                              textDecoration: "none",
                              lineHeight: 1.5,
                              transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = GOLD;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = WHITE_ALPHA(0.75);
                            }}
                          >
                            {line}
                          </a>
                        ) : (
                          <p
                            key={i}
                            style={{
                              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                              fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                              color: WHITE_ALPHA(0.65),
                              margin: 0,
                              lineHeight: 1.5,
                            }}
                          >
                            {line}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div>
              {status === "success" ? (
                <div
                  style={{
                    padding: "48px",
                    textAlign: "center",
                    border: `1px solid ${GOLD_ALPHA(0.25)}`,
                    background: "rgba(212,175,55,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      border: `1px solid ${GOLD_ALPHA(0.5)}`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <span style={{ color: GOLD, fontSize: "22px" }}>✓</span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.5rem",
                      color: "#ffffff",
                      margin: "0 0 10px 0",
                    }}
                  >
                    Message Received
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: WHITE_ALPHA(0.6),
                      fontSize: "1rem",
                      margin: "0 0 24px 0",
                      lineHeight: 1.7,
                    }}
                  >
                    Thank you for reaching out. Our concierge team will respond
                    within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }}
                    style={{
                      padding: "10px 24px",
                      background: "transparent",
                      border: `1px solid ${GOLD_ALPHA(0.4)}`,
                      color: GOLD,
                      fontFamily: "'Geist Sans', sans-serif",
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <InputField id="cf-name" label="Full Name *">
                    <input
                      id="cf-name" name="name" type="text" required
                      autoComplete="name" value={form.name} onChange={handleChange}
                      placeholder="Your full name" style={inputBase}
                    />
                  </InputField>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <InputField id="cf-email" label="Email *">
                      <input
                        id="cf-email" name="email" type="email" required
                        autoComplete="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com" style={inputBase}
                      />
                    </InputField>
                    <InputField id="cf-phone" label="Phone *">
                      <input
                        id="cf-phone" name="phone" type="tel" required
                        autoComplete="tel" value={form.phone} onChange={handleChange}
                        placeholder="+91 00000 00000" style={inputBase}
                      />
                    </InputField>
                  </div>

                  <InputField id="cf-service" label="Service">
                    <select
                      id="cf-service" name="service" value={form.service}
                      onChange={handleChange}
                      style={{ ...inputBase, cursor: "pointer" }}
                    >
                      <option value="">Select a service…</option>
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} style={{ background: "#111" }}>{opt}</option>
                      ))}
                    </select>
                  </InputField>

                  <InputField id="cf-message" label="Message *">
                    <textarea
                      id="cf-message" name="message" required rows={4}
                      value={form.message} onChange={handleChange}
                      placeholder="Tell us about your plans…"
                      style={{ ...inputBase, resize: "vertical", lineHeight: "1.6" }}
                    />
                  </InputField>

                  {status === "error" && (
                    <p style={{ fontFamily: "'Geist Sans', sans-serif", fontSize: "11px", color: "rgba(255,100,100,0.85)", margin: 0 }}>
                      Please fill in all required fields correctly.
                    </p>
                  )}

                  <button
                    type="submit"
                    style={{
                      padding: "14px 32px",
                      background: status === "submitting" ? GOLD_ALPHA(0.12) : "transparent",
                      border: `1px solid ${GOLD_ALPHA(0.55)}`,
                      color: GOLD,
                      fontFamily: "'Geist Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      cursor: status === "submitting" ? "wait" : "pointer",
                      transition: "all 0.22s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (status !== "submitting") {
                        (e.currentTarget as HTMLButtonElement).style.background = GOLD;
                        (e.currentTarget as HTMLButtonElement).style.color = "#000";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (status !== "submitting") {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = GOLD;
                      }
                    }}
                  >
                    {status === "submitting" ? "Sending…" : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer
        style={{
          background: "#020202",
          borderTop: `1px solid ${GOLD_ALPHA(0.12)}`,
          padding: "clamp(56px, 8vh, 100px) clamp(24px, 6vw, 80px) clamp(28px, 4vh, 48px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Top grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1fr 1.4fr",
              gap: "clamp(32px, 5vw, 72px)",
              marginBottom: "clamp(40px, 6vh, 64px)",
            }}
          >
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: `1px solid ${GOLD_ALPHA(0.35)}`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', 'Georgia', serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: GOLD_ALPHA(0.85),
                    }}
                  >
                    B
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', 'Georgia', serif",
                      fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      margin: "0 0 2px 0",
                      lineHeight: 1,
                    }}
                  >
                    THE BLACKSTONE
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                      fontSize: "9px",
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      color: GOLD_ALPHA(0.6),
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    HOTEL · RAJKOT
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                  color: WHITE_ALPHA(0.5),
                  lineHeight: 1.78,
                  margin: "0 0 24px 0",
                  maxWidth: "360px",
                }}
              >
                Since 2015, The Blackstone Hotel has been Rajkot&apos;s
                definitive statement in business and luxury hospitality.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Facebook", "Instagram", "Twitter"].map((social) => (
                  <button
                    key={social}
                    type="button"
                    aria-label={social}
                    style={{
                      width: "32px",
                      height: "32px",
                      border: `1px solid ${GOLD_ALPHA(0.2)}`,
                      background: "transparent",
                      color: WHITE_ALPHA(0.4),
                      fontSize: "11px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      fontFamily: "'Geist Sans', sans-serif",
                      letterSpacing: "0",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD_ALPHA(0.6);
                      (e.currentTarget as HTMLButtonElement).style.color = GOLD;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD_ALPHA(0.2);
                      (e.currentTarget as HTMLButtonElement).style.color = WHITE_ALPHA(0.4);
                    }}
                  >
                    {social === "Facebook" ? "f" : social === "Instagram" ? "ig" : "tw"}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p
                style={{
                  fontFamily: "'Geist Sans', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: GOLD_ALPHA(0.7),
                  margin: "0 0 20px 0",
                }}
              >
                Navigation
              </p>
              <nav aria-label="Footer navigation">
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {QUICK_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                          fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                          color: WHITE_ALPHA(0.5),
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = GOLD;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = WHITE_ALPHA(0.5);
                        }}
                      >
                        <span style={{ fontSize: "9px", color: GOLD_ALPHA(0.45) }}>→</span>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Newsletter */}
            <div>
              <p
                style={{
                  fontFamily: "'Geist Sans', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: GOLD_ALPHA(0.7),
                  margin: "0 0 8px 0",
                }}
              >
                Newsletter
              </p>
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  background: `linear-gradient(90deg, ${GOLD}, transparent)`,
                  marginBottom: "18px",
                }}
              />
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                  color: WHITE_ALPHA(0.5),
                  lineHeight: 1.7,
                  margin: "0 0 18px 0",
                }}
              >
                Stay ahead of exclusive offers, seasonal menus, and curated
                events at The Blackstone.
              </p>
              {newsSubscribed ? (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: GOLD, margin: 0 }}>
                  ✓ Welcome to The Blackstone circle.
                </p>
              ) : (
                <form onSubmit={handleNewsSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input
                    id="footer-newsletter-email"
                    type="email" value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    placeholder="Your email address"
                    autoComplete="email"
                    style={{
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${GOLD_ALPHA(0.18)}`,
                      color: "#ffffff",
                      fontFamily: "'Geist Sans', sans-serif",
                      fontSize: "12px",
                      outline: "none",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      background: "rgba(212,175,55,0.1)",
                      border: `1px solid ${GOLD_ALPHA(0.4)}`,
                      color: GOLD,
                      fontFamily: "'Geist Sans', sans-serif",
                      fontSize: "9px",
                      fontWeight: 600,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      alignSelf: "flex-start",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = GOLD;
                      (e.currentTarget as HTMLButtonElement).style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,175,55,0.1)";
                      (e.currentTarget as HTMLButtonElement).style.color = GOLD;
                    }}
                  >
                    Subscribe →
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${GOLD_ALPHA(0.25)}, transparent)`,
              marginBottom: "clamp(24px, 3.5vh, 40px)",
            }}
          />

          {/* Copyright */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p
              style={{
                fontFamily: "'Geist Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: WHITE_ALPHA(0.25),
                margin: 0,
              }}
            >
              Copyright © 2026 The Blackstone Hotel, Rajkot. All Rights Reserved.
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "0.85rem",
                color: GOLD_ALPHA(0.3),
                margin: 0,
                letterSpacing: "0.06em",
              }}
            >
              Rajkot&apos;s Finest Since 2015
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
