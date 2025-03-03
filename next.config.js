const path = require('path'); 
 
/** @type {import('next').NextConfig} */ 
const nextConfig = { 
  reactStrictMode: false, 
 
  // Configure webpack for PDF.js and path aliases 
  webpack: (config) => { 
    // This addresses the "Can't resolve 'canvas'" error when using pdf.js in Next.js 
    config.resolve.fallback = { 
      ...config.resolve.fallback, 
      canvas: false, 
      fs: false, 
      path: false, 
    }; 
 
    // Add path aliases 
    config.resolve.alias = { 
      ...config.resolve.alias, 
      '@': path.resolve(__dirname, './src'), 
    }; 
 
    return config; 
  } 
}; 
 
module.exports = nextConfig; 
