import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    domains: ["localhost", 
      "storage.googleapis.com",
      "192.168.0.55"], // ggf. auch "deine-domain.de"

  },
};

export default nextConfig;
