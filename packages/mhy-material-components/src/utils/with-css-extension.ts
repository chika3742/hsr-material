import * as fs from "fs/promises"

export const withCssExtension = async (path: string): Promise<string> => {
  if (await fs.access(`${path}.scss`).then(() => true).catch(() => false)) {
    return `${path}.scss`
  } else {
    return `${path}.css`
  }
}
