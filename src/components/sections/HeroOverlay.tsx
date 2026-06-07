import React from "react";

export interface HeroOverlayProps {
  title: string;
}

export function HeroOverlay({ title }: HeroOverlayProps) {
  return (
    <section>
      <h1>{title}</h1>
    </section>
  );
}
