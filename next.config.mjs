/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Mantieni questa opzione
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eu-west-2.graphassets.com",
      },
    ],
    minimumCacheTTL: 2678400, // 31 giorni
  },
};

export default nextConfig;


