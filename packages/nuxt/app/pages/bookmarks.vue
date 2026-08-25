<script lang="ts" setup>
usePageTitle(tx("pageTitles.bookmarks"))
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
