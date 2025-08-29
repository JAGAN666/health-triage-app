/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for deployment
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Disable build checks
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;