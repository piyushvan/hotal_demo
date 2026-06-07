import React from "react";

export interface ChapterViewsProps {
  chapterIndex: number;
}

export function ChapterViews({ chapterIndex }: ChapterViewsProps) {
  return <section>Chapter {chapterIndex}</section>;
}
