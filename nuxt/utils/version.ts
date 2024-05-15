import {DateTime} from "luxon"
import releaseNotes from "~/assets/data/release-notes.yaml"
import type {ReleaseNote} from "~/types/generated/release-notes.g"

/**
 * Gets current version.
 *
 * @returns Release note of current version
 */
export const getCurrentVersion = () => releaseNotes[0]

/**
 * @returns e.g. `v1.0.0_D1.0.0` when prod,
 *   `v1.0.0-dev.abcdefg_D1.0.0 (built at 2023/01/23 12:34:56)` when dev
 */
export const getCurrentVersionText = () => {
  const config = useRuntimeConfig()
  const cv = getCurrentVersion()
  let str = ""

  str += `v${cv.funcVersion}`
  if (!config.public.isProdBranch) {
    str += `-dev.${config.public.pagesCommitSha.substring(0, 7)}`
  }
  str += `_D${cv.dataVersion}`
  if (!config.public.isProdBranch) {
    str += ` (built at ${DateTime.fromISO(config.public.builtAt).toFormat("yyyy/MM/dd HH:mm:ss")})`
  }

  return str
}

/**
 * Generates version string from {@link ReleaseNote}.
 *
 * @param releaseNote Release note entry
 * @returns e.g. `v1.0.0_D1.0.0`
 */
export const getVersionText = (releaseNote: ReleaseNote) => {
  return `v${releaseNote.funcVersion}_D${releaseNote.dataVersion}`
}
