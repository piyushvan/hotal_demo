"use client";

import React, { createContext, useContext } from "react";
import type Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({
  lenis,
  children,
}: {
  lenis: Lenis | null;
  children: React.ReactNode;
}) {
  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

/**
 * Returns the current Lenis instance, or null if Lenis has not yet
 * been initialised (e.g. during SSR or before the first useEffect fires).
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
