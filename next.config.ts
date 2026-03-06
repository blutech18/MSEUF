import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mseuf.edu.ph",
      },
    ],
  },
};

export default nextConfig;
