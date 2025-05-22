export interface ReleaseNotesEntry {
  date: string
  funcVersion: string
  dataVersion: string
  content: string
  isMajor: boolean
}

export type ReleaseNotes = ReleaseNotesEntry[]
