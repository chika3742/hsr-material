import {DateTime, Duration} from "luxon"

export const getTpFullReplenishmentTime = (tpCount: number, baseTime: DateTime): DateTime | null => {
  if (tpCount >= 180 || tpCount < 0) { return null }

  const added = baseTime.plus({minutes: (180 - tpCount) * 6})
  if (added.diffNow().milliseconds < 0) { return null }

  return added
}

export const getTpReplenishmentRemainingTime = (tpCount: number, baseTime: DateTime): Duration | null => {
  const tpFullReplenishmentTime = getTpFullReplenishmentTime(tpCount, baseTime)
  if (tpFullReplenishmentTime === null) { return null }

  return tpFullReplenishmentTime.diffNow()
}
