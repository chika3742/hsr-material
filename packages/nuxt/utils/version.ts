import { DateTime } from "luxon"
import releaseNotes from "~/assets/data/release-notes.yaml"
import type { ReleaseNotesEntry } from "~/types/data/src/release-notes"

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

  if (cv.version) {
    str += `v${cv.version}`
  } else {
    str += `v${cv.funcVersion}`
  }

  if (!config.public.isProdBranch) {
    str += `-dev.${config.public.pagesCommitSha.substring(0, 7)}`
  }
  if (cv.dataVersion) {
    str += `_D${cv.dataVersion}`
  }
  if (!config.public.isProdBranch) {
    str += ` (built at ${DateTime.fromISO(config.public.builtAt).toFormat("yyyy/MM/dd HH:mm:ss")})`
  }

  return str
}

/**
 * Generates version string from {@link ReleaseNotesEntry}.
 *
 * @param releaseNote Release note entry
 * @returns e.g. `v1.0.0_D1.0.0`
 */
export const getVersionText = (releaseNote: ReleaseNotesEntry) => {
  return `v${releaseNote.funcVersion}_D${releaseNote.dataVersion}`
}
