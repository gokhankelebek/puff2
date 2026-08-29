import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/store/directions",
        destination: "/pickup",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
