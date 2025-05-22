import type { RelicSet } from "~/types/data/src/decoration-sets"

export const useSelectedRelicSets = () => {
  return useState("selectedRelicSets", () => new Set<RelicSet>())
}
