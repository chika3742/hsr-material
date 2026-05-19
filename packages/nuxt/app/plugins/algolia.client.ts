import type { SearchClient } from "@algolia/client-search"
import { searchClient } from "@algolia/client-search"

export default defineNuxtPlugin(({ $config }) => {
  return {
    provide: {
      algoliaClient: searchClient($config.public.algolia.appId, $config.public.algolia.apiKey) as SearchClient,
    },
  }
})
