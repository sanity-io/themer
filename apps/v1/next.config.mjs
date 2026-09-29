// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  // The workspace package resolves to its TypeScript source (package `exports`)
  transpilePackages: ['@sanity/themer-legacy'],
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'source.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
