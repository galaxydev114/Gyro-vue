<template>
  <div class="video-player"
       :class="{
        'video-player--pseudo-full': showFull,
        'video-player--transparent': isTransparent,
        'video-player--no-border': noBorder,
       }"
       @mousemove="showNav(); showControls = true"
       @mouseleave="hideNav(); showControls = false"
       tabindex="0"
       @keydown.esc="exitFull"
       @keydown.space.prevent="togglePlay(); showNav()"
       @click="showControls = true"
       v-scroll="onScroll"
  >
    <div class="video-player__video-container">
      <q-resize-observer @resize="({ height }) => { playerHeight = height }" />
      <video
        style="width: 100%; cursor: pointer;"
        oncontextmenu="return false;"
        @click="togglePlay"
        ref="videoPlayer"
        v-video-src="src"
        :autoplay="autoplay"
        :muted="autoplay"
        controlslist="nodownload"
        :poster="thumbnail"
        @timeupdate="handleTimeUpdate"
        @waiting="onWait"
        @playing="onResume"
        @durationchange="updateDuration"
        @play="isPlay = true; $emit('play')"
        @pause="isPlay = false; $emit('pause')"
        @ended="isPlay = false; $emit('ended')"
        @volumechange="onVolumeChange"
        @loadedmetadata="checkOptions"
        @enterpictureinpicture="trackShort('Enter PIP'); isInPip = true"
        @leavepictureinpicture="trackShort('Exit PIP'); isInPip = false"
      />

      <options top v-if="!availableOnDesktop"
        :dropName="dropName"
        :playerHeight="playerHeight"
        v-bind="options"
        :qualityOptions="hasQuality ? ['auto', 'high', 'medium', 'low'] : []"
        :hasSubtitles="hasSubtitles"
        @hide="toggleDropdown('options')"
        @select="changeOptions"
        @click="toggleDropdown('options')"
      />
    </div>

    <div class="video-player__bottom"
         :class="{'video-player__bottom--active': showNavigation}"
         @click="hideControls()"
         @mousedown="navLock = true"
         @mouseup="navLock = false"
    >
      <timeline
        v-if="sourceDuration && rawCurrentSourceTimestamp"
        :transparent="isTransparent"
        :total-time="sourceDuration"
        :current-time="rawCurrentSourceTimestamp"
        :storyboard="storyboardMetadata"
        @seek="seekTo"
      />
      <div class="video-player__video-navigation">
        <controls :full="isTransparent"
                  :show-repeat="showRepeat"
                  :isFullCover="availableOnDesktop"
                  :isPlay="isPlay"
                  :show="showControlsOnMobile || showControls"
                  @repeat="repeat"
                  @play="playVideo"
                  @pause="pauseVideo"
        />
        <div class="flex items-center justify-between" style="width: 100px">
          <c-icon width="20px" height="16px" class="icon icon--white float-left" icon="volume_mute"
                  v-if="soundLevel === 0 || isMuted" @click="setMuted(false)"/>
          <c-icon width="18px" height="16px" class="icon icon--white float-left" icon="volume_low"
                  v-else-if="soundLevel < 0.45" @click="setMuted(true)"/>
          <c-icon width="20px" height="16px" class="icon icon--white float-left" icon="volume_up"
                  v-else @click="setMuted(true)"/>
          <div style="width:60px;" class="float-right">
            <q-slider
              v-model="soundLevel"
              :min="0"
              :max="1"
              :step="0.02"
              :color="isMuted ? 'gray' : 'pink'"
              @pan="navLock = $event === 'start'"
            />
          </div>
        </div>
        <div class="time q-ml-lg">
          {{ rawCurrentSourceTimestamp | time }} / {{ sourceDuration | time }}
        </div>
        <div class="q-ml-auto row items-center options-icons">
          <div v-if="false" class="">
            <c-icon icon="share" width="16px" class="icon"/>
          </div>
          <div class="q-ml-lg" v-if="availableOnDesktop">
            <options :dropName="dropName"
                     :playerHeight="playerHeight"
                     :speed="options.speed"
                     :quality="options.quality"
                     :subtitle="options.subtitle"
                     :qualityOptions="hasQuality ? ['auto', 'high', 'medium', 'low'] : []"
                     @hide="toggleDropdown('options')"
                     @select="changeOptions"
                     @click="toggleDropdown('options')"/>
          </div>
          <div class="q-ml-lg"
               @click="setSubtitles(!options.subtitle)"
               v-if="availableOnDesktop && hasSubtitles">
            <c-icon icon="subtitle"
                    width="18px"
                    class="icon"
                    :class="{'green-border': options.subtitle}"/>
          </div>
          <div class="q-ml-lg" v-if="availableOnDesktop">
            <c-icon icon="pip" width="18px" class="icon" @click="trackShort('Click PIP icon'); togglePip(true)"
                    :class="{'green-border': isInPip}"/>
          </div>
          <div class="q-ml-lg" @click="toggleSize">
            <c-icon icon="videoFull" width="16px" class="icon" v-if="!showFull"/>
            <c-icon icon="videoMin" width="16px" class="icon" v-else/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'quasar'
