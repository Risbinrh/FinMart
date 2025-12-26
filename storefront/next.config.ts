import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Proxy to Medusa backend to avoid CORS issues
  async rewrites() {
    return [
      {
        source: '/store/:path*',
        destination: 'http://localhost:9000/store/:path*',
      },
    ];
  },
};

export default nextConfig;
