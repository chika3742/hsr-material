import algoliasearch from "algoliasearch"
import * as dotenv from "dotenv"
import * as path from "path"
import {Characters} from "../../nuxt/types/generated/characters.g"
import {loadCsvSync, loadYamlSync} from "./utils.js"
import {Materials} from "../../nuxt/types/data/materials"
import {LightCones} from "../../nuxt/types/generated/light-cones.g"
import {AlgoliaRecord} from "../../nuxt/types/algolia-record"
import algoliaConfig from "../../nuxt/algolia.json" assert {type: "json"}

type LocaleObject = {
  characterNames: Record<string, string>
  lightConeNames: Record<string, string>
  materialNames: Record<string, string>
}

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

  const objects: AlgoliaRecord[] = [
    ...characters.map(e => ({
      objectID: e.id + "_character",
      itemId: e.id,
      name_ja: localeJa.characterNames[e.id],
      name_en: localeEn.characterNames[e.id],
      i18nKey: `characterNames.${e.id}`,
      yomi: kataToHira(e.yomi),
      recordType: "character" as const,
      url: `/characters/${e.id}`,
    })),
    ...lightCones.map(e => ({
      objectID: e.id + "_light-cone",
      itemId: e.id,
      name_ja: localeJa.lightConeNames[e.id],
      name_en: localeEn.lightConeNames[e.id],
      i18nKey: `lightConeNames.${e.id}`,
      yomi: kataToHira(e.yomi),
      recordType: "light-cone" as const,
      url: `/light-cones/${e.id}`,
    })),
    ...materials.map(e => ({
      objectID: e.id + "_material",
      itemId: e.id,
      name_ja: localeJa.materialNames[e.id],
      name_en: localeEn.materialNames[e.id],
      i18nKey: `materialNames.${e.id}`,
      yomi: kataToHira(e.yomi),
      recordType: "material" as const,
      url: `/materials/${e.id}`,
    })),
  ]

  console.log(await index.saveObjects(objects))
}

await syncObjects()
