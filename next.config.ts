import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["edge-tts.js", "ws"],
};
export default nextConfig;
