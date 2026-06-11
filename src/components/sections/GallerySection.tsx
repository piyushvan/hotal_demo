"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";

// ─── Gallery data — real hotel images from public/gallary ─────────────────────
const GALLERY_IMAGES = [
  { id: "g3",  src: "/gallary/image3.jpg",   alt: "Grand Reception",                category: "Lobby"    },
  { id: "g9",  src: "/gallary/image9.jpg",   alt: "Restaurant Interior",            category: "Dining"   },
  { id: "g11", src: "/gallary/image11.jpeg", alt: "Buffet Spread",                  category: "Dining"   },
  { id: "g12", src: "/gallary/image12.jpeg", alt: "Club Room",                      category: "Rooms"    },
  { id: "g13", src: "/gallary/image13.jpeg", alt: "Deluxe Room",                    category: "Rooms"    },
  { id: "g14", src: "/gallary/image14.jpeg", alt: "Suite Bedroom",                  category: "Rooms"    },
  { id: "g15", src: "/gallary/image15.jpeg", alt: "Room View",                      category: "Rooms"    },
  { id: "g16", src: "/gallary/image16.jpeg", alt: "Quad Room",                      category: "Rooms"    },
  { id: "g20", src: "/gallary/image20.jpeg", alt: "Banquet Setup",                  category: "Banquet"  },
  { id: "g21", src: "/gallary/image21.jpg",  alt: "Wedding Hall",                   category: "Banquet"  },
  { id: "g23", src: "/gallary/image23.jpeg", alt: "Banquet Lighting",               category: "Banquet"  },
  { id: "g24", src: "/gallary/image24.jpg",  alt: "Corporate Event Setup",          category: "Banquet"  },
  { id: "g25", src: "/gallary/image25.jpeg", alt: "Hotel Exterior — Day",           category: "Exterior" },
  { id: "g26", src: "/gallary/image26.jpeg", alt: "Hotel Facade",                   category: "Exterior" },
  { id: "g27", src: "/gallary/image27.jpeg", alt: "Hotel at Night",                 category: "Exterior" },
  { id: "g28", src: "/gallary/image28.jpeg", alt: "Parking Area",                   category: "Exterior" },
  { id: "g29", src: "/gallary/image29.jpeg", alt: "Surrounding Area",               category: "Exterior" },
];

const CATEGORIES = ["All", "Lobby", "Dining", "Rooms", "Banquet", "Exterior"];

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  image: typeof GALLERY_IMAGES[number];
  images: typeof GALLERY_IMAGES;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

function Lightbox({ image, images, onClose, onNavigate }: LightboxProps) {
  const currentIndex = images.findIndex((i) => i.id === image.id);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const goNext = useCallback(() => {
    const next = images[(currentIndexRef.current + 1) % images.length];
    onNavigate(next.id);
  }, [images, onNavigate]);

  const goPrev = useCallback(() => {
    const prev = images[(currentIndexRef.current - 1 + images.length) % images.length];
    onNavigate(prev.id);
  }, [images, onNavigate]);

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
      className="fixed inset-0 z-1000 bg-black/95 backdrop-blur-[24px] flex items-center justify-center animate-[lbFadeIn_0.25s_ease_forwards]"
    >
{/* Counter */}
      <div className="absolute top-[24px] left-1/2 -translate-x-1/2 font-sans text-[10px] tracking-[0.35em] text-brand-gold/70 uppercase select-none">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Close */}
      <button
        type="button"
        aria-label="Close lightbox (Escape)"
        onClick={onClose}
        className="absolute top-[20px] right-[24px] bg-black/50 border border-brand-gold/35 text-brand-gold w-[44px] h-[44px] rounded-full cursor-pointer text-[22px] leading-none flex items-center justify-center transition-colors duration-200 z-10 hover:bg-brand-gold hover:text-black"
      >
        ×
      </button>

      {/* Prev */}
      <button
        type="button"
        aria-label="Previous image (←)"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-[20px] bg-black/50 border border-brand-gold/25 text-brand-gold w-[52px] h-[52px] rounded-full cursor-pointer text-[24px] leading-none flex items-center justify-center transition-colors duration-200 hover:bg-brand-gold/20"
      >
        ‹
      </button>

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[85vh] relative"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={800}
          priority
          className="max-w-[90vw] max-h-[80vh] object-contain block border border-brand-gold/15 drop-shadow-[0_0_80px_rgba(0,0,0,0.9)] w-auto h-auto"
        />
        {/* Caption */}
        <div className="mt-[14px] text-center">
          <p className="font-cormorant text-[clamp(0.9rem,1.2vw,1.05rem)] text-white/70 mb-[4px] italic">
            {image.alt}
          </p>
          <p className="font-sans text-[9px] tracking-[0.3em] text-brand-gold/60 m-0 uppercase">
            {image.category}
          </p>
        </div>
      </div>

      {/* Next */}
      <button
        type="button"
        aria-label="Next image (→)"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-[20px] bg-black/50 border border-brand-gold/25 text-brand-gold w-[52px] h-[52px] rounded-full cursor-pointer text-[24px] leading-none flex items-center justify-center transition-colors duration-200 hover:bg-brand-gold/20"
      >
        ›
      </button>
    </div>
  );
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

