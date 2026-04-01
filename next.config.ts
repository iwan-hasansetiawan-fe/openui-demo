/**
 * next.config.ts
 *
 * Konfigurasi Next.js:
 * - webpack: enable import file .txt (untuk system prompt)
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Izinkan import file .txt sebagai raw string
    // Digunakan untuk load system prompt: import prompt from "@/generated/chart-system-prompt.txt"
    config.module.rules.push({
      test: /\.txt$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
