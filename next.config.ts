import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    domains: [ 
      'lh3.googleusercontent.com', 
      'graph.facebook.com', 
      // 'media.istockphoto.com', 
      // 'funfandomblog.wordpress.com', 
      // 'encrypted-tbn0.gstatic.com', 
      // 'img.freepik.com', 
      "ik.imagekit.io"
    ],
  },

};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);