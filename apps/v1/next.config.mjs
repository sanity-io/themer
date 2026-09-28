// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{hostname: 'cdn.sanity.io'}, {hostname: 'source.unsplash.com'}],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
