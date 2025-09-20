import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "example.com",
      "via.placeholder.com",
      "p16-sign-sg.tiktokcdn.com",
      "p16-sign-va.tiktokcdn.com",
      "www.tiktok.com",
      "sf16-website-login.neutral.ttwstatic.com"
    ],
  },
};

export default nextConfig;
