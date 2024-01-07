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
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/admin",
  //       destination: "/admin/568763",
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
