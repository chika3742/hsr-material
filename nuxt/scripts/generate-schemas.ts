import fs from "fs"
import path from "path"
import {compile} from "json-schema-to-typescript"
import {parse} from "yaml"
import {pascalCase} from "scule"

export const generateSchemas = async() => {
  const inputDir = "./schemas"
  const outputDir = "./types/generated"

  const files = fs.readdirSync(inputDir)
  for (const fileName of files) {
    const name = pascalCase(fileName.split(".")[0])
    const result = await compile(parse(fs.readFileSync(path.resolve(inputDir, fileName)).toString()), name, {
      bannerComment: "/* This file was generated. DO NOT edit by hand. */",
      cwd: inputDir,
    })
    fs.mkdirSync(outputDir, {recursive: true})
    const outputFilePath = path.join(outputDir, `${fileName.split(".")[0]}.g.ts`)
    fs.writeFileSync(outputFilePath, result)
  }
}

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
