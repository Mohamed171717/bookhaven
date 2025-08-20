import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    // domains: [ 
    //   'lh3.googleusercontent.com', 
    //   'graph.facebook.com', 
    //   // 'media.istockphoto.com',
    //   "ik.imagekit.io"
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "graph.facebook.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);