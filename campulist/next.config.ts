import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/chat', destination: '/camtalk', permanent: true },
      { source: '/chat/:id', destination: '/camtalk', permanent: true },
      { source: '/chat2', destination: '/camtalk', permanent: true },
      { source: '/chat2/:id', destination: '/camtalk', permanent: true },
      { source: '/notifications', destination: '/camnotif', permanent: true },
      { source: '/notifications2', destination: '/camnotif', permanent: true },
    ];
  },
};

export default nextConfig;
