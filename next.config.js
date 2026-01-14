/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CITY_NAME: process.env.CITY_NAME || '성남시',
    CITY_CODE: process.env.CITY_CODE || 'seongnam',
  },
}

module.exports = nextConfig
