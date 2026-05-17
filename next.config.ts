import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sofifa.net",
        pathname: "/players/**",
      },
      {
        protocol: "https",
        hostname: "ratings-images-prod.pulse.ea.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.contentapi.ea.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pmedia.ea.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
