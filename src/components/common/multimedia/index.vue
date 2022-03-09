<template>
  <img v-if="isImageUrl(src)" :src="src" alt="" style="height: auto; width: 100%;" />
  <n-video
    class="multimedia"
    ref="videoPlayer"
    v-else-if="isYoutubeUrl(src) || isVideoUrl(src)"
    :isYoutube="isYoutubeUrl(src)"
    :src="src"
    :autoplay="autoplay"
    :thumbnail="thumbnail"
    :resizable="resizable"
    :noBorder="noBorder"
    @click="$emit('click')"
    @play="onPlay"
    @pause="onPause"
    @ended="onEnded"
    @muted="onMuted"
    @unmuted="onUnmuted"
    @volumechange="onVolumeChange"
    @provide-controller="$emit('provide-controller', $event)"
  />
</template>

<script>
import urlTypes from '@/mixins/urlType.mixins'
import Video from '@/components/common/video'
import { debounce } from 'quasar'

export default {
  props: {
    src: {
      type: String,
      require: true
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    thumbnail: {
      type: String
    },
    resizable: {
      type: Boolean,
      default: true
    },
    noBorder: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'n-video': Video
  },
  mixins: [urlTypes],

  methods: {
    onPlay () {
      this.trackAction('Video: Play', { src: this.src })
      this.$emit('play')
    },
    onPause () {
      this.trackAction('Video: Pause', { src: this.src })
      this.$emit('pause')
    },
    onEnded () {
      this.trackAction('Video: Ended', { src: this.src })
      this.$emit('ended')
    },
    onMuted () {
      this.trackAction('Video: Muted', { src: this.src })
      this.$emit('muted')
    },
    onUnmuted () {
      this.trackAction('Video: Unmuted', { src: this.src })
      this.$emit('unmuted')
    },
    onVolumeChange: debounce(function (e) {
      this.trackAction('Video: Change Volume', { src: this.src, volume: e })
    }, 500)
  }
}
</script>
