import { mkdirSync, readFileSync, writeFileSync } from "fs"
import { join, resolve } from "path"
import { parse } from "yaml"

type LocObject = { [key: string]: string | LocObject }

export const generateLocType = () => {
  const outputDir = "./types/generated"

  const locJa = parse(readFileSync(resolve("./i18n/locales/ja.yaml")).toString()) as LocObject
  const locEn = parse(readFileSync(resolve("./i18n/locales/en.yaml")).toString()) as LocObject
  const missingKeys: string[] = []
  let locTs = "export type Loc =\n"

  const getPropByDotNotation = (obj: LocObject, path: string) => {
    let result: string | LocObject | undefined = obj
    for (const part of path.split(".")) {
      if (typeof result === "object") {
        result = result[part]
      } else {
        return undefined
      }
    }

    return result
  }

  const recursiveGenerate = (obj: Record<string, unknown>, prefix = "") => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") {
        locTs += `  | "${prefix}${k}"\n`
        if (!getPropByDotNotation(locEn, `${prefix}${k}`)) {
          missingKeys.push(`${prefix}${k}`)
        }
      } else {
        recursiveGenerate(v as Record<string, unknown>, `${prefix}${k}.`)
      }
    }
  }

  recursiveGenerate(locJa)

  locTs += "  | string & {}\n"

  mkdirSync(outputDir, { recursive: true })
  writeFileSync(join(outputDir, "loc.g.ts"), locTs)

  if (missingKeys.length > 0) {
    console.warn("Missing EN translations:", missingKeys.join(", "))
  }
}
