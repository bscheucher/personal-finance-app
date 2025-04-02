let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
  console.log("User config loaded:", userConfig);
} catch (e) {
  console.error("Error loading user config:", e);
  // Ignore error, but you can also handle this more gracefully.
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: false, // Disable temporarily
    parallelServerBuildTraces: false, // Disable temporarily
    parallelServerCompiles: false, // Disable temporarily
  },
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    console.warn("User config not found.");
    return;
  }

  console.log("Merging user config:", userConfig);

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

console.log("Final merged nextConfig:", nextConfig);
export default nextConfig;
