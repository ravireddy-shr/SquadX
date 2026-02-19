/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages', 'components', 'hooks', 'utils'],
  },
  env: {
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID || '',
    NEXT_PUBLIC_ALGOD_TOKEN: process.env.NEXT_PUBLIC_ALGOD_TOKEN || '',
    NEXT_PUBLIC_ALGOD_SERVER: process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
  },
};

module.exports = nextConfig;
