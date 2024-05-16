import * as fs from "fs"
import * as jsYaml from "js-yaml"
import * as csvParse from "csv-parse/sync"

export const loadYamlSync = <T>(path: string): T => {
  return jsYaml.load(fs.readFileSync(path, "utf-8")) as T
}

export const loadCsvSync = <T extends Array<unknown>>(path: string): T => {
  return csvParse.parse(fs.readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, cast: true }) as T
}
