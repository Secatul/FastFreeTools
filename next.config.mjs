// import pkg from './next-i18next.config.js';
// const { i18n } = pkg;

const nextConfig = {
  reactStrictMode: true, 
  // i18n,

  async rewrites() {
    return [
      {
        source: '/pt-br/:path*',
        destination: '/:path*',
      },
      {
        source: '/en/:path*',
        destination: '/:path*',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // Prevent clickjacking attacks
          { key: 'X-Content-Type-Options', value: 'nosniff' }, // Prevent MIME type sniffing
          { key: 'X-XSS-Protection', value: '1; mode=block' }, // Enable Cross-Site Scripting protection
          
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, // Ensure correct referrer information
          { key: 'Permissions-Policy', value: 'geolocation=(self), microphone=(), camera=()' }, // Restrict access to specific APIs
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }, // Improve performance with long cache times for static assets
        ],
      },
    ];
  }
  
};

export default nextConfig;
