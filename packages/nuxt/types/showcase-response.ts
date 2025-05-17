export interface ShowcaseResponseCharacter {
  nameJP: string
  variant: string
  level: number
  rank: number
  promotion: number
  equipment: {
    nameJP: string
    level: number
    promotion: number
  } | null
  skills: {
    type: string
    iconUrl: string
    originalLevel: number
    extraLevel: number
  }[]
}

export interface ShowcaseResponse {
  uid: string
  nickname: string
  level: number
  characters: ShowcaseResponseCharacter[]
}
