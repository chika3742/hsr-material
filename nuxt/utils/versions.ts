import releaseNotes from "assets/data/release-notes.yaml"
import {ReleaseNote} from "~/types/generated/release-notes.g"

export const getCurrentVersion = () => releaseNotes[0]

export const getCurrentVersionText = () => {
  const config = useRuntimeConfig()
  const cv = getCurrentVersion()
  return `v${cv.funcVersion}${!config.public.isProdBranch ? `_${config.public.pagesCommitSha.substring(0, 7)}` : ""}_D${cv.dataVersion} (${releaseNotes[0].date})`
}

export const getVersionText = (releaseNote: ReleaseNote) => {
  return `${releaseNote.funcVersion}_D${releaseNote.dataVersion}`
}
