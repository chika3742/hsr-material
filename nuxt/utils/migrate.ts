export const migrate = (data: any, oldVersion: number, newVersion: number) => {
  if (oldVersion === 1 && newVersion > 1) {
    oldVersion++
  }

  return data
}
