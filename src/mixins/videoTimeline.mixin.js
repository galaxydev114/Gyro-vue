import clamp from '@/util/clamp'

export default {
  props: {
    totalTime: {
      type: Number,
      require: true
    },
    currentTime: {
      type: Number,
      require: true
    },
    storyboard: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      hoverPosition: 0,
      hoverPercent: 0,
      hoverTime: 0
    }
  },

  computed: {
    timeProgress () {
      const progress = this.currentTime / this.timePercent
      return clamp(progress, 0, 100)
    },
    timePercent () {
      return this.totalTime ? this.totalTime / 100 : 0
    },

    hoverThumbnail () {
      if (!this.storyboard) {
        return null
      }

      let currentTile
      for (const tile of this.storyboard.tiles) {
        if (tile.start > this.hoverTime) {
          break
        }
        currentTile = tile
      }
      if (!currentTile) {
        return null
      }

      return {
        url: this.storyboard.url,
        x: currentTile.x,
        y: currentTile.y,
        width: this.storyboard.tile_width,
        height: this.storyboard.tile_height
      }
    }
  },

  methods: {
    setTime (event) {
      const targetFactor = event.offsetX / event.target.clientWidth
      const targetTime = clamp(targetFactor * this.totalTime, 0, this.totalTime) || this.currentTime
      this.$emit('seek', targetTime)
    },
    timeLineHover (event) {
      const { offsetX, target } = event
      const full = target.offsetWidth
      const secondsPerPixel = this.totalTime / full
      this.hoverTime = secondsPerPixel * offsetX
      this.hoverPosition = offsetX
      this.hoverPercent = offsetX / full * 100
    },
    timeLineOut () {
      this.hoverTime = 0
      this.hoverPosition = 0
      this.hoverPercent = 0
    }
  }
}
