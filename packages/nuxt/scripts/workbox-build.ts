import { generateSW } from "workbox-build"

export const workboxBuild = async () => {
  const swPath = process.env.NODE_ENV === "production" ? "dist/sw.js" : "public/sw-dev.js"
  const globDirectory = process.env.NODE_ENV === "production" ? "dist" : ".nuxt/dist/client/_nuxt"

  const { count, size } = await generateSW({
    swDest: swPath,
    sourcemap: false,
    globDirectory,
    skipWaiting: true,
    clientsClaim: true,
    dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
    globPatterns: [
      "**/*.{js,css}",
    ],
    runtimeCaching: [
      {
        urlPattern: ({ sameOrigin, url }) => sameOrigin && url.pathname.endsWith(".webp"),
        handler: "StaleWhileRevalidate",
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
        handler: "CacheFirst",
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
        handler: "CacheFirst",
      },
    ],
  })

  // eslint-disable-next-line no-console
  console.log(`Generated ${swPath}, which will precache ${count} files, totaling ${(size / 1024 / 1024).toFixed(2)} MB.`)
}
