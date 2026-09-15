import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match WordPress-style paths (e.g. /graphic-design-solutions/)
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "xoomplus.co.uk",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "concisemedico.co.uk",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  /**
   * Next injects a fixed polyfill-module (Array.at, Object.hasOwn, …).
   * Our modern browserslist targets support these natively — replace with a stub.
   */
  turbopack: {
    resolveAlias: {
      "next/dist/build/polyfills/polyfill-module": "./lib/empty-module.js",
      "next/dist/build/polyfills/polyfill-module.js": "./lib/empty-module.js",
    },
  },
};

export default nextConfig;
