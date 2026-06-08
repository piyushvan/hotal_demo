/**
 * Chapter configuration for The Blackstone Hotel canvas experience.
 * Each chapter maps a range of frame indices to a section of web content.
 * Frames run from 1 to 1065.
 */

export interface ChapterData {
  id: string;
  frameStart: number;
  frameEnd: number;
  label: string;
}

export const CHAPTERS: ChapterData[] = [
  { id: "hero",      frameStart: 1,    frameEnd: 120,  label: "THE BLACKSTONE" },
  { id: "reception", frameStart: 121,  frameEnd: 280,  label: "Reception"      },
  { id: "dining",    frameStart: 281,  frameEnd: 440,  label: "Dining"         },
  { id: "elevator",  frameStart: 441,  frameEnd: 580,  label: "Elevator Lobby" },
  { id: "rooms",     frameStart: 581,  frameEnd: 760,  label: "Rooms & Suites" },
  { id: "banquet",   frameStart: 761,  frameEnd: 900,  label: "Banquet"        },
  { id: "contact",   frameStart: 901,  frameEnd: 1065, label: "Contact"        },
];

/**
 * Returns the chapter whose frame range contains the given frame index,
 * or null if no chapter matches (should not happen with complete coverage).
 */
export function getActiveChapter(frame: number): ChapterData | null {
  return CHAPTERS.find((c) => frame >= c.frameStart && frame <= c.frameEnd) ?? null;
}

/**
 * Returns a 0–1 progress value representing how far through the
 * current chapter the given frame sits.
 */
export function getChapterProgress(frame: number, chapter: ChapterData): number {
  const span = chapter.frameEnd - chapter.frameStart;
  if (span === 0) return 0;
  const raw = (frame - chapter.frameStart) / span;
  return Math.min(1, Math.max(0, raw));
}
