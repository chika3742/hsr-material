import fs from "fs"
import path from "path"
import {compile} from "json-schema-to-typescript"
import {parse} from "yaml"
import {pascalCase} from "scule"
import type {JSONSchema4} from "json-schema"

export const generateSchemas = async() => {
  const inputDir = "./schemas"
  const outputDir = "./types/generated"

  const files = fs.readdirSync(inputDir)
  for (const fileName of files) {
    const name = pascalCase(fileName.split(".")[0])

    const result = await compile(parse(fs.readFileSync(path.resolve(inputDir, fileName)).toString()) as JSONSchema4, name, {
      bannerComment: "/* This file was generated. DO NOT edit by hand. */",
      cwd: inputDir,
    })
    fs.mkdirSync(outputDir, {recursive: true})
    const outputFilePath = path.join(outputDir, `${fileName.split(".")[0]}.g.ts`)
    fs.writeFileSync(outputFilePath, result)
  }
}
