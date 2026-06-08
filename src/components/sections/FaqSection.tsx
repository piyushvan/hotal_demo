"use client";

import React, { useState } from "react";

const GOLD = "#d4af37";
const GOLD_ALPHA = (a: number) => `rgba(212,175,55,${a})`;
const WHITE_ALPHA = (a: number) => `rgba(255,255,255,${a})`;

const FAQ_DATA = [
  {
    id: "faq-1",
    question: "What are your check-in and check-out times?",
    answer:
      "Standard check-in begins at 12:00 PM (noon) and check-out is at 11:00 AM. Early check-in and late check-out may be arranged subject to availability — please contact our concierge team in advance and we will do our best to accommodate your schedule.",
  },
  {
    id: "faq-2",
    question: "Do you offer airport or railway station transfers?",
    answer:
      "Yes, we offer complimentary transfer services for our suite and super deluxe guests, and at-cost transfers for all other guests. Please inform us of your travel details at least 24 hours in advance to arrange a seamless arrival experience.",
  },
  {
    id: "faq-3",
    question: "Is the restaurant open to non-hotel guests?",
    answer:
      "Absolutely. The Blackstone Restaurant warmly welcomes outside diners for lunch and dinner. Reservations are recommended, especially on weekends and during festive seasons, to ensure your table is ready and waiting.",
  },
  {
    id: "faq-4",
    question: "What is your cancellation policy?",
    answer:
      "We understand that plans change. Cancellations made more than 48 hours prior to check-in receive a full refund. Cancellations within 24–48 hours incur a one-night penalty. Same-day cancellations are non-refundable. For group bookings and special events, separate terms apply.",
  },
  {
    id: "faq-5",
    question: "Can The Blackstone accommodate large wedding or corporate events?",
    answer:
      "Our Banquet Hall can comfortably host up to 200+ guests for weddings, galas, seminars, and corporate conferences. Our in-house event styling team works closely with you from concept to execution — florals, AV setup, catering, and décor are all managed seamlessly under one roof.",
  },
  {
    id: "faq-6",
    question: "Is Wi-Fi available throughout the hotel?",
    answer:
      "High-speed fibre Wi-Fi is complimentary throughout the hotel — in all rooms, the lobby, the restaurant, and the banquet hall. We understand that connectivity is essential, and we have engineered our network to support both leisure and intensive business use.",
  },
  {
    id: "faq-7",
    question: "Do you offer special packages for honeymooners or anniversaries?",
    answer:
      "Yes! We offer bespoke romance packages that may include room decoration with fresh flowers and candles, a complimentary bottle of sparkling wine, late check-out, and a private dining experience. Speak with our concierge to create a personalised experience.",
  },
  {
    id: "faq-8",
    question: "Is there parking available at the hotel?",
    answer:
      "Yes, we offer dedicated on-site parking for all guests at no additional charge. Our parking area is secure, well-lit, and monitored 24/7. Valet parking is also available upon request.",
  },
];

interface FAQItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  index: number;
}

function FAQItem({ id, question, answer, isOpen, onToggle, index }: FAQItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        borderBottom: `1px solid ${GOLD_ALPHA(isOpen ? 0.18 : 0.08)}`,
        transition: "border-color 0.3s ease",
      }}
    >
      <button
        id={`${id}-btn`}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={() => onToggle(id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          background: isOpen
            ? "rgba(212,175,55,0.03)"
            : hovered
            ? "rgba(255,255,255,0.01)"
            : "transparent",
          border: "none",
          padding: "clamp(18px, 2.5vh, 28px) 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flex: 1 }}>
          <span
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: GOLD_ALPHA(0.5),
              flexShrink: 0,
              marginTop: "4px",
              minWidth: "28px",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
              fontWeight: 600,
              color: isOpen ? "#ffffff" : WHITE_ALPHA(0.75),
              lineHeight: 1.3,
              transition: "color 0.2s ease",
            }}
          >
            {question}
          </span>
        </div>
        <div
          aria-hidden="true"
          style={{
            width: "28px",
            height: "28px",
            border: `1px solid ${GOLD_ALPHA(isOpen ? 0.6 : 0.2)}`,
            borderRadius: "50%",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            background: isOpen ? GOLD_ALPHA(0.12) : "transparent",
          }}
        >
          <span
            style={{
              color: isOpen ? GOLD : WHITE_ALPHA(0.4),
              fontSize: "16px",
              lineHeight: 1,
              fontWeight: 300,
            }}
          >
            +
          </span>
        </div>
      </button>

      {/* Answer panel */}
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        style={{
          maxHeight: isOpen ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            paddingBottom: "clamp(18px, 2.5vh, 28px)",
            paddingLeft: "48px",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
              color: WHITE_ALPHA(0.65),
              lineHeight: 1.85,
              margin: 0,
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      style={{
        background: "#080808",
        padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 80px)",
        borderTop: `1px solid ${GOLD_ALPHA(0.1)}`,
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "clamp(40px, 6vh, 64px)" }}>
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
            GUEST ENQUIRIES
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
            id="faq-heading"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 16px 0",
              lineHeight: 1.1,
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              color: WHITE_ALPHA(0.55),
              margin: 0,
              lineHeight: 1.75,
              maxWidth: "560px",
            }}
          >
            Everything you need to know before your stay. Can&apos;t find your
            answer? Our concierge team is always ready to help.
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, ${GOLD_ALPHA(0.4)}, transparent)`,
            marginBottom: "clamp(8px, 1.5vh, 16px)",
          }}
        />

        {/* FAQ list */}
        <div>
          {FAQ_DATA.map((faq, index) => (
            <FAQItem
              key={faq.id}
              id={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={handleToggle}
              index={index}
            />
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "clamp(40px, 6vh, 64px)",
            padding: "clamp(24px, 3.5vh, 40px)",
            background: "rgba(212,175,55,0.04)",
            border: `1px solid ${GOLD_ALPHA(0.15)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                fontWeight: 600,
                color: "#ffffff",
                margin: "0 0 6px 0",
              }}
            >
              Still have questions?
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                color: WHITE_ALPHA(0.55),
                margin: 0,
              }}
            >
              Our team is available 24/7 to assist you.
            </p>
          </div>
          <a
            href="tel:+918238282341"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 28px",
              background: "transparent",
              border: `1px solid ${GOLD_ALPHA(0.55)}`,
              color: GOLD,
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.22s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = GOLD;
              (e.currentTarget as HTMLAnchorElement).style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = GOLD;
            }}
          >
            Call Us Now →
          </a>
        </div>
      </div>
    </section>
  );
}
