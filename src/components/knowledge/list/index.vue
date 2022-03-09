<template>
  <div class="videos-list">
    <n-video-item v-for="(item, index) in items"
                  :item="item"
                  :position="index"
                  :key="`video-${index}`"
                  @click="$emit('click', $event)"
                  @watched="$emit('watched', item)" />
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'n-video-item': () => import('@/components/knowledge/list/item')
  }
}
</script>

<style lang="scss">
.videos-list{
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}
</style>
