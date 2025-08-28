/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.cosmicjs.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  typescript: {
    // Ignore build errors on type-check step
    ignoreBuildErrors: false,
  },
  // Disable typed routes to prevent complex TypeScript errors
  typedRoutes: false,
}

module.exports = nextConfig