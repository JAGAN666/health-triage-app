/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Base path for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/health-triage-app' : '',
  
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
  
  // Disable server-side features for static export
  experimental: {
    appDir: true,
  },
};

export default nextConfig;