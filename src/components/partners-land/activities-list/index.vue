<template>
<div>
  <activities-list-item
    v-for="(item, idx) in items"
    :thumbnail="item.thumbnailUrl"
    :title="item.title"
    :content="item.html"
    :badgeText="item.tagText"
    :badgeColor="item.tagColor"
    :isPlay="item.hasVideo"
    :name="name"
    :contentVideoURL="item.videoURL"
    :locked="!unlocked && item.locked"
    :shouldShowCTA="!!item.ctaUrl"
    :open="open(`active-${idx}`)"
    @click="toggleActive(`active-${idx}`, item.locked, item)"
    @clickCta="$emit('clickCta', item)"
    :key="idx"
  >
  </activities-list-item>
</div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    unlocked: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    }
  },
  components: {
    'activities-list-item': () => import('@/components/partners-land/activities-list/_item')
  },
  data () {
    return {
      active: null
    }
  },
  methods: {
    toggleActive (key, locked, item) {
      if (this.active === key) {
        this.active = null
      } else if (!locked || this.unlocked) {
        this.active = key
        this.$emit('clickExpandActivity', item)
      } else if (locked) {
        this.$emit('clickLockActivity', item)
      }
    },
    open (key) {
      return this.active === key
    }
  }
}
</script>
