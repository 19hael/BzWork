const nextConfig = {
  output: "standalone",
  images: {
    domains: ["avatars.githubusercontent.com"],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
