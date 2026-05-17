import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ut.ea.com",
      },
    ],
  },
};

export default nextConfig;
