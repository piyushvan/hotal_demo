"use client";

import React from "react";

interface PreloaderProps {
  progress: number;
  fadeOut: boolean;
}

export function Preloader({ progress, fadeOut }: PreloaderProps) {
  // Cycle loading messages based on progress
  let statusMessage = "Preparing cinematic experience...";
  if (progress <= 20) {
    statusMessage = "Connecting to The Blackstone legacy...";
  } else if (progress <= 40) {
    statusMessage = "Buffering the grand reception...";
  } else if (progress <= 60) {
    statusMessage = "Preparing executive dining halls...";
  } else if (progress <= 80) {
    statusMessage = "Arranging luxury suites & rooms...";
  } else {
    statusMessage = "Finalising details...";
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#030303",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? "scale(1.05)" : "scale(1)",
        pointerEvents: fadeOut ? "none" : "auto",
        transition: "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
{/* Monogram branding */}
      <div
        style={{
          width: "84px",
          height: "84px",
          borderRadius: "50%",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "36px",
          animation: "pulseGlow 2.5s ease-in-out infinite",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontSize: "32px",
            fontWeight: "bold",
            color: "#d4af37",
            userSelect: "none",
          }}
        >
          B
        </span>
      </div>

      {/* Header */}
      <h2
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
          fontWeight: 700,
          letterSpacing: "0.22em",
          color: "#ffffff",
          textTransform: "uppercase",
          margin: "0 0 4px 0",
          textAlign: "center",
        }}
      >
        THE BLACKSTONE
      </h2>
      <p
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
          fontSize: "10px",
          letterSpacing: "0.45em",
          color: "#d4af37",
          textTransform: "uppercase",
          margin: "0 0 40px 0",
          textAlign: "center",
        }}
      >
        HOTEL · RAJKOT
      </p>

      {/* Progress bar container */}
      <div
        style={{
          width: "280px",
          height: "1px",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          position: "relative",
          marginBottom: "18px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "#d4af37",
            width: `${progress}%`,
            transition: "width 0.2s cubic-bezier(0.1, 0.8, 0.25, 1)",
            boxShadow: "0 0 8px rgba(212, 175, 55, 0.4)",
          }}
        />
      </div>

      {/* Status reading percentage */}
      <div
        style={{
          fontFamily: "'Geist Sans', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.28em",
          color: "rgba(255, 255, 255, 0.4)",
          textTransform: "uppercase",
          marginBottom: "8px",
          userSelect: "none",
        }}
      >
        Loading <span style={{ color: "#d4af37", fontWeight: "bold" }}>{progress}%</span>
      </div>

      {/* Detail message updates */}
      <div
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
          fontSize: "13px",
          fontStyle: "italic",
          color: "rgba(255, 255, 255, 0.45)",
          textAlign: "center",
          height: "20px",
        }}
      >
        {statusMessage}
      </div>
    </div>
  );
}
