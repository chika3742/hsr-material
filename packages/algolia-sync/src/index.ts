import * as path from "path"
import * as dotenv from "dotenv"
import { searchClient } from "@algolia/client-search"
import type { Characters } from "../../nuxt/types/generated/characters.g"
import type { Materials } from "../../nuxt/types/data/materials"
import type { LightCones } from "../../nuxt/types/generated/light-cones.g"
import type { AlgoliaRecord } from "../../nuxt/types/algolia-record"
import algoliaConfig from "../../nuxt/algolia.json" assert { type: "json" }
import type { RelicPiece, RelicSet } from "../../nuxt/types/data/relics"
import { loadCsvSync, loadYamlSync } from "./utils.js"

type LocaleObject = {
  characterNames: Record<string, string>
  lightConeNames: Record<string, string>
  materialNames: Record<string, string>
  relicSetTitles: Record<string, string>
  relicPieceNames: Record<string, string>
}

if (process.env.NODE_ENV === "development") {
  dotenv.config()
}

const kataToHira = (input: string) => {
  return input.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

const dataDir = "../nuxt/assets/data"
const localeDir = "../nuxt/i18n/locales"

const syncObjects = async () => {
  if (process.env.ALGOLIA_API_KEY === undefined) {
    throw new Error("Environment variable ALGOLIA_API_KEY is not defined")
  }

  const index = searchClient(algoliaConfig.appId, process.env.ALGOLIA_API_KEY)

  const localeJa = loadYamlSync<LocaleObject>(path.resolve(localeDir, "ja.yaml"))
  const localeEn = loadYamlSync<LocaleObject>(path.resolve(localeDir, "en.yaml"))

  const characters = loadYamlSync<Characters>(path.resolve(dataDir, "characters.yaml"))
  const lightCones = loadYamlSync<LightCones>(path.resolve(dataDir, "light-cones.yaml"))
  const materials = loadCsvSync<Materials>(path.resolve(dataDir, "materials.csv"))
  const relicSets = loadCsvSync<RelicSet[]>(path.resolve(dataDir, "relic-sets.csv"))
  const relicPieces = loadCsvSync<RelicPiece[]>(path.resolve(dataDir, "relic-pieces.csv"))

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
    ...relicSets.map(e => ({
      objectID: e.id + "_relic-set",
      itemId: e.id,
      name_ja: localeJa.relicSetTitles[e.id],
      name_en: localeEn.relicSetTitles[e.id],
      i18nKey: `relicSetTitles.${e.id}`,
      yomi: kataToHira(e.yomi),
      recordType: "relic-set" as const,
      url: `/relics/${e.id}`,
    })),
    ...relicPieces.map(e => ({
      objectID: e.id + "_relic-piece",
      itemId: e.id,
      name_ja: localeJa.relicPieceNames[e.id],
      name_en: localeEn.relicPieceNames[e.id],
      i18nKey: `relicPieceNames.${e.id}`,
      yomi: kataToHira(e.yomi),
      recordType: "relic-piece" as const,
      url: `/relics/${e.setId}?expansion_index=1`,
    })),
  ]

  console.log(await index.saveObjects({
    indexName: algoliaConfig.indexName,
    objects,
  }))
}

await syncObjects()
