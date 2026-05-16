import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sofifa.net",
        pathname: "/players/**",
      },
    ],
  },
};

export default nextConfig;
