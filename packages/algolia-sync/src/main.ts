import * as path from "path"
import * as dotenv from "dotenv"
import { searchClient } from "@algolia/client-search"
import type { Characters } from "../../nuxt/types/data/src/characters"
import type { Material } from "../../nuxt/types/data/src/materials"
import type { LightCone } from "../../nuxt/types/data/src/equipments"
import type { RelicSet } from "../../nuxt/types/data/src/decoration-sets"
import type { RelicPiece } from "../../nuxt/types/data/src/decoration-pieces"
import type { AlgoliaRecord } from "../../nuxt/types/algolia-record"
import algoliaConfig from "../../nuxt/algolia.json" assert { type: "json" }
import { loadYamlSync } from "./utils.js"

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

export const syncObjects = async () => {
  if (process.env.ALGOLIA_API_KEY === undefined) {
    throw new Error("Environment variable ALGOLIA_API_KEY is not defined")
  }

  const index = searchClient(algoliaConfig.appId, process.env.ALGOLIA_API_KEY)

  const localeJa = loadYamlSync<LocaleObject>(path.resolve(localeDir, "ja.yaml"))
  const localeEn = loadYamlSync<LocaleObject>(path.resolve(localeDir, "en.yaml"))

  const characters = loadYamlSync<Characters>(path.resolve(dataDir, "characters.yaml"))
  const lightCones = loadYamlSync<LightCone[]>(path.resolve(dataDir, "light-cones.yaml"))
  const materials = loadYamlSync<Material[]>(path.resolve(dataDir, "materials.yaml"))
  const relicSets = loadYamlSync<RelicSet[]>(path.resolve(dataDir, "relic-sets.yaml"))
  const relicPieces = loadYamlSync<RelicPiece[]>(path.resolve(dataDir, "relic-pieces.yaml"))

  const objects: AlgoliaRecord[] = [
    ...characters.map(e => ({
      objectID: e.id + "_character",
      itemId: e.id,
      name_ja: localeJa.characterNames[e.id],
      name_en: localeEn.characterNames[e.id],
      yomi: kataToHira(e.yomi),
      recordType: "character" as const,
      url: `/characters/${e.id}`,
      resultPriority: 0,
    })),
    ...lightCones.map(e => ({
      objectID: e.id + "_light-cone",
      itemId: e.id,
      name_ja: localeJa.lightConeNames[e.id],
      name_en: localeEn.lightConeNames[e.id],
      yomi: kataToHira(e.yomi),
      recordType: "light-cone" as const,
      url: `/light-cones/${e.id}`,
      resultPriority: 10,
    })),
    ...materials.map(e => ({
      objectID: e.id + "_material",
      itemId: e.id,
      name_ja: localeJa.materialNames[e.id],
      name_en: localeEn.materialNames[e.id],
      yomi: kataToHira(e.yomi),
      recordType: "material" as const,
      url: `/materials/${e.id}`,
      resultPriority: 10,
    })),
    ...relicSets.map(e => ({
      objectID: e.id + "_relic-set",
      itemId: e.id,
      name_ja: localeJa.relicSetTitles[e.id],
      name_en: localeEn.relicSetTitles[e.id],
      yomi: kataToHira(e.yomi),
      recordType: "relic-set" as const,
      url: `/relics/${e.id}`,
      resultPriority: 20,
    })),
    ...relicPieces.map(e => ({
      objectID: e.id + "_relic-piece",
      itemId: e.id,
      name_ja: localeJa.relicPieceNames[e.id],
      name_en: localeEn.relicPieceNames[e.id],
      yomi: kataToHira(e.yomi),
      recordType: "relic-piece" as const,
      url: `/relics/${e.setId}?expansion_index=1`,
      resultPriority: 20,
    })),
  ]

  console.log(await index.saveObjects({
    indexName: algoliaConfig.indexName,
    objects,
  }))
}
