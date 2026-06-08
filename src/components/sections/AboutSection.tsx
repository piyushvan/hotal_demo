"use client";

import React from "react";

const GOLD = "#d4af37";
const GOLD_ALPHA = (a: number) => `rgba(212,175,55,${a})`;
const WHITE_ALPHA = (a: number) => `rgba(255,255,255,${a})`;

const PILLARS = [
  {
    icon: "⬡",
    title: "Heritage of Excellence",
    body: "Since opening our doors in 2015, The Blackstone Hotel has been Rajkot's benchmark for refined luxury. Every decision — from the hand-laid mosaic tiles to the bespoke cognac leather — reflects a decade of uncompromising attention to detail.",
  },
  {
    icon: "⬡",
    title: "Gujarati Soul, Global Standard",
    body: "We believe luxury is local. Our design draws from Saurashtra's royal lineage — the geometric beauty of bandhani, the warmth of marigold motifs — and elevates it through a contemporary global lens. The result is unmistakably Rajkot, and unmistakably world-class.",
  },
  {
    icon: "⬡",
    title: "Curated for You",
    body: "Every guest is unique. Our concierge team crafts personalised experiences — from tailor-made business itineraries to family celebration packages — ensuring that no two stays at The Blackstone are ever the same.",
  },
  {
    icon: "⬡",
    title: "Community & Commitment",
    body: "We are deeply rooted in the Rajkot community. Through local sourcing, artisan partnerships, and sustainable practices, The Blackstone is committed to uplifting the city that inspires everything we do.",
  },
];

const STATS = [
  { value: "10+",   label: "Years of Luxury"         },
  { value: "200+",  label: "Events Hosted"            },
  { value: "5,000+",label: "Guests Delighted"         },
  { value: "24/7",  label: "Concierge Service"        },
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{
        background: "#050505",
        borderTop: `1px solid ${GOLD_ALPHA(0.1)}`,
        overflow: "hidden",
      }}
    >
      {/* ── Hero Banner ── */}
      <div
        style={{
          position: "relative",
          padding: "clamp(80px, 14vh, 160px) clamp(24px, 6vw, 80px)",
          background:
            "linear-gradient(135deg, rgba(212,175,55,0.04) 0%, transparent 50%, rgba(212,175,55,0.02) 100%)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Background decorative element */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            border: `1px solid ${GOLD_ALPHA(0.04)}`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "400px",
            border: `1px solid ${GOLD_ALPHA(0.06)}`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <p
          style={{
            fontFamily: "'Geist Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: GOLD_ALPHA(0.7),
            margin: "0 0 20px 0",
          }}
        >
          OUR STORY
        </p>
        <div
          style={{
            width: "1px",
            height: "48px",
            background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`,
            margin: "0 auto 24px",
          }}
        />
        <h2
          id="about-heading"
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: "clamp(2.2rem, 5.5vw, 5rem)",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 24px 0",
            lineHeight: 1.08,
            letterSpacing: "0.04em",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Not Just a Hotel.
          <br />
          <span style={{ color: GOLD }}>A Living Legacy.</span>
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
            color: WHITE_ALPHA(0.6),
            maxWidth: "620px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}
        >
          The Blackstone was born from a singular conviction: that Rajkot
          deserved a hotel that matched the ambition and warmth of its people.
          A place where business meets beauty, where every arrival feels like
          a homecoming.
        </p>
      </div>

      {/* ── Stats Bar ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: `1px solid ${GOLD_ALPHA(0.1)}`,
          borderBottom: `1px solid ${GOLD_ALPHA(0.1)}`,
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              padding: "clamp(28px, 4vh, 48px) clamp(16px, 3vw, 32px)",
              textAlign: "center",
              borderRight:
                i < STATS.length - 1 ? `1px solid ${GOLD_ALPHA(0.08)}` : "none",
              background: i % 2 === 0 ? "rgba(212,175,55,0.02)" : "transparent",
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: GOLD,
                margin: "0 0 6px 0",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontFamily: "'Geist Sans', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: WHITE_ALPHA(0.4),
                margin: 0,
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Our Pillars ── */}
      <div
        style={{
          padding: "clamp(60px, 10vh, 100px) clamp(24px, 6vw, 80px)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vh, 64px)" }}>
          <p
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: GOLD_ALPHA(0.65),
              margin: "0 0 14px 0",
            }}
          >
            WHAT DEFINES US
          </p>
          <h3
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(1.6rem, 3.2vw, 2.8rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            The Blackstone Philosophy
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(20px, 3vw, 40px)",
          }}
        >
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              style={{
                padding: "clamp(24px, 3.5vw, 40px)",
                background: "rgba(255,255,255,0.02)",
                borderTop: `1px solid ${GOLD_ALPHA(0.18)}`,
                borderBottom: `1px solid ${GOLD_ALPHA(0.06)}`,
                transition: "background 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(212,175,55,0.04)";
                (e.currentTarget as HTMLDivElement).style.borderTopColor = GOLD_ALPHA(0.4);
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLDivElement).style.borderTopColor = GOLD_ALPHA(0.18);
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  fontSize: "22px",
                  color: GOLD_ALPHA(0.6),
                  marginBottom: "16px",
                  lineHeight: 1,
                }}
              >
                ◆
              </span>
              <h4
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: "0 0 14px 0",
                  lineHeight: 1.25,
                }}
              >
                {pillar.title}
              </h4>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
                  color: WHITE_ALPHA(0.6),
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Team Quote ── */}
      <div
        style={{
          padding: "clamp(48px, 8vh, 80px) clamp(24px, 6vw, 80px)",
          background: "rgba(212,175,55,0.03)",
          borderTop: `1px solid ${GOLD_ALPHA(0.08)}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              fontSize: "48px",
              color: GOLD_ALPHA(0.2),
              lineHeight: 1,
              marginBottom: "20px",
              fontFamily: "Georgia, serif",
            }}
          >
            "
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
              fontStyle: "italic",
              color: WHITE_ALPHA(0.8),
              lineHeight: 1.7,
              margin: "0 0 24px 0",
            }}
          >
            We do not merely offer rooms. We offer context — a setting in which
            life&apos;s most important moments can unfold with the dignity and
            splendour they deserve.
          </p>
          <p
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: GOLD_ALPHA(0.7),
              margin: 0,
            }}
          >
            — THE BLACKSTONE TEAM, RAJKOT
          </p>
        </div>
      </div>
    </section>
  );
}
