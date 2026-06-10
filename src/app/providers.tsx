"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LenisProvider } from "@/lib/lenisContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      gsap.registerPlugin(ScrollTrigger);

      const lenisInstance = new Lenis();
      lenisRef.current = lenisInstance;

      lenisInstance.on("scroll", ScrollTrigger.update);

      const updateLenis = (time: number) => {
        lenisInstance.raf(time * 1000);
      };

      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);

      // Set state in the SAME effect, after full setup — avoids Strict Mode stale ref
      setLenis(lenisInstance);

      return () => {
        lenisInstance.destroy();
        gsap.ticker.remove(updateLenis);
        lenisRef.current = null;
        setLenis(null);
      };
    } catch (error) {
      console.warn("Animation initialisation failed:", error);
    }
  }, []);

  return <LenisProvider lenis={lenis}>{children}</LenisProvider>;
}
