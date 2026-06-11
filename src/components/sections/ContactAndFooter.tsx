"use client";

import React, { useState, useCallback } from "react";
import { useReveal } from "@/hooks/useReveal";

const QUICK_LINKS = [
  { label: "Home",           href: "#hero"    },
  { label: "About Us",       href: "#about"   },
  { label: "Rooms & Suites", href: "#rooms"   },
  { label: "Restaurant",     href: "#dining"  },
  { label: "Banquet Hall",   href: "#dining"  },
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
        className="block font-sans text-[9px] tracking-[0.25em] uppercase text-brand-gold/65 mb-[6px]"
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
  const contactRef = useReveal<HTMLElement>();

  const inputBaseClass = "w-full py-[11px] px-[14px] bg-white/5 border border-brand-gold/20 text-white font-sans text-[13px] outline-none transition-colors duration-200 focus:border-brand-gold/45";

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
        ref={contactRef}
        id="contact"
        aria-labelledby="contact-heading"
        className="bg-[#060606] px-[clamp(24px,6vw,80px)] py-[clamp(64px,10vh,120px)] border-t border-brand-gold/10"
      >
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)] items-start">
            
            {/* Left: Info */}
            <div data-reveal>
              <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-brand-gold/70 mb-[14px]">
                GET IN TOUCH
              </p>
              <div className="w-[40px] h-[1px] bg-brand-gold mb-[20px]" />
              <h2
                id="contact-heading"
                className="font-playfair text-[clamp(2rem,3.8vw,3.5rem)] font-bold text-white mb-[18px] leading-[1.1]"
              >
                Reach The Blackstone
              </h2>
              <p className="font-cormorant text-[clamp(1rem,1.3vw,1.15rem)] text-white/60 leading-[1.8] mb-[40px] max-w-[440px]">
                Whether you&apos;re planning a stay, an event, or simply
                curious — we&apos;re here. Our team responds to every enquiry
                with the same care we give each of our guests.
              </p>

              {/* Contact details */}
              <div className="flex flex-col gap-[24px]">
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
                  <div key={item.label} className="flex gap-[16px]">
                    <div className="w-[40px] h-[40px] border border-brand-gold/20 flex items-center justify-center shrink-0 text-[16px] opacity-70">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-brand-gold/55 mb-[4px]">
                        {item.label}
                      </p>
                      {item.lines.map((line, i) =>
                        item.href && i === 0 ? (
                          <a
                            key={i}
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="block font-cormorant text-[clamp(0.9rem,1.1vw,1rem)] text-white/75 no-underline leading-[1.5] transition-colors duration-200 hover:text-brand-gold"
                          >
                            {line}
                          </a>
                        ) : (
                          <p
                            key={i}
                            className="font-cormorant text-[clamp(0.9rem,1.1vw,1rem)] text-white/65 m-0 leading-[1.5]"
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
            <div data-reveal data-reveal-delay="2">
              {status === "success" ? (
                <div className="p-[48px] text-center border border-brand-gold/25 bg-brand-gold/5">
                  <div className="w-[56px] h-[56px] border border-brand-gold/50 rounded-full flex items-center justify-center mx-auto mb-[20px]">
                    <span className="text-brand-gold text-[22px]">✓</span>
                  </div>
                  <p className="font-playfair text-[1.5rem] text-white mb-[10px]">
                    Message Received
                  </p>
                  <p className="font-cormorant text-white/60 text-[1rem] mb-[24px] leading-[1.7]">
                    Thank you for reaching out. Our concierge team will respond
                    within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }}
                    className="py-[10px] px-[24px] bg-transparent border border-brand-gold/40 text-brand-gold font-sans text-[9px] tracking-[0.22em] uppercase cursor-pointer transition-colors duration-200 hover:bg-brand-gold hover:text-black"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-[16px]"
                >
                  <InputField id="cf-name" label="Full Name *">
                    <input
                      id="cf-name" name="name" type="text" required
                      autoComplete="name" value={form.name} onChange={handleChange}
                      placeholder="Your full name" className={inputBaseClass}
                    />
                  </InputField>

                  <div className="grid grid-cols-2 gap-[12px]">
                    <InputField id="cf-email" label="Email *">
                      <input
                        id="cf-email" name="email" type="email" required
                        autoComplete="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com" className={inputBaseClass}
                      />
                    </InputField>
                    <InputField id="cf-phone" label="Phone *">
                      <input
                        id="cf-phone" name="phone" type="tel" required
                        autoComplete="tel" value={form.phone} onChange={handleChange}
                        placeholder="+91 00000 00000" className={inputBaseClass}
                      />
                    </InputField>
                  </div>

                  <InputField id="cf-service" label="Service">
                    <select
                      id="cf-service" name="service" value={form.service}
                      onChange={handleChange}
                      className={`${inputBaseClass} cursor-pointer`}
                    >
                      <option value="" className="bg-[#111]">Select a service…</option>
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#111]">{opt}</option>
                      ))}
                    </select>
                  </InputField>

                  <InputField id="cf-message" label="Message *">
                    <textarea
                      id="cf-message" name="message" required rows={4}
                      value={form.message} onChange={handleChange}
                      placeholder="Tell us about your plans…"
                      className={`${inputBaseClass} resize-y leading-[1.6]`}
                    />
                  </InputField>

                  {status === "error" && (
                    <p className="font-sans text-[11px] text-[#ff6464] m-0">
                      Please fill in all required fields correctly.
                    </p>
                  )}

                  <button
                    type="submit"
                    className={`py-[14px] px-[32px] border border-brand-gold/55 text-brand-gold font-sans text-[10px] font-semibold tracking-[0.24em] uppercase transition-all duration-200 ${
                      status === "submitting" 
                        ? "bg-brand-gold/10 cursor-wait" 
                        : "bg-transparent cursor-pointer hover:bg-brand-gold hover:text-black"
                    }`}
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
      <footer className="bg-[#020202] border-t border-brand-gold/10 px-[clamp(24px,6vw,80px)] py-[clamp(56px,8vh,100px)] pb-[clamp(28px,4vh,48px)]">
        <div className="max-w-[1200px] mx-auto">
          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1.4fr] gap-[clamp(32px,5vw,72px)] mb-[clamp(40px,6vh,64px)]">
            
            {/* Brand */}
            <div>
              <div className="flex items-center gap-[14px] mb-[20px]">
                <div className="w-[40px] h-[40px] border border-brand-gold/35 rounded-full flex items-center justify-center">
                  <span className="font-playfair text-[18px] font-bold text-brand-gold/85">
                    B
                  </span>
                </div>
                <div>
                  <p className="font-playfair text-[clamp(0.85rem,1.2vw,1rem)] font-bold text-white tracking-[0.18em] uppercase m-0 mb-[2px] leading-none">
                    THE BLACKSTONE
                  </p>
                  <p className="font-cormorant text-[9px] tracking-[0.35em] uppercase text-brand-gold/60 m-0 leading-none">
                    HOTEL · RAJKOT
                  </p>
                </div>
              </div>
              <p className="font-cormorant text-[clamp(0.9rem,1.1vw,1rem)] text-white/50 leading-[1.78] mb-[24px] max-w-[360px]">
                Since 2015, The Blackstone Hotel has been Rajkot&apos;s
                definitive statement in business and luxury hospitality.
              </p>
              <div className="flex gap-[8px]">
                {[
                  { label: "Facebook", href: "https://facebook.com", icon: "f" },
                  { label: "Instagram", href: "https://instagram.com", icon: "ig" },
                  { label: "Twitter", href: "https://twitter.com", icon: "tw" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-[32px] h-[32px] border border-brand-gold/20 bg-transparent text-white/40 text-[11px] flex items-center justify-center transition-all duration-200 font-sans hover:border-brand-gold/60 hover:text-brand-gold no-underline"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-brand-gold/70 mb-[20px]">
                Navigation
              </p>
              <nav aria-label="Footer navigation">
                <ul className="list-none m-0 p-0 flex flex-col gap-[10px]">
                  {QUICK_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="flex items-center gap-[8px] font-cormorant text-[clamp(0.9rem,1.1vw,1rem)] text-white/50 no-underline transition-colors duration-200 hover:text-brand-gold"
                      >
                        <span className="text-[9px] text-brand-gold/45">→</span>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Newsletter */}
            <div>
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-brand-gold/70 mb-[8px]">
                Newsletter
              </p>
              <div className="w-[40px] h-[1px] bg-[linear-gradient(90deg,var(--color-brand-gold),transparent)] mb-[18px]" />
              <p className="font-cormorant text-[clamp(0.9rem,1.1vw,1rem)] text-white/50 leading-[1.7] mb-[18px]">
                Stay ahead of exclusive offers, seasonal menus, and curated
                events at The Blackstone.
              </p>
              {newsSubscribed ? (
                <p className="font-cormorant text-[1rem] text-brand-gold m-0">
                  ✓ Welcome to The Blackstone circle.
                </p>
              ) : (
                <form onSubmit={handleNewsSubmit} noValidate className="flex flex-col gap-[8px]">
                  <input
                    id="footer-newsletter-email"
                    type="email" value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    placeholder="Your email address"
                    autoComplete="email"
                    className="w-full py-[10px] px-[14px] bg-white/5 border border-brand-gold/20 text-white font-sans text-[12px] outline-none"
                  />
                  <button
                    type="submit"
                    className="self-start py-[10px] px-[20px] bg-brand-gold/10 border border-brand-gold/40 text-brand-gold font-sans text-[9px] font-semibold tracking-[0.22em] uppercase cursor-pointer transition-all duration-200 hover:bg-brand-gold hover:text-black"
                  >
                    Subscribe →
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.25),transparent)] mb-[clamp(24px,3.5vh,40px)]" />

          {/* Copyright */}
          <div className="flex items-center justify-between flex-wrap gap-[12px]">
            <p className="font-sans text-[11px] tracking-[0.1em] text-white/25 m-0">
              Copyright © 2026 The Blackstone Hotel, Rajkot. All Rights Reserved.
            </p>
            <p className="font-cormorant text-[0.85rem] text-brand-gold/30 m-0 tracking-[0.06em]">
              Rajkot&apos;s Finest Since 2015
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
