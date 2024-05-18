<script lang="ts" setup>
definePageMeta({
  title: "bookmarks",
})
</script>

<template>
  <div>
    <client-only>
      <BookmarkList />
    </client-only>
  </div>
</template>

<style lang="sass" scoped>

</style>
