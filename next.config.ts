import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // This tells Next.js to generate the proper output for Cloudflare Pages
  output: 'standalone',
  // Uncomment if using images and want to specify domains
  // images: {
  //   domains: ['your-image-domain.com'],
  // },
}

export default nextConfig