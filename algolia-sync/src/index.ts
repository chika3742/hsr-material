import algoliasearch from "algoliasearch"
import * as dotenv from "dotenv"
import * as path from "path"
import {Characters} from "../../nuxt/types/generated/characters.g"
import {loadCsvSync, loadYamlSync} from "./utils.js"
import {Materials} from "../../nuxt/types/data/materials"
import {LightCones} from "../../nuxt/types/generated/light-cones.g"
import algoliaConfig from "../../algolia.json" assert {type: "json"}

type LocaleObject = { [key: string]: LocaleValue }
type LocaleValue = string | LocaleObject

if (process.env.NODE_ENV === "development") {
  dotenv.config()
}

const kataToHira = (input: string) => {
  return input.replace(/[\u30a1-\u30f6]/g, function(match) {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

const dataDir = "../nuxt/assets/data"
const localeDir = "../nuxt/locales"

const syncObjects = async() => {
  if (process.env.ALGOLIA_API_KEY === undefined) {
    throw new Error("Environment variable ALGOLIA_API_KEY is not defined")
  }

  const index = algoliasearch(algoliaConfig.appId, process.env.ALGOLIA_API_KEY)
    .initIndex(algoliaConfig.indexName)

  const localeJa = loadYamlSync<LocaleObject>(path.resolve(localeDir, "ja.yaml"))
  const localeEn = loadYamlSync<LocaleObject>(path.resolve(localeDir, "en.yaml"))

  const characters = loadYamlSync<Characters>(path.resolve(dataDir, "characters.yaml"))
  const lightCones = loadYamlSync<LightCones>(path.resolve(dataDir, "light-cones.yaml"))
  const materials = loadCsvSync<Materials>(path.resolve(dataDir, "materials.csv"))

  const objects = [
    ...characters.map(e => ({
      objectID: e.id + "_character",
      name_ja: (localeJa.characterNames as LocaleObject)[e.id],
      name_en: (localeEn.characterNames as LocaleObject)[e.id],
      yomi: kataToHira(e.yomi),
      recordType: "character",
      url: `/characters/${e.id}`,
    })),
    ...lightCones.map(e => ({
      objectID: e.id + "_light-cone",
      name_ja: (localeJa.lightConeNames as LocaleObject)[e.id],
      name_en: (localeEn.lightConeNames as LocaleObject)[e.id],
      yomi: kataToHira(e.yomi),
      recordType: "light-cone",
      url: `/light-cones/${e.id}`,
    })),
    ...materials.map(e => ({
      objectID: e.id + "_material",
      name_ja: (localeJa.materialNames as LocaleObject)[e.id],
      name_en: (localeEn.materialNames as LocaleObject)[e.id],
      yomi: kataToHira(e.yomi),
      recordType: "material",
      url: `/materials/${e.id}`,
    })),
  ]

  console.log(await index.saveObjects(objects))
}

await syncObjects()
