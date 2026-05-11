/** @type {import('next').NextConfig} */
const isMobile = process.env.MOBILE_BUILD === 'true'

const nextConfig = {
  ...(isMobile && { output: 'export' }),
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
