import { useEffect, useState } from "react";
import { useLenis } from "@/lib/lenisContext";

/**
 * Returns the current scroll progress as a value from 0 (top) to 1 (bottom),
 * driven by the Lenis smooth-scroll instance. Falls back to 0 during SSR or
 * before Lenis has been initialised.
 */
export function useScrollProgress(): number {
  const lenis = useLenis();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = ({ progress: p }: { progress: number }) => {
      setProgress(p);
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  return progress;
}
