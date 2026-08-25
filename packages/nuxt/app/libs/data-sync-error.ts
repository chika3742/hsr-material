export class DataSyncError extends Error {
  constructor(public readonly code: DataSyncError.ErrorCode, message?: string) {
    super(message)
    this.name = "DataSyncError"
  }
}

export namespace DataSyncError {
  export type ErrorCode =
    | "mnt/schema-ver-mismatch"
    | "mnt/conflict"
}
