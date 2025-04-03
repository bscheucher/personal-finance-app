/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: false, // Disable temporarily
    parallelServerBuildTraces: false, // Disable temporarily
    parallelServerCompiles: false, // Disable temporarily
  },
};

export default nextConfig;
