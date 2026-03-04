import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 複数のlockfile検出によるルート誤検出を防ぐ（Vercel 404対策）
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
