"use client";

import React from "react";

/**
 * ContactForm is now implemented inline within ChapterViews → ContactSection.
 * This file is kept as a clean stub to avoid breaking any future imports.
 */
export interface ContactFormProps {
  onSubmit?: () => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      aria-label="Contact form stub"
    />
  );
}
