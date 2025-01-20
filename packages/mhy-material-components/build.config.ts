import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  hooks: {
    "mkdist:entry:options"(_ctx, _entry, options) {
      options.loaders = ["js", "vue"]
    },
  },
})
