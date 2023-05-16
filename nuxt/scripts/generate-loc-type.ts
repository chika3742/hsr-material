import fs from "fs"
import path from "path"
import {parse} from "yaml"

export const generateLocType = () => {
  const outputDir = "./types/generated"

  const locJa = parse(fs.readFileSync(path.resolve("./locales/ja.yaml")).toString())
  const locEn = parse(fs.readFileSync(path.resolve("./locales/en.yaml")).toString())
  const missingKeys: string[] = []
  let locTs = "export type Loc =\n"

  const getDescendantProp = (obj: Record<string, any>, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj)
  }

  const recursiveGenerate = (obj: Record<string, unknown>, prefix = "") => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") {
        locTs += `  | "${prefix}${k}"\n`
        if (!getDescendantProp(locEn, `${prefix}${k}`)) {
          missingKeys.push(`${prefix}${k}`)
        }
      } else {
        recursiveGenerate(v as Record<string, unknown>, `${prefix}${k}.`)
      }
    }
  }

  recursiveGenerate(locJa)
  fs.writeFileSync(path.join(outputDir, "loc.g.ts"), locTs)

  if (missingKeys.length > 0) {
    console.warn("Missing EN translations:", missingKeys.join(", "))
  }
}
