"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis();
        lenisRef.current = lenis;

        lenis.on("scroll", ScrollTrigger.update);

        const updateLenis = (time: number) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateLenis);
        gsap.ticker.lagSmoothing(0);

        return () => {
          lenis.destroy();
          gsap.ticker.remove(updateLenis);
          lenisRef.current = null;
        };
      } catch (error) {
        console.warn("Animation initialization failed:", error);
      }
    }
  }, []);

  return <>{children}</>;
}
