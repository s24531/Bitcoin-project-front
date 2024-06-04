/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      });
  
      return config;
    },
  };
