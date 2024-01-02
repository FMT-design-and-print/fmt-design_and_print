/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    routeId: "568763",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dnbmynikp/image/upload/**",
      },
    ],
  },
};

module.exports = nextConfig;
