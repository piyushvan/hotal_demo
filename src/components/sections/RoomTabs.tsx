"use client";

import React from "react";

/**
 * RoomTabs is now implemented inline within ChapterViews → RoomsSection.
 * This file is kept as a re-export shim to avoid breaking any future imports.
 */
export interface RoomTabsProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export function RoomTabs({ activeTab }: RoomTabsProps) {
  return <div aria-label={`Active room: ${activeTab}`} />;
}
