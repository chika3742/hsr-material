export type GetWarpHistoryErrorCode =
  | "authKeyExpired"
  | "authKeyInvalid"
  | "tooManyRequests"
  | "internal"

export class GetWarpHistoryError extends Error {
  constructor(
    public readonly code: GetWarpHistoryErrorCode,
    public readonly message: string,
  ) {
    super(message)
  }
}
