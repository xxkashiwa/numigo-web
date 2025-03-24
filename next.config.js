/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://119.45.26.22:8123/api/:path*', // 替换为你的实际 API 地址
      },
    ];
  },
}

module.exports = nextConfig