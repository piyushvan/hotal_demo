import React from "react";

export interface ContactFormProps {
  onSubmit: () => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
