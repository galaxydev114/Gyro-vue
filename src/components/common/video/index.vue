<template>
  <div class="video-container"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <q-resize-observer @resize="resizeIframe"/>
    <c-video v-if="!isYoutube"
      ref="player"
      :key="src"
      :src="src"
      :controls="showControls"
      :autoplay="autoplay"
      :muted="autoplay"
      :noBorder="noBorder"
      width="100%"
      controlslist="nodownload"
      :thumbnail="thumbnail"
      @click.native.once="$emit('click')"
      @play="$emit('play')"
      @pause="$emit('pause')"
      @ended="$emit('ended')"
      @muted="$emit('muted')"
      @unmuted="$emit('unmuted')"
      @volumechange="$emit('volumechange', $event)"
      @video-initialized="providePlayerController"
    />
    <iframe v-else
      ref="player"
      id="youtube-video-player"
      :src="youtubeSrcUrl"
      :autoplay="autoplay"
      :muted="autoplay"
      frameborder="0"
      allowfullscreen="allowfullscreen"
      width="100%"
      :height="isYoutube ? '100%' : 'auto'"
    />
  </div>
</template>

<script>
import YouTubePlayer from 'youtube-player'

export default {
  components: {
    'c-video': () => import('@/components/video-player')
  },
  props: {
    src: {
      type: String,
      require: true
    },
    isYoutube: {
      type: Boolean,
      default: false
    },
    showControls: {
      type: Boolean,
      default: true
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
  computed: {
    youtubeSrcUrl () {
      const urlObj = new URL(this.src)
      urlObj.searchParams.set('enablejsapi', 1)
      urlObj.searchParams.set('controls', this.showControls ? 1 : 0)
      return urlObj.toString()
    }
  },
  data () {
    return {
      isMouseIn: false,
      ytPlayer: null
    }
  },
  methods: {
    resizeIframe () {
      const frame = this.$refs.player
      if (frame?.style && this.resizable) {
        frame.style.height = (frame.scrollWidth / 16 * 9) + 'px'
      }
    },
    onMouseOver () {
      this.isMouseIn = true
    },
    onMouseLeave () {
      this.isMouseIn = false
    },
    videoClick () {
      if (this.isMouseIn) {
        this.$emit('click')
      }
    },
    loadYoutubePlayer () {
      if (!this.isYoutube) return
      this.ytPlayer = YouTubePlayer('youtube-video-player', {
        playerVars: {
          controls: this.showControls ? 1 : 0,
          origin: window.location.href
        }
      })
      this.ytPlayer.on('stateChange', this.onPlayerStateChange)
    },
    onPlayerStateChange (event) {
      switch (event.data) {
        case window.YT.PlayerState.PLAYING:
          this.$emit('play')
          break
        case window.YT.PlayerState.PAUSED:
          this.$emit('pause')
          break
        case window.YT.PlayerState.ENDED:
          this.$emit('ended')
          break
        default:
          break
      }
    },
    seekTo (position) {
      if (!this.isYoutube) {
        this.$refs.player.currentTime = position
      } else if (this.ytPlayer) {
        this.ytPlayer.seekTo(position)
      }
    },
    providePlayerController (videoPlayerRef) {
      if (videoPlayerRef) {
        this.$emit('provide-controller', {
          play: () => videoPlayerRef.play(),
          pause: () => videoPlayerRef.pause()
        })
      }

      if (this.ytPlayer) {
        this.$emit('provide-controller', {
          play: () => this.ytPlayer.playVideo(),
          pause: () => this.ytPlayer.pauseVideo()
        })
      }
    }
  },
  mounted () {
    this.resizeIframe()
    window.addEventListener('blur', this.videoClick, { once: true })
    this.loadYoutubePlayer()
    this.providePlayerController()
  },
  watch: {
    src: 'loadYoutubePlayer'
  },
  beforeDestroy () {
    window.removeEventListener('blur', this.videoClick)
  }
}
</script>
