/**
 * Find the first occurrence of each unique key in the array.
 * @param arr input array
 * @param keyCallback function to extract the key from each element
 */
const filterFirstOfEach = <T>(arr: T[], keyCallback: (e: T) => any, predicate: (e: T) => boolean): T[] => {
  const obj = {}

  for (const e of arr) {
    const key = keyCallback(e)
    if (!(key in obj) && predicate(e)) {
      obj[key] = e
    }
  }
  return Object.values(obj)
}

const skillTypeMap = {
  Normal: "basicAttack",
  BPSkill: "skill",
  Ultra: "ultimate",
  Talent: "talent",
  MemospriteSkill: "memospriteSkill",
  MemospriteTalent: "memospriteTalent",
}

export const onRequest: PagesFunction = async (context) => {
  if (context.request.method !== "GET") {
    return new Response(null, {
      status: 405,
    })
  }
  const reqUrl = new URL(context.request.url)
  if (!reqUrl.searchParams.has("uid")) {
    return new Response(null, {
      status: 400,
    })
  }

  const parsedApiUrl = `https://api.mihomo.me/sr_info_parsed/${reqUrl.searchParams.get("uid")}?lang=jp`
  const characterRanksUrl = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_min/jp/character_ranks.json"

  const fetchResults = await Promise.all([
    fetch(characterRanksUrl),
    fetch(parsedApiUrl, {
      headers: {
        "User-Agent": "HSR Material Data Sync/1.0.0 (hsr.matnote.app)",
      },
    }),
  ])

  if (!fetchResults.every(e => e.ok)) {
    return new Response(null, {
      status: 500,
    })
  }

  const characterRanks: {
    [id: string]: {
      level_up_skills: {
        id: string
        num: number
      }[]
    }
  } = await fetchResults[0].json()
  const apiResult = await fetchResults[1].json<any>()

  const response = {
    uid: apiResult.player.uid,
    nickname: apiResult.player.nickname,
    level: apiResult.player.level,
    characters: (apiResult.characters as any[]).map(character => ({
      nameJP: character.name === apiResult.player.nickname ? "開拓者" : character.name,
      variant: (character.element.id as string).toLowerCase(),
      level: character.level,
      rank: character.rank,
      promotion: character.promotion,
      equipment: character.light_cone
        ? {
            nameJP: character.light_cone.name,
            level: character.light_cone.level,
            promotion: character.light_cone.promotion,
          }
        : null,
      skills: filterFirstOfEach(character.skills as any[], e => e.type, e => Object.keys(skillTypeMap).includes(e.type)).map((skill) => {
        let originalLevel = skill.level
        let extraLevel = 0

        for (let i = 1; i <= character.rank; i++) {
          const rankEntry = characterRanks[`${character.id}${i.toString().padStart(2, "0")}`]
          rankEntry.level_up_skills.forEach((levelUpSkill) => {
            if (levelUpSkill.id === skill.id) {
              extraLevel += levelUpSkill.num
              originalLevel -= levelUpSkill.num
            }
          })
        }

        return {
          type: skillTypeMap[skill.type],
          iconUrl: `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${skill.icon}`,
          originalLevel,
          extraLevel,
        }
      }),
    })),
  }

  return new Response(JSON.stringify(response), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  })
}
