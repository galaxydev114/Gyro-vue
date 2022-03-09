<template>
  <div class="wrapper q-mt-md" ref="masteryWrapper">
    <q-resize-observer @resize="resizeHandler"/>
      <item-progress
        v-for="d in 7" ref="masteryVals"
        v-show="d <= available"
        :key="`day-${d}`"
        size="55px"
        :day="d"
        :isDone="completedMasteriesNum >= d"
      >
        Day {{ d }}
      </item-progress>
  </div>
</template>

<script>
export default {
  props: {
    completedMasteriesNum: {
      type: Number,
      default: 0
    }
  },
  components: {
    'item-progress': () => import('@/components/common/item-progress')
  },
  updated () {
    if (this.$refs.masteryVals) {
      this.$refs.masteryVals[Math.min(this.completedMasteriesNum, 6)].$el.scrollIntoView()
    }
  },
  data () {
    return {
      available: 7
    }
  },
  methods: {
    resizeHandler (event) {
      const { width } = event
      this.available = (width / 55).toFixed()
    }
  },
  mounted () {
    const masteryWrapper = this.$refs.masteryWrapper
    this.available = (masteryWrapper.offsetWidth / 55).toFixed()
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
}
</style>
