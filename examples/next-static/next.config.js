// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: { urlImports: ['https://themer.sanity.build/'] },
  transpilePackages: ['sanity'],
}

module.exports = nextConfig
