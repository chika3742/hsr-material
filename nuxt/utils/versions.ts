import {DateTime} from "luxon"

/**
 * Gets current version.
 *
 * @returns {@link ReleaseNote} of current version
 */
export const getCurrentVersion = () => {
  const config = useRuntimeConfig()
  return `${config.public.funcVersion}_${config.public.dataVersion}`
}

/**
 * @returns {string} e.g. `v1.0.0_D1.0.0` when prod,
 *   `v1.0.0-dev.abcdefg_D1.0.0 (built at 2023/01/23 12:34:56)` when dev
 */
export const getCurrentVersionText = () => {
  const config = useRuntimeConfig()
  let version = getCurrentVersion()

  if (!config.public.isProdBranch) {
    version += `-dev.${config.public.pagesCommitSha.substring(0, 7)}`
    version += ` (built at ${DateTime.fromISO(config.public.builtAt).toFormat("yyyy/MM/dd HH:mm:ss")})`
  }

  return version
}
