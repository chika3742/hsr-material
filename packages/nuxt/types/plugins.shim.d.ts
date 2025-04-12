declare module "vue" {
  export interface ComponentCustomProperties {
    $characterSelectItems: { id: string, image: string }[]
  }
}

export {}
