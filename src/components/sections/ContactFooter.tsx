"use client";

import React, { useCallback, useState } from "react";
import { CHAPTERS } from "@/lib/chapters";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactFooterProps {
  onNavigate?: (chapterId: string, frameStart: number) => void;
}

const QUICK_LINKS = [
  { label: "Home",          section: "hero"      },
  { label: "About Us",      section: "reception" },
  { label: "Rooms & Suites",section: "rooms"     },
  { label: "Restaurant",    section: "dining"    },
  { label: "Banquet Hall",  section: "banquet"   },
  { label: "Game Zone",     section: "elevator"  },
  { label: "Contact Us",    section: "contact"   },
] as const;

// ─── Reusable sub-components ──────────────────────────────────────────────────

function GoldRule() {
  return (
    <div
      style={{
        width: "100%",
        height: "1px",
        background:
          "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
        margin: "40px 0",
      }}
    />
  );
}

// ─── ContactFooter ────────────────────────────────────────────────────────────

export function ContactFooter({ onNavigate }: ContactFooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubscribe = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          setEmailError(true);
          return;
        }
        setEmailError(false);
        console.log("[Footer] Newsletter subscription:", email.trim());
        setSubscribed(true);
        setEmail("");
      } catch (err) {
        console.warn("[Footer] Newsletter subscription error:", err);
      }
    },
    [email]
  );

  return (
    <footer
      style={{
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(212,175,55,0.2)",
        padding: "60px clamp(24px, 6vw, 80px) 32px",
        pointerEvents: "auto",
      }}
    >
      {/* ── Top grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1.4fr",
          gap: "clamp(32px, 4vw, 64px)",
          marginBottom: "0",
        }}
      >
        {/* ── Brand column ── */}
        <div>
          <p
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.7)",
              margin: "0 0 8px 0",
            }}
          >
            GET IN TOUCH
          </p>
          <div
            style={{
              width: "48px",
              height: "1px",
              background: "linear-gradient(90deg, #d4af37, rgba(212,175,55,0.3))",
              marginBottom: "20px",
            }}
          />
          <h2
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.12em",
              margin: "0 0 16px 0",
              lineHeight: 1.15,
            }}
          >
            THE BLACKSTONE
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.75,
              margin: "0 0 28px 0",
              maxWidth: "380px",
            }}
          >
            Since 2015, The Blackstone Hotel has been Rajkot's definitive
            statement in business and luxury hospitality.
          </p>

          {/* Contact details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "+91 82382 82341  |  +91 82382 82361",
              "150 Ft. Ring Road, Nr. Sokhda Chowkdi, Rajkot",
              "Hoteltheblackstone@gmail.com",
              "24/7 Front Desk / Guest Relations",
            ].map((detail) => (
              <p
                key={detail}
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                  color: "rgba(255,255,255,0.6)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {detail}
              </p>
            ))}
          </div>
        </div>

        {/* ── Quick links ── */}
        <div>
          <p
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.7)",
              margin: "0 0 20px 0",
            }}
          >
            Quick Links
          </p>
          <nav aria-label="Footer navigation">
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => {
                      const chapter = CHAPTERS.find((c) => c.id === link.section);
                      if (chapter) onNavigate?.(chapter.id, chapter.frameStart);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                      fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                      color: "rgba(255,255,255,0.55)",
                      textAlign: "left",
                      transition: "color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.55)";
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        color: "rgba(212,175,55,0.5)",
                      }}
                    >
                      →
                    </span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Newsletter ── */}
        <div>
          <p
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.7)",
              margin: "0 0 8px 0",
            }}
          >
            Newsletter
          </p>
          <div
            style={{
              width: "48px",
              height: "1px",
              background: "linear-gradient(90deg, #d4af37, rgba(212,175,55,0.3))",
              marginBottom: "20px",
            }}
          />
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              margin: "0 0 20px 0",
            }}
          >
            Stay ahead of exclusive offers, seasonal menus, and curated events
            at The Blackstone.
          </p>

          {subscribed ? (
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "1rem",
                color: "#d4af37",
                margin: "0 0 20px 0",
              }}
            >
              ✓ You're on the list. Welcome to The Blackstone circle.
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                id="footer-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                placeholder="Your email address"
                autoComplete="email"
                style={{
                  padding: "11px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: emailError
                    ? "1px solid rgba(255,100,100,0.6)"
                    : "1px solid rgba(212,175,55,0.2)",
                  color: "#ffffff",
                  fontFamily: "'Geist Sans', sans-serif",
                  fontSize: "13px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              {emailError && (
                <p
                  style={{
                    fontFamily: "'Geist Sans', sans-serif",
                    fontSize: "11px",
                    color: "rgba(255,100,100,0.8)",
                    margin: 0,
                  }}
                >
                  Please enter a valid email address.
                </p>
              )}
              <button
                type="submit"
                style={{
                  padding: "11px 24px",
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.5)",
                  color: "#d4af37",
                  fontFamily: "'Geist Sans', sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                  alignSelf: "flex-start",
                }}
              >
                Subscribe →
              </button>
            </form>
          )}

          {/* Avatar pile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "24px",
            }}
          >
            <div style={{ display: "flex", marginRight: "4px" }}>
              {[
                "rgba(212,175,55,0.6)",
                "rgba(200,160,40,0.7)",
                "rgba(190,150,35,0.65)",
                "rgba(180,140,30,0.6)",
              ].map((bg, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: bg,
                    border: "2px solid rgba(0,0,0,0.8)",
                    marginLeft: i === 0 ? 0 : "-8px",
                  }}
                />
              ))}
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.45)",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              Joined by 200+ guests this month
            </p>
          </div>
        </div>
      </div>

      <GoldRule />

      {/* ── Copyright bar ── */}
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
            color: "rgba(255,255,255,0.3)",
            margin: 0,
          }}
        >
          Copyright © 2026 The Blackstone Hotel. All Rights Reserved.
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "0.85rem",
            color: "rgba(212,175,55,0.35)",
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          Rajkot's Finest Since 2015
        </p>
      </div>
    </footer>
  );
}
