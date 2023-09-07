declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $characterSelectItems: { id: string, image: string }[]
  }
}

export {}