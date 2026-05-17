import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eafc.assets.ea.com",
      },
    ],
  },
};

export default nextConfig;
