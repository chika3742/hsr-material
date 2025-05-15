import * as fs from "fs/promises"
import * as path from "path"
import { pascalCase } from "scule"
import { createGenerator, type Config } from "ts-json-schema-generator"

const typesDir = "./types/data/src"
const schemasDir = "./schemas"

export const generateSchemas = async () => {
  // skip if in production mode
  if (process.env.NODE_ENV === "production") {
    return
  }

  const files = await fs.readdir(typesDir)

  // make sure the destination directory exists
  await fs.mkdir(schemasDir, { recursive: true })

  const createdFileNames: string[] = []

  for (const fileName of files) {
    const tsPath = path.resolve(typesDir, fileName)

    const config: Config = {
      path: tsPath,
      type: pascalCase(path.basename(fileName, ".ts")),
      skipTypeCheck: true,
      encodeRefs: false,
    }

    const result = createGenerator(config).createSchema(config.type)

    const outputFileName = `${path.basename(fileName, ".ts")}.g.json`
    createdFileNames.push(outputFileName)
    const outputFilePath = path.join(schemasDir, outputFileName)

    await fs.writeFile(outputFilePath, JSON.stringify(result, null, 2))
  }

  // delete obsolete generated files
  for (const fileName of await fs.readdir(schemasDir)) {
    if (!createdFileNames.includes(fileName)) {
      await fs.rm(path.resolve(schemasDir, fileName))
    }
  }
}
