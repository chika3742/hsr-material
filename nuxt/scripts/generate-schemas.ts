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
  const inputPath = "./locales/ja.yaml"
  const outputDir = "./types/generated"

  const loc = parse(fs.readFileSync(path.resolve(inputPath)).toString())
  let locTs = "export type Loc =\n"

  const recursiveGenerate = (obj: Record<string, unknown>, prefix = "") => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") {
        locTs += `  | "${prefix}${k}"\n`
      } else {
        recursiveGenerate(v as Record<string, unknown>, `${prefix}${k}.`)
      }
    }
  }

  recursiveGenerate(loc)
  fs.writeFileSync(path.join(outputDir, "loc.g.ts"), locTs)
}
