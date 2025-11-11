/**
 * Splits an array of objects into an array of arrays of objects, grouped by a field.
 *
 * @param source Array to split
 * @param field Field to group by
 * @returns Array of arrays of objects
 */

export const splitByField = <T extends { [K in U]: unknown }, U extends keyof T>(source: T[], field: U): T[][] => {
  const result: T[][] = []

  for (const element of source) {
    const existingGroup = result.find(group => group[0]?.[field] === element[field])

    if (existingGroup) {
      existingGroup.push(element)
    } else {
      result.push([element])
    }
  }

  return result
}
