declare module "vue" {
  export interface ComponentCustomProperties {
    $characterSelectItems: { id: string, name: string, image: string }[]
  }
}

export {}
