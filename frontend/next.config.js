/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.join(__dirname, '../shared'),
    };
    return config;
  },
};

module.exports = nextConfig; 