import mux from 'mux-embed'
import timeFilter from '@/filters/time.filter'
import videoStoryboardMixin from '@/mixins/videoStoryboard.mixin'

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    thumbnail: {
      type: String,
      default: ''
    },
    transparent: {
      type: Boolean,
      default: true
    },
    noBorder: {
      type: Boolean,
      default: false
    }
  },
  components: {
    timeline: () => import('@/components/video-player/_timeline'),
    options: () => import('@/components/video-player/_options'),
    controls: () => import('@/components/video-player/_controls')
  },
  mixins: [videoStoryboardMixin],
  data () {
    return {
      showControls: false,
      playerHeight: undefined,
      isPlay: false,
      isLoading: false, // whether or not the video is really playing or stuck buffering
      rawCurrentSourceTimestamp: 0,
      sourceDuration: 0,
      soundLevel: 1,
      isMuted: undefined,
      isInPip: false,
      hasQuality: undefined,
      dropName: '',
      showSub: '',
      options: {
        speed: '1',
        subtitle: true,
        quality: 'auto'
      },
      nav: true,
      navLock: false, // true when interacting with video ui e.g. volume slider
      controlsInterval: null
    }
  },
  mounted () {
    if (this.$refs.videoPlayer) {
      const initTime = Date.now()
      mux.monitor(this.$refs.videoPlayer, {
        debug: false,
        data: {
          env_key: process.env.MUX_ENV_KEY,
          // Metadata fields
          player_name: 'Main Player',
          player_init_time: initTime,
          video_id: this.src
        }
      })
      this.$emit('video-initialized', this.$refs.videoPlayer)
    }
  },
  methods: {
    hideDropDown (e) {
      this.dropName = null
      this.showSub = null
    },
    toggleDropdown (type) {
      if (this.dropName === type) {
        this.dropName = null
        return
      }
      this.dropName = type
    },
    playVideo () {
      this.$refs.videoPlayer.play()
      this.hideControls()
    },
    repeat () {
      this.rawCurrentSourceTimestamp = 0
      this.playVideo()
      this.hideControls()
    },
    pauseVideo () {
      this.$refs.videoPlayer.pause()
      this.isPlay = false
      this.hideControls()
    },
    togglePlay () {
      if (this.isPlay) {
        this.pauseVideo()
      } else {
        this.playVideo()
      }
    },
    onWait () {
      this.isLoading = true
    },
    onResume () {
      if (!this.sourceDuration) {
        this.sourceDuration = this.$refs.videoPlayer.duration
      }

      this.isPlay = true
      this.isLoading = false
      this.isMuted = this.$refs.videoPlayer.muted
    },
    checkOptions (e) {
      this.hasQuality = Boolean(e.target.__hls?.levels)
    },
    updateDuration () {
      this.sourceDuration = this.$refs.videoPlayer.duration
    },
    smallJumpBack () {
      const targetTime = Math.max(0, this.rawCurrentSourceTimestamp - 5)
      this.seekTo(targetTime, true)
    },
    seekTo (position, overrideAdmin = false) {
      this.$refs.videoPlayer.currentTime = position
      this.rawCurrentSourceTimestamp = position
      this.playVideo()
    },
    handleTimeUpdate () {
      this.rawCurrentSourceTimestamp = this.$refs.videoPlayer?.currentTime
    },

    onVolumeChange (e) {
      if (!e.target) return

      if (this.isMuted === undefined ||
        this.isMuted !== e.target.muted) {
        this.isMuted = e.target.muted
        if (this.isMuted) {
          return this.$emit('muted')
        } else {
          return this.$emit('unmuted')
        }
      }

      this.$emit('volumechange', e.target.volume)
    },
    setMuted (value) {
      this.$refs.videoPlayer.muted = value
    },

    toggleSize () {
      if (!this.showFull) {
        this.trackShort('Click full screen')
        this.enterFull()
      } else {
        this.exitFull()
      }
    },
    enterFull () {
      this.$router.push({ query: { ...this.$route.query, fullscreen: 1 } })
    },
    exitFull () {
      if (!this.showFull) {
        return
      }
      this.$router.back()
    },
    changeOptions (opt) {
      this.changeVideoFrameRate(Number(opt.speed))
      this.setSubtitles(opt.subtitle)
      this.changeQuality(opt.quality)
      this.options = opt
    },
    changeVideoFrameRate (speed) {
      if (Number(this.options.speed) === speed) return
      this.$refs.videoPlayer.playbackRate = speed
      this.trackAction('Video: Change playback speed', { src: this.src, speed })
    },
    changeQuality (qualityId) {
      if (this.options.quality === qualityId) return
      const hls = this.$refs.videoPlayer?.__hls
      if (!hls) return
      const numLevels = hls.levels.length
      switch (qualityId) {
        case 'auto':
          hls.currentLevel = -1
          break
        case 'high':
          hls.currentLevel = numLevels - 1
          break
        case 'medium':
          hls.currentLevel = Math.floor(numLevels / 2)
          break
        case 'low':
          hls.currentLevel = 0
          break
      }
      this.trackAction('Video: Change playback quality', { src: this.src, quality: qualityId })
    },
    setSubtitles (val) {
      if (this.options.subtitle === val) return
      this.options.subtitle = val
    },

    togglePip (notifyError = true) {
      const player = this.$refs.videoPlayer
      if (!player) return
      if (player.requestPictureInPicture) {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture()
        } else {
          player.requestPictureInPicture()
            .catch(() => notifyError || this.$q.notify({
              type: 'negative',
              message: 'Couldn\'t switch to Picture-in-Picture mode now, try again later'
            }))
        }
      } else {
        return notifyError || this.$q.notify({
          type: 'negative',
          message: 'Picture-in-Picture mode isn\'t supported by your browser'
        })
      }
    },

    onScroll: debounce(function (e) {
      if (!this.isPlay) return
      if (!this.isInPip && this.$refs.videoPlayer?.getBoundingClientRect()?.top < 0) {
        // NOTE: only works if the user has clicked on the page somewhere since
        // the time this page loaded or the last time this function was called
        this.togglePip()
        this.trackShort('Scroll out of frame')
      }
    }, 100),

    trackShort (eventName) {
      this.trackAction('Video: ' + eventName, { src: this.src })
    },
    hideControls () {
      clearTimeout(this.controlsInterval)
      if (this.$q.screen.lt.sm) {
        clearTimeout(this.controlsInterval)
        this.controlsInterval = setTimeout(() => {
          this.showControls = false
        }, 2000)
      }
    },
    showNav () {
      this.nav = true
      this.navLock = false
      this.hideNavDelayed()
    },
    hideNavDelayed: debounce(function () {
      this.hideNav()
    }, 2000),
    hideNav () {
      this.nav = this.navLock
    }
  },
  watch: {
    src: {
      handler: function (src) {
        // download mux storyboard if available
        this.loadStoryboard(src)
      },
      immediate: true
    },
    soundLevel (val) {
      this.setMuted(false)
      this.$refs.videoPlayer.volume = val
    }
  },
  computed: {
    availableOnDesktop () {
      return this.$q.screen.gt.xs
    },
    hasSubtitles () {
      return false
    },
    isTransparent () {
      return this.transparent && this.$q.screen.gt.xs
    },
    showFull () {
      return Boolean(this.$route.query.fullscreen)
    },
    showNavigation () {
      return this.nav || this.rawCurrentSourceTimestamp === 0 || this.rawCurrentSourceTimestamp >= this.sourceDuration
    },
    showRepeat () {
      return !!(this.sourceDuration && this.rawCurrentSourceTimestamp >= this.sourceDuration)
    },
    showControlsOnMobile () {
      return !!(this.rawCurrentSourceTimestamp === 0 && this.$q.screen.lt.sm)
    }
  },
  filters: {
    time: timeFilter
  },

  destroyed () {
    if (document.pictureInPictureElement && document.exitPictureInPicture) {
      document.exitPictureInPicture()
    }
  }
}
</script>

