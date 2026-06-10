"use client";

import React from "react";

// ─── Shared design primitives ─────────────────────────────────────────────────
// Single source of truth for the repeated micro-components that appear in
// ChapterViews, ContactModal, and ContactAndFooter.
// ─────────────────────────────────────────────────────────────────────────────

export function GoldRule({ width = 52 }: { width?: number }) {
  return (
    <div
      className="h-[1px] bg-[linear-gradient(90deg,var(--color-brand-gold),rgba(212,175,55,0.2))] mb-[18px]"
      style={{ width: `${width}px` }}
    />
  );
}

export function SubTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-brand-gold/70 mb-[8px] font-normal m-0">
      {children}
    </p>
  );
}

export function GoldButton({
  children,
  onClick,
  fullWidth = false,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`pointer-events-auto inline-flex items-center gap-[10px] py-[13px] px-[32px] bg-black/30 border border-brand-gold/55 text-brand-gold font-sans text-[10px] font-semibold tracking-[0.24em] uppercase cursor-pointer transition-all duration-200 ease-in-out backdrop-blur-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:bg-brand-gold hover:text-black hover:border-brand-gold hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-40 disabled:cursor-not-allowed ${
        fullWidth ? "w-full justify-center" : ""
      } group`}
    >
      {children}
      <span className="opacity-70 text-[10px] group-hover:text-black">→</span>
    </button>
  );
}
