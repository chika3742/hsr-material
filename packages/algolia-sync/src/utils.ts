import * as fs from "fs"
import * as jsYaml from "js-yaml"

export const loadYamlSync = <T>(path: string): T => {
  return jsYaml.load(fs.readFileSync(path, "utf-8")) as T
}
