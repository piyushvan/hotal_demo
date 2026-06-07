import React from "react";

export interface RoomTabsProps {
  activeTab: string;
}

export function RoomTabs({ activeTab }: RoomTabsProps) {
  return <div>Active Room: {activeTab}</div>;
}
