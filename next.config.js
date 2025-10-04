/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment configuration
  output: 'standalone',
  
  // Development origins
  allowedDevOrigins: ["*.preview.same-app.com"],
  
  // Image optimization for Vercel
  images: {
    unoptimized: false, // Enable optimization for Vercel
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "localhost",
      "iconicdigital.site",
      "admin.iconicdigital.site",
      "vercel.app",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "iconicdigital.site",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.iconicdigital.site",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
        pathname: "/**",
      },
    ],
  },
  
  // External packages for server components
  serverExternalPackages: ['mongoose'],
  
  // Environment-based configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || '*' 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
