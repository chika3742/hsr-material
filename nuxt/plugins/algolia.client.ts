import algoliasearch from "algoliasearch/lite"

export default defineNuxtPlugin(({$config}) => {
  return {
    provide: {
      algoliaClient: algoliasearch($config.public.algolia.appId, $config.public.algolia.apiKey).initIndex($config.public.algolia.indexName),
    },
  }
})
