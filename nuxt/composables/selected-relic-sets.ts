import type {RelicSet} from "~/types/data/relics"

export const useSelectedRelicSets = () => {
  return useState("selectedRelicSets", () => new Set<RelicSet>())
}
