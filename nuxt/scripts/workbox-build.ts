import * as path from "path"
import {generateSW} from "workbox-build"

export const workboxBuild = async() => {
  const swPath = path.resolve("dist/sw.js")
  const cacheId = "hsr-material"

  const {count, size} = await generateSW({
    cacheId,
    swDest: swPath,
    sourcemap: false,
    globDirectory: "dist",
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
