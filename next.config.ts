import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve large video files from /public — increase default body size limit
  // No custom headers needed; Next.js serves /public statically on Vercel.

  // Disable source maps in production for smaller deploy bundle
  productionBrowserSourceMaps: false,
};

export default nextConfig;
