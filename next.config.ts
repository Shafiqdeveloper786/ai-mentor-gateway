import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force webpack to transpile next-auth — fixes __webpack_modules__ ESM/CJS conflict in Next.js 15.5+
  transpilePackages: ["next-auth", "@auth/core"],

  // Keep nodemailer as a Node.js external (pure ESM — cannot be bundled by webpack)
  serverExternalPackages: ["nodemailer"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
