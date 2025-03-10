import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
  /* config options here */
  images: {
    domains: ['www.plantuml.com'],
  },
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
