import releaseNotes from "assets/data/release-notes.yaml"
import {ReleaseNote} from "~/types/generated/release-notes.g"

export const getCurrentVersion = () => {
  return getVersionText(releaseNotes[0])
}

export const getCurrentVersionText = () => {
  const currentVersion = getCurrentVersion()
  return `v${currentVersion} (${releaseNotes[0].date})`
}

export const getVersionText = (releaseNote: ReleaseNote) => {
  return `${releaseNote.funcVersion}_D${releaseNote.dataVersion}`
}
