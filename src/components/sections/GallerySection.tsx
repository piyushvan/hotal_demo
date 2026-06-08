"use client";

import React, { useState, useCallback, useEffect } from "react";

// ─── Gallery data — real hotel images from public/gallary ─────────────────────
const GALLERY_IMAGES = [
  { id: "g1",  src: "/gallary/image1.jpg",   alt: "The Blackstone Hotel",           category: "Lobby"    },
  { id: "g2",  src: "/gallary/image2.jpg",   alt: "Hotel Entrance",                 category: "Exterior" },
  { id: "g3",  src: "/gallary/image3.jpg",   alt: "Grand Reception",                category: "Lobby"    },
  { id: "g4",  src: "/gallary/image4.jpg",   alt: "Lobby Interior",                 category: "Lobby"    },
  { id: "g5",  src: "/gallary/image5.jpg",   alt: "Hotel Corridor",                 category: "Lobby"    },
  { id: "g6",  src: "/gallary/image6.jpg",   alt: "Reception Desk",                 category: "Lobby"    },
  { id: "g7",  src: "/gallary/image7.jpg",   alt: "Hotel Common Area",              category: "Lobby"    },
  { id: "g8",  src: "/gallary/image8.jpg",   alt: "Dining Hall",                    category: "Dining"   },
  { id: "g9",  src: "/gallary/image9.jpg",   alt: "Restaurant Interior",            category: "Dining"   },
  { id: "g10", src: "/gallary/image10.jpeg", alt: "Fine Dining Setup",              category: "Dining"   },
  { id: "g11", src: "/gallary/image11.jpeg", alt: "Buffet Spread",                  category: "Dining"   },
  { id: "g12", src: "/gallary/image12.jpeg", alt: "Club Room",                      category: "Rooms"    },
  { id: "g13", src: "/gallary/image13.jpeg", alt: "Deluxe Room",                    category: "Rooms"    },
  { id: "g14", src: "/gallary/image14.jpeg", alt: "Suite Bedroom",                  category: "Rooms"    },
  { id: "g15", src: "/gallary/image15.jpeg", alt: "Room View",                      category: "Rooms"    },
  { id: "g16", src: "/gallary/image16.jpeg", alt: "Quad Room",                      category: "Rooms"    },
  { id: "g17", src: "/gallary/image17.jpeg", alt: "Premium Suite",                  category: "Rooms"    },
  { id: "g18", src: "/gallary/image18.jpeg", alt: "Room Bathroom",                  category: "Rooms"    },
  { id: "g19", src: "/gallary/image19.jpeg", alt: "Banquet Hall",                   category: "Banquet"  },
  { id: "g20", src: "/gallary/image20.jpeg", alt: "Banquet Setup",                  category: "Banquet"  },
  { id: "g21", src: "/gallary/image21.jpg",  alt: "Wedding Hall",                   category: "Banquet"  },
  { id: "g22", src: "/gallary/image22.jpeg", alt: "Event Decoration",               category: "Banquet"  },
  { id: "g23", src: "/gallary/image23.jpeg", alt: "Banquet Lighting",               category: "Banquet"  },
  { id: "g24", src: "/gallary/image24.jpg",  alt: "Corporate Event Setup",          category: "Banquet"  },
  { id: "g25", src: "/gallary/image25.jpeg", alt: "Hotel Exterior — Day",           category: "Exterior" },
  { id: "g26", src: "/gallary/image26.jpeg", alt: "Hotel Facade",                   category: "Exterior" },
  { id: "g27", src: "/gallary/image27.jpeg", alt: "Hotel at Night",                 category: "Exterior" },
  { id: "g28", src: "/gallary/image28.jpeg", alt: "Parking Area",                   category: "Exterior" },
  { id: "g29", src: "/gallary/image29.jpeg", alt: "Surrounding Area",               category: "Exterior" },
  { id: "g30", src: "/gallary/image30.jpeg", alt: "Hotel Garden / Amenities",       category: "Amenities"},
  { id: "g31", src: "/gallary/image31.jpeg", alt: "Hotel Amenities",                category: "Amenities"},
  { id: "g32", src: "/gallary/image32.jpeg", alt: "Special Features",               category: "Amenities"},
];

const CATEGORIES = ["All", "Lobby", "Dining", "Rooms", "Banquet", "Exterior", "Amenities"];

const GOLD = "#d4af37";
const GOLD_ALPHA = (a: number) => `rgba(212,175,55,${a})`;
const WHITE_ALPHA = (a: number) => `rgba(255,255,255,${a})`;

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  image: typeof GALLERY_IMAGES[number];
  images: typeof GALLERY_IMAGES;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

