"use client";

import React, { useState } from "react";

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
  return (
    <div
      className={`border-b transition-colors duration-300 ease-in-out ${
        isOpen ? "border-brand-gold/20" : "border-brand-gold/10"
      }`}
    >
      <button
        id={`${id}-btn`}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={() => onToggle(id)}
        className={`w-full py-[clamp(18px,2.5vh,28px)] flex items-center justify-between gap-[24px] cursor-pointer text-left transition-colors duration-200 ease-in-out border-none group ${
          isOpen ? "bg-brand-gold/[0.03]" : "bg-transparent hover:bg-white/[0.01]"
        }`}
      >
        <div className="flex items-start gap-[20px] flex-1">
          <span className="font-sans text-[9px] tracking-[0.2em] text-brand-gold/50 shrink-0 mt-[4px] min-w-[28px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`font-playfair text-[clamp(1rem,1.4vw,1.25rem)] font-semibold leading-[1.3] transition-colors duration-200 ease-in-out ${
              isOpen ? "text-white" : "text-white/75"
            }`}
          >
            {question}
          </span>
        </div>
        <div
          aria-hidden="true"
          className={`w-[28px] h-[28px] rounded-full shrink-0 flex items-center justify-center transition-all duration-300 ease-in-out border ${
            isOpen 
              ? "border-brand-gold/60 bg-brand-gold/10 rotate-45" 
              : "border-brand-gold/20 bg-transparent rotate-0"
          }`}
        >
          <span
            className={`text-[16px] leading-none font-light ${
              isOpen ? "text-brand-gold" : "text-white/40"
            }`}
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
        className={`overflow-hidden transition-all duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <div className="pb-[clamp(18px,2.5vh,28px)] pl-[48px]">
          <p className="font-cormorant text-[clamp(0.95rem,1.2vw,1.1rem)] text-white/65 leading-[1.85] m-0">
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
      className="bg-[#080808] px-[clamp(24px,6vw,80px)] py-[clamp(64px,10vh,120px)] border-t border-brand-gold/10"
    >
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="mb-[clamp(40px,6vh,64px)]">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-brand-gold/70 mb-[14px]">
            GUEST ENQUIRIES
          </p>
          <div className="w-[40px] h-[1px] bg-brand-gold mb-[20px]" />
          <h2
            id="faq-heading"
            className="font-playfair text-[clamp(2rem,4.5vw,3.8rem)] font-bold text-white mb-[16px] leading-[1.1]"
          >
            Frequently Asked Questions
          </h2>
          <p className="font-cormorant text-[clamp(1rem,1.3vw,1.15rem)] text-white/55 m-0 leading-[1.75] max-w-[560px]">
            Everything you need to know before your stay. Can&apos;t find your
            answer? Our concierge team is always ready to help.
          </p>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[linear-gradient(90deg,rgba(212,175,55,0.4),transparent)] mb-[clamp(8px,1.5vh,16px)]" />

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
        <div className="mt-[clamp(40px,6vh,64px)] p-[clamp(24px,3.5vh,40px)] bg-brand-gold/5 border border-brand-gold/15 flex items-center justify-between flex-wrap gap-[20px]">
          <div>
            <p className="font-playfair text-[clamp(1.1rem,1.6vw,1.4rem)] font-semibold text-white mb-[6px]">
              Still have questions?
            </p>
            <p className="font-cormorant text-[clamp(0.9rem,1.1vw,1rem)] text-white/55 m-0">
              Our team is available 24/7 to assist you.
            </p>
          </div>
          <a
            href="tel:+918238282341"
            className="inline-flex items-center gap-[10px] py-[12px] px-[28px] bg-transparent border border-brand-gold/55 text-brand-gold font-sans text-[10px] font-semibold tracking-[0.22em] uppercase no-underline transition-colors duration-200 ease-in-out cursor-pointer hover:bg-brand-gold hover:text-[#000000]"
          >
            Call Us Now →
          </a>
        </div>
      </div>
    </section>
  );
}
