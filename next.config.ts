import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  typescript: {
    // Rely on tsc for strict checking
    ignoreBuildErrors: false,
  },
  devIndicators: false,
  // Proxy all /api/* requests to the Go backend (Render URL in production or localhost in dev)
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'https://bigbiz-backend.onrender.com';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/+$/, '')}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
