/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "pwdcmawzdozifixwxuoq.supabase.co",
      "cgmpmxqopvgyjxsrrgbd.supabase.co",
      "i.playboard.app"
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
  },
};

module.exports = nextConfig;
