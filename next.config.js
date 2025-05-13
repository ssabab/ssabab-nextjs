/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/review/a',
        destination: '/review/1',
      },
      {
        source: '/review/b',
        destination: '/review/2',
      },
    ]
  },
}

module.exports = nextConfig
