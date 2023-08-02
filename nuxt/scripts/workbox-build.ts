import {generateSW} from "workbox-build"

export const workboxBuild = async() => {
  const swPath = process.env.NODE_ENV === "production" ? "dist/sw.js" : "public/sw-dev.js"
  const globDirectory = process.env.NODE_ENV === "production" ? "dist" : ".nuxt/dist/client/_nuxt"
  const cacheId = "hsr-material"

  const {count, size} = await generateSW({
    cacheId,
    swDest: swPath,
    sourcemap: false,
    globDirectory,
    globPatterns: [
      "**/*.{js,css,webp}",
    ],
    runtimeCaching: [
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

  console.log(`Generated ${swPath}, which will precache ${count} files, totaling ${(size / 1024 / 1024).toFixed(2)} MB.`)
}
