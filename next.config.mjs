/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel-optimized configuration
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Basic optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Disable build checks for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Simple redirects only
  async redirects() {
    return [
      {
        source: '/health-check',
        destination: '/triage',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;