<style lang="scss">
.video-player {
  $root: &;
  position: relative;
  border-radius: 6px;
  background-size: cover;
  box-shadow: 0 4px 8px rgba(#000, .2);
  background-color: $dark-sec;
  border: 1.5px solid $soft-tone;
  transform: translateY(0px);
  overflow: hidden;
  height: 100%;

  &--no-border{
    border-radius: unset;
    border: unset;
  }

  &:focus {
    outline: none;
    border-color: rgba($gray-violet, .4);
  }

  &--transparent {
    padding-bottom: 0;
    #{$root}__bottom{
      position: absolute;
      left: 0;
      right: 0;
    }
    #{$root}__video-navigation {
      background: rgba(#1C102C, .8);

      .options-icons {
        .icon {
          opacity: .9;

          &:hover {
            opacity: 1;
          }
        }
      }
    }

  }

  &--pseudo-full {
    position: fixed;
    width: 100%;
    max-width: unset;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2147483647;

    video {
      height: 100%;
    }

    #{$root}__bottom{
      bottom: 50px;
    }
  }

  &--pseudo-full.video-player--transparent{
    #{$root}__bottom{
      bottom: 0;
    }
  }

  &__video-container {
    width: 100%;
    height: 100%;
    background: #000;
    position: relative;
    border-radius: 6px 6px 0 0;

    video {
      border-radius: 6px 6px 0 0;
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  &--no-border &__video-container{
    &, video {
      border-radius: unset;
      border: unset;
    }
  }

  &__video-navigation {
    position: relative;
    height: 60px;
    padding: 0 30px 0 65px;
    display: flex;
    align-items: center;
    max-height: 0;
    overflow: hidden;
    @media (max-width: $breakpoint-sm-max) {
      padding: 0 15px 0 50px;
      height: 50px;
    }
    @media (max-width: $breakpoint-xs-max) {
      padding: 0 15px;
    }

    .time {
      font-size: 12px
    }

    .icon {
      &.icon > img {
        // NOTE: workaround for /deep/ selector in routine-content.vue
        border-radius: initial;
      }
      float: left;
      cursor: pointer;
      position: relative;

      &--white {
        filter: brightness(0) invert(1);
      }

      &.green-border:after {
        content: "";
        width: 75%;
        border-radius: 4px;
        position: absolute;
        left: 15%;
        bottom: -5px;
        height: 2px;
        display: block;
        background: $green;
      }
    }

    .options-icons {
      .icon {
        opacity: .7;

        &:hover {
          opacity: 1;
          cursor: pointer;
        }
      }
    }
  }

  &__bottom {
    position: relative;
    bottom: 0;
    opacity: .4;
    transition: all 0.2s ease-in-out;

    &--active {
      overflow: visible;
      opacity: 1;

      #{$root}__video-navigation {
        max-height: 60px;
        overflow: unset;
      }
    }
  }
}
</style>
