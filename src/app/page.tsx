import type { Metadata } from "next";
import { MainPage } from "@/components/sections/MainPage";

export const metadata: Metadata = {
  title: "The Blackstone Hotel — Rajkot's Finest Luxury Experience",
  description:
    "Step into The Blackstone Hotel, Rajkot — an immersive luxury destination offering premium rooms, fine dining, world-class banquet facilities, and 24/7 concierge service. Discover your sanctuary.",
};

export default function Home() {
  return <MainPage />;
}
