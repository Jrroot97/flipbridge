import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  serverExternalPackages: ["@prisma/client", "prisma"],
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "172.30.0.2",
    "*.cursor.com",
    "*.cursor.sh",
  ],
};

export default nextConfig;
