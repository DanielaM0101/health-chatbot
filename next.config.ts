/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
}

module.exports = nextConfig

