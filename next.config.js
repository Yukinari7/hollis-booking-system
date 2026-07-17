/** @type {import('next').NextConfig} */
const nextConfig = {

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;