interface ThumbnailProps {
  image: typeof GALLERY_IMAGES[number];
  onClick: (id: string) => void;
  priority?: boolean;
}

function GalleryThumbnail({ image, onClick, priority = false }: ThumbnailProps) {
  return (
    <button
      type="button"
      aria-label={`View full size: ${image.alt}`}
      onClick={() => onClick(image.id)}
      className="group bg-transparent border-none p-0 cursor-pointer relative overflow-hidden aspect-[4/3] block w-full outline outline-1 outline-transparent outline-offset-0 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] hover:outline-brand-gold/60"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="w-full h-full object-cover block filter brightness-80 transition-all duration-400 ease-in-out group-hover:brightness-[1.08] group-hover:scale-[1.05]"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-transparent transition-colors duration-300 ease-in-out flex flex-col justify-end p-[14px] opacity-0 group-hover:bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.75)_100%)] group-hover:opacity-100">
        <p className="font-sans text-[8px] tracking-[0.25em] text-brand-gold/90 uppercase mb-[3px]">
          {image.category}
        </p>
        <p className="font-cormorant text-[clamp(0.8rem,1.1vw,1rem)] text-white/90 m-0 leading-[1.3] italic">
          {image.alt}
        </p>
      </div>

      {/* Expand icon */}
      <div
        aria-hidden="true"
        className="absolute top-[12px] right-[12px] w-[32px] h-[32px] border border-brand-gold/70 rounded-full flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
      >
        <span className="text-brand-gold text-[14px] leading-none">⊕</span>
      </div>
    </button>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [gridVisible, setGridVisible] = useState(true);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useReveal<HTMLElement>();

  // Cross-fade when switching categories
  const handleCategoryChange = useCallback((cat: string) => {
    if (cat === activeCategory) return;
    setGridVisible(false);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setActiveCategory(cat);
      setGridVisible(true);
    }, 200);
  }, [activeCategory]);

  // Cleanup timer on unmount
  useEffect(() => () => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
  }, []);

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
      ref={sectionRef}
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-[#0a0a0a] px-[clamp(20px,5vw,72px)] py-[clamp(60px,10vh,112px)] border-t border-brand-gold/15"
    >
      {/* Header */}
      <div data-reveal className="text-center mb-[clamp(36px,6vh,64px)]">
        <p className="font-sans text-[10px] tracking-[0.48em] uppercase text-brand-gold/70 mb-[16px]">
          VISUAL STORY
        </p>
        <div
          aria-hidden="true"
          className="w-[1px] h-[48px] bg-[linear-gradient(180deg,transparent,var(--color-brand-gold),transparent)] mx-auto mb-[20px]"
        />
        <h2
          id="gallery-heading"
          className="font-playfair text-[clamp(2rem,4.5vw,4rem)] font-bold text-white mb-[18px] leading-[1.1] tracking-[0.04em]"
        >
          Through Our Lens
        </h2>
        <p className="font-cormorant text-[clamp(1rem,1.4vw,1.2rem)] text-white/55 mx-auto max-w-[520px] leading-[1.8]">
          Every corner of The Blackstone tells a story of craft, elegance, and
          a commitment to the extraordinary. Step inside.
        </p>
      </div>

      {/* Category filter tabs */}
      <div
        data-reveal
        data-reveal-delay="1"
        role="tablist"
        aria-label="Gallery filter"
        className="flex justify-center gap-[4px] flex-wrap mb-[clamp(28px,5vh,52px)]"
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`py-[8px] px-[20px] font-sans text-[9px] tracking-[0.22em] uppercase cursor-pointer transition-colors duration-200 ${
                isActive 
                  ? "bg-brand-gold/15 border border-brand-gold/70 text-brand-gold" 
                  : "bg-transparent border border-brand-gold/15 text-white/45 hover:border-brand-gold/40 hover:text-white/80"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Image Grid — cross-fades between category changes */}
      <div
        className={`grid grid-cols-[repeat(auto-fill,minmax(clamp(200px,26vw,320px),1fr))] gap-[3px] max-w-[1400px] mx-auto transition-opacity duration-[200ms] ease-in-out ${
          gridVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {filtered.map((img, index) => (
          <GalleryThumbnail
            key={img.id}
            image={img}
            onClick={handleOpen}
            priority={index < 6}
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
