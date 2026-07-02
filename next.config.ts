import type { NextConfig } from "next";

const nextConfig: NextConfig = {
         // Forces Next.js to build a static export directory ('out')
  images: {
    unoptimized: true,    // Required for static exports since Next.js image optimization happens at runtime
  },
  reactCompiler: true,    // Keeps your cutting-edge automated React performance compiler active
};

export default nextConfig;