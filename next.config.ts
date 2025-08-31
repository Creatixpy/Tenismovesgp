import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rjnxedwdhjkpjmbaulky.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Adicionar outros hostnames do Supabase se necessário
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