function Lightbox({ image, images, onClose, onNavigate }: LightboxProps) {
  const currentIndex = images.findIndex((i) => i.id === image.id);

  const goNext = useCallback(() => {
    const next = images[(currentIndex + 1) % images.length];
    onNavigate(next.id);
  }, [currentIndex, images, onNavigate]);

  const goPrev = useCallback(() => {
    const prev = images[(currentIndex - 1 + images.length) % images.length];
    onNavigate(prev.id);
  }, [currentIndex, images, onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery: ${image.alt}`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "lbFadeIn 0.25s ease forwards",
      }}
    >
      {/* Counter */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Geist Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.35em",
          color: GOLD_ALPHA(0.7),
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* Close */}
      <button
        type="button"
        aria-label="Close lightbox (Escape)"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "rgba(0,0,0,0.5)",
          border: `1px solid ${GOLD_ALPHA(0.35)}`,
          color: GOLD,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "22px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.background = GOLD;
          b.style.color = "#000";
        }}
        onMouseLeave={(e) => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.background = "rgba(0,0,0,0.5)";
          b.style.color = GOLD;
        }}
      >
        ×
      </button>

      {/* Prev */}
      <button
        type="button"
        aria-label="Previous image (←)"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        style={{
          position: "absolute",
          left: "20px",
          background: "rgba(0,0,0,0.5)",
          border: `1px solid ${GOLD_ALPHA(0.25)}`,
          color: GOLD,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "24px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = GOLD_ALPHA(0.2);
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)";
        }}
      >
        ‹
      </button>

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "85vh", position: "relative" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          style={{
            maxWidth: "90vw",
            maxHeight: "80vh",
            objectFit: "contain",
            display: "block",
            border: `1px solid ${GOLD_ALPHA(0.15)}`,
            boxShadow: `0 0 80px rgba(0,0,0,0.9)`,
          }}
        />
        {/* Caption */}
        <div style={{ marginTop: "14px", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
              color: WHITE_ALPHA(0.72),
              margin: "0 0 4px 0",
              fontStyle: "italic",
            }}
          >
            {image.alt}
          </p>
          <p
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: GOLD_ALPHA(0.6),
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            {image.category}
          </p>
        </div>
      </div>

      {/* Next */}
      <button
        type="button"
        aria-label="Next image (→)"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        style={{
          position: "absolute",
          right: "20px",
          background: "rgba(0,0,0,0.5)",
          border: `1px solid ${GOLD_ALPHA(0.25)}`,
          color: GOLD,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "24px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = GOLD_ALPHA(0.2);
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)";
        }}
      >
        ›
      </button>

      <style>{`
        @keyframes lbFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

interface ThumbnailProps {
  image: typeof GALLERY_IMAGES[number];
  onClick: (id: string) => void;
}

function GalleryThumbnail({ image, onClick }: ThumbnailProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label={`View full size: ${image.alt}`}
      onClick={() => onClick(image.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        aspectRatio: "4/3",
        display: "block",
        width: "100%",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        outline: hovered ? `1px solid ${GOLD_ALPHA(0.6)}` : "1px solid transparent",
        outlineOffset: "0px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          filter: hovered ? "brightness(1.08)" : "brightness(0.8)",
          transition: "filter 0.4s ease, transform 0.4s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* Hover overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered
            ? "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)"
            : "transparent",
          transition: "background 0.3s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "14px",
        }}
      >
        {hovered && (
          <>
            <p
              style={{
                fontFamily: "'Geist Sans', sans-serif",
                fontSize: "8px",
                letterSpacing: "0.25em",
                color: GOLD_ALPHA(0.9),
                textTransform: "uppercase",
                margin: "0 0 3px 0",
              }}
            >
              {image.category}
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(0.8rem, 1.1vw, 1rem)",
                color: WHITE_ALPHA(0.9),
                margin: 0,
                lineHeight: 1.3,
                fontStyle: "italic",
              }}
            >
              {image.alt}
            </p>
          </>
        )}
      </div>

      {/* Expand icon */}
      {hovered && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "32px",
            height: "32px",
            border: `1px solid ${GOLD_ALPHA(0.7)}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <span style={{ color: GOLD, fontSize: "14px", lineHeight: 1 }}>⊕</span>
        </div>
      )}
    </button>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const filtered =
    activeCategory === "All"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const lightboxImage = lightboxId
    ? GALLERY_IMAGES.find((i) => i.id === lightboxId) ?? null
    : null;

  const handleOpen = useCallback((id: string) => setLightboxId(id), []);
  const handleClose = useCallback(() => setLightboxId(null), []);
  const handleNavigate = useCallback((id: string) => setLightboxId(id), []);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      style={{
        background: "#0a0a0a",
        padding: "clamp(60px, 10vh, 112px) clamp(20px, 5vw, 72px)",
        borderTop: `1px solid ${GOLD_ALPHA(0.14)}`,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(36px, 6vh, 64px)" }}>
        <p
          style={{
            fontFamily: "'Geist Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            color: GOLD_ALPHA(0.7),
            margin: "0 0 16px 0",
          }}
        >
          VISUAL STORY
        </p>
        <div
          aria-hidden="true"
          style={{
            width: "1px",
            height: "48px",
            background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`,
            margin: "0 auto 20px",
          }}
        />
        <h2
          id="gallery-heading"
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 18px 0",
            lineHeight: 1.1,
            letterSpacing: "0.04em",
          }}
        >
          Through Our Lens
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
            color: WHITE_ALPHA(0.55),
            margin: "0 auto",
            maxWidth: "520px",
            lineHeight: 1.8,
          }}
        >
          Every corner of The Blackstone tells a story of craft, elegance, and
          a commitment to the extraordinary. Step inside.
        </p>
      </div>

      {/* Category filter tabs */}
      <div
        role="tablist"
        aria-label="Gallery filter"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "4px",
          flexWrap: "wrap",
          marginBottom: "clamp(28px, 5vh, 52px)",
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 20px",
                background: isActive ? GOLD_ALPHA(0.14) : "transparent",
                border: `1px solid ${isActive ? GOLD_ALPHA(0.7) : GOLD_ALPHA(0.14)}`,
                color: isActive ? GOLD : WHITE_ALPHA(0.45),
                fontFamily: "'Geist Sans', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Image Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(200px, 26vw, 320px), 1fr))",
          gap: "3px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {filtered.map((img) => (
          <GalleryThumbnail
            key={img.id}
            image={img}
            onClick={handleOpen}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          images={filtered}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </section>
  );
}
