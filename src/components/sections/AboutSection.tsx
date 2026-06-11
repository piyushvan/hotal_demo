"use client";

import React from "react";
import { useReveal } from "@/hooks/useReveal";

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
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="bg-[#050505] border-t border-brand-gold/10 overflow-hidden"
    >
      {/* ── Hero Banner ── */}
      <div data-reveal className="relative px-[clamp(24px,6vw,80px)] py-[clamp(80px,14vh,160px)] bg-[linear-gradient(135deg,rgba(212,175,55,0.04)_0%,transparent_50%,rgba(212,175,55,0.02)_100%)] text-center overflow-hidden">
        {/* Background decorative element */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-gold/5 rounded-full pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-brand-gold/5 rounded-full pointer-events-none"
        />

        <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-brand-gold/70 mb-[20px]">
          OUR STORY
        </p>
        <div className="w-[1px] h-[48px] bg-[linear-gradient(180deg,transparent,var(--color-brand-gold),transparent)] mx-auto mb-[24px]" />
        
        <h2
          id="about-heading"
          className="font-playfair text-[clamp(2.2rem,5.5vw,5rem)] font-bold text-white mb-[24px] leading-[1.08] tracking-[0.04em] max-w-[800px] mx-auto"
        >
          Not Just a Hotel.
          <br />
          <span className="text-brand-gold">A Living Legacy.</span>
        </h2>
        
        <p className="font-cormorant text-[clamp(1.05rem,1.5vw,1.3rem)] text-white/60 max-w-[620px] mx-auto leading-[1.8]">
          The Blackstone was born from a singular conviction: that Rajkot
          deserved a hotel that matched the ambition and warmth of its people.
          A place where business meets beauty, where every arrival feels like
          a homecoming.
        </p>
      </div>

      {/* ── Stats Bar ── */}
      <div data-reveal data-reveal-delay="1" className="grid grid-cols-2 md:grid-cols-4 border-y border-brand-gold/10">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-[clamp(16px,3vw,32px)] py-[clamp(28px,4vh,48px)] text-center ${
              i < STATS.length - 1 ? "border-r border-brand-gold/10" : ""
            } ${i % 2 === 0 ? "bg-brand-gold/5" : "bg-transparent"}`}
          >
            <p className="font-playfair text-[clamp(2rem,4vw,3.5rem)] font-bold text-brand-gold mb-[6px] leading-none">
              {stat.value}
            </p>
            <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 m-0">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Our Pillars ── */}
      <div className="px-[clamp(24px,6vw,80px)] py-[clamp(60px,10vh,100px)] max-w-[1400px] mx-auto">
        <div className="text-center mb-[clamp(40px,6vh,64px)]">
          <p className="font-sans text-[9px] tracking-[0.45em] uppercase text-brand-gold/65 mb-[14px]">
            WHAT DEFINES US
          </p>
          <h3 className="font-playfair text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-white m-0 leading-[1.2]">
            The Blackstone Philosophy
          </h3>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-[clamp(20px,3vw,40px)]">
          {PILLARS.map((pillar, idx) => (
            <div
              key={pillar.title}
              data-reveal
              data-reveal-delay={String((idx % 4) + 1) as "1" | "2" | "3" | "4"}
              className="p-[clamp(24px,3.5vw,40px)] bg-white/5 border-t border-brand-gold/20 border-b border-brand-gold/10 transition-colors duration-300 ease-in-out hover:bg-brand-gold/5 hover:border-t-brand-gold/40"
            >
              <span
                aria-hidden="true"
                className="block text-[22px] text-brand-gold/60 mb-[16px] leading-none"
              >
                ◆
              </span>
              <h4 className="font-playfair text-[clamp(1.1rem,1.6vw,1.4rem)] font-bold text-white mb-[14px] leading-[1.25]">
                {pillar.title}
              </h4>
              <p className="font-cormorant text-[clamp(0.9rem,1.1vw,1.05rem)] text-white/60 leading-[1.8] m-0">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Team Quote ── */}
      <div className="px-[clamp(24px,6vw,80px)] py-[clamp(48px,8vh,80px)] bg-brand-gold/5 border-t border-brand-gold/10 text-center">
        <div className="max-w-[700px] mx-auto">
          <div
            aria-hidden="true"
            className="text-[48px] text-brand-gold/20 leading-none mb-[20px] font-playfair"
          >
            &quot;
          </div>
          <p className="font-cormorant text-[clamp(1.2rem,2vw,1.8rem)] italic text-white/80 leading-[1.7] mb-[24px]">
            We do not merely offer rooms. We offer context — a setting in which
            life&apos;s most important moments can unfold with the dignity and
            splendour they deserve.
          </p>
          <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-brand-gold/70 m-0">
            — THE BLACKSTONE TEAM, RAJKOT
          </p>
        </div>
      </div>
    </section>
  );
}
