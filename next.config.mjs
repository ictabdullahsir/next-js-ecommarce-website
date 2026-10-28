/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingIncludes: {
    '/**': ['./data/**'],
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
