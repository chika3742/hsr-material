import {DateTime} from "luxon"
import releaseNotes from "~/assets/data/release-notes.yaml"
import {ReleaseNote} from "~/types/generated/release-notes.g"

export const getCurrentVersion = () => releaseNotes[0]

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
    str += ` (built at ${DateTime.fromISO(config.public.builtAt).toFormat("yyyy-MM-dd HH:mm:ss")})`
  }

  return str
}

export const getVersionText = (releaseNote: ReleaseNote) => {
  return `${releaseNote.funcVersion}_D${releaseNote.dataVersion}`
}
