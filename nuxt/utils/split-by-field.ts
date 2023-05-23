export const splitByField = <T extends Record<string, unknown>, U extends keyof T>(source: T[], field: U): T[][] => {
  const result: T[][] = []

  for (const element of source) {
    const existingGroup = result.find(group => group[0][field] === element[field])

    if (existingGroup) {
      existingGroup.push(element)
    } else {
      result.push([element])
    }
  }

  return result
}
