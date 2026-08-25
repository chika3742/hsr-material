export interface ReleaseNotesEntry {
  date: string
  /** @deprecated use {@link version}. */
  funcVersion?: string
  /** @deprecated use {@link version}. */
  dataVersion?: string
  version?: string
  content: string
  isMajor: boolean
  isDataUpdateOnly?: boolean
}

export type ReleaseNotes = ReleaseNotesEntry[]
