import {RouteLocationRaw} from "vue-router"
import characters from "~/assets/data/characters.yaml"
import {Character, Path} from "~/types/generated/characters.g"
import {CharacterIdWithVariant} from "~/types/strings"

interface VSelectCharacter extends Omit<Character, "variants"> {
  variant?: Path | undefined
  idWithVariant: CharacterIdWithVariant
  route: RouteLocationRaw
  title: string
}

export default defineNuxtPlugin(({vueApp}) => {
  const vSelectCharacters: VSelectCharacter[] = []

  for (const character of characters) {
    if (character.variants) {
      for (const variant of character.variants) {
        const newObj = {...character}
        delete newObj.variants

        vSelectCharacters.push({
          ...newObj,
          title: tx(vueApp.$nuxt.$i18n, `characterNames.${newObj.id}_${variant.path}`),
          variant: variant.path,
          idWithVariant: `${newObj.id}_${variant.path}`,
          route: {path: `/characters/${newObj.id}`, query: {variant: variant.path}},
          materials: variant.materials,
        })
      }
    } else {
      vSelectCharacters.push({
        ...character,
        title: tx(vueApp.$nuxt.$i18n, `characterNames.${character.id}`),
        idWithVariant: character.id,
        route: {path: `/characters/${character.id}`},
      })
    }
  }

  return {
    provide: {
      vSelectCharacters,
    },
  }
})
