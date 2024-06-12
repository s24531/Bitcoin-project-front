/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*' // Ustaw port backendu na 3000
      }
    ];
  },

    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      });
  
      return config;
    },
  };
