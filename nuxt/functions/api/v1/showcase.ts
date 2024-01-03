/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const onRequest: PagesFunction = async(context) => {
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
      skills: (character.skills as any[]).slice(0, 4).map((skill) => {
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
          type: (() => {
            switch (skill.type) {
              case "Normal":
                return "basicAttack"
              case "BPSkill":
                return "skill"
              case "Ultra":
                return "ultimate"
              case "Talent":
                return "talent"
            }
          })(),
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
