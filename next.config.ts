import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mseuf.edu.ph",
      },
      {
        protocol: "https",
        hostname: "envergalibrary.wordpress.com",
      },
    ],
  },
};

export default nextConfig;
