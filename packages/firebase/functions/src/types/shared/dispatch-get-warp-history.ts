export interface DispatchGetWarpHistoryParams {
  authKey: string
  region: string
  lastIds: Record<string, string>
  untilLatestRare: boolean
}

export interface DispatchGetWarpHistoryResult {
  ticket: string
}
