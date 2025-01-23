/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'luuybaykddlhopmzzpyq.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
