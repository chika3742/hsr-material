export const splitByField = (source: Record<string, unknown>[], field: string) => {
  const result: Record<string, unknown>[][] = []

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
