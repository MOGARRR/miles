import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


  // allows images from supabase bucket
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "klnfkxykbssboebfprvx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
