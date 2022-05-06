<template>
  <div class="video-player"
       @mousemove="showControls = true; hideControls()"
       @mouseleave="showControls = false">
    <div class="video-player__video-container" v-if="src">
      <video
        style="width: 100%; pointer-events: none;"
        ref="videoPlayer"
        v-video-src="src"
        :poster="thumbnail"
        @timeupdate="handleTimeUpdate"
        @waiting="onWait"
        @playing="onResume"
      />

      <div class="video-player__video-controls"
           :class="{'video-player__video-controls--active': isLoading}">
        <q-circular-progress
          indeterminate
          size="60px"
          color="dark-pink"
          track-color="mid-tone"/>
      </div>

      <div class="video-player__video-controls"
           :class="{'video-player__video-controls--active': showControls || !sourceDuration}">
        <div class="control-item" @click="smallJumpBack" v-if="rawCurrentSourceTimestamp > 5">
          <c-icon icon="back5" width="22px" class="q-ml-xs" />
        </div>
        <div class="control-item" v-if="!isPlay" @click="playVideo">
          <c-icon icon="play" width="22px" class="q-ml-sm" />
        </div>
        <div class="control-item" v-if="isPlay" @click="pauseVideo">
          <c-icon icon="pause" width="22px" />
        </div>
      </div>

      <time-bar
        v-if="sourceDuration && rawCurrentSourceTimestamp"
        :total-time="sourceDuration"
        :current-time="rawCurrentSourceTimestamp"
        :checkpoints="checkpoints"
        :storyboard="storyboardMetadata"
        @seek="seekTo"
      />
    </div>

    <div class="video-player__point-container" v-if="onCheckpoint" ref="checkpointPanel">
      <transition-group name="point" tag="div" class="video-player__point-content fit overflow-auto"
        :class="{ 'video-player__point-content--minimized': $q.screen.lt.sm && minimizeCheckpoint }"
      >
        <template v-for="timestamp of [activeCheckpoint]">
          <!-- minimize button -->
          <!-- <div class="absolute-top-right inline-block q-mt-md q-mr-md"
            :key="`toggle-${timestamp.pointOfTime}`"
            v-if="$q.screen.lt.sm"
            @click="minimizeCheckpoint = !minimizeCheckpoint">
            <c-icon icon="closeCircle" class="video-player__point-content__toggle" />
          </div> -->

          <key-point
            v-if="timestamp.type === 'INFORMATION'"
            :title="timestamp.data.title"
            :key="timestamp.pointOfTime"
            @continue="playVideo"
          >
            <div v-html="timestamp.data.information" />
          </key-point>

          <question-point
            v-else-if="timestamp.type === 'QUESTION'"
            :title="timestamp.data.question"
            :key="timestamp.pointOfTime"
            :total="totalQuestions.length"
            :show-explanation="!!selected"
            :current="currentQuestionsIndex(timestamp)"
          >
            <question-point-option
              @click="optionSelect(answer)"
              :class="{'q-mb-sm': idx < timestamp.data.answers.length - 1}"
              v-for="(answer, idx) of timestamp.data.answers"
              :key="`answer-${idx}`"
              :isCorrect="selected && answer.isCorrect"
              :wrong="isSelected(answer) && !answer.isCorrect"
              :index="idx"
            >
              <div v-html="answer.answer" />
            </question-point-option>

            <div slot="explanation">
              <question-point-explanation
                v-if="selected"
                @continue="playVideo"
                @redo="tryAgain"
              >
                <div v-html="selected.explanation" />
              </question-point-explanation>
            </div>
          </question-point>

          <congrats-point
            v-if="timestamp.type === 'END_OF_VIDEO'"
            :key="timestamp.pointOfTime"
            :title="timestamp.data.title"
            v-html="timestamp.data.information"
          />
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { debounce, scroll } from 'quasar'
const { getScrollTarget } = scroll
import videoStoryboardMixin from '@/mixins/videoStoryboard.mixin'

export default {
  components: {
    'time-bar': () => import('./time-bar'),
    'key-point': () => import('./key-point'),
    'question-point': () => import('./question-point'),
    'congrats-point': () => import('./congrats-point'),
    'question-point-option': () => import('./question-point/option'),
    'question-point-explanation': () => import('./question-point/explanation')
  },
  mixins: [videoStoryboardMixin],
  props: {
    timestamps: {
      type: Array,
      default: () => []
    },
    src: {
      type: String,
      required: true
    },
    poster: {
      type: String,
      default: require('@/assets/other/Fortnite-Original-Map.webp')
    },
    externalTrackAction: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      showControls: false,
      selected: null,
      minimizeCheckpoint: false,
      isPlay: false,
      isLoading: false, // whether or not the video is really playing or stuck buffering
      rawCurrentSourceTimestamp: 0,
      lastCheckpointTime: 0,
      sourceDuration: 0
    }
  },

  computed: {
    checkpoints () {
      return this.timestamps.map(timestamp => timestamp.pointOfTime)
    },
    onCheckpoint () {
      return this.activeCheckpoint &&
        Math.abs(this.rawCurrentSourceTimestamp - this.lastCheckpointTime) > 1
    },
    activeCheckpoint () {
      return this.timestamps.find(timestamp => this.isCurrentTime(timestamp.pointOfTime))
    },
    canContinue () {
      return Boolean(
        !this.activeCheckpoint ||
        this.activeCheckpoint?.type === 'INFORMATION' ||
        this.selected
      )
    },
    totalQuestions () {
      return this.timestamps.filter((key) => key.type === 'QUESTION')
    },
    thumbnail () {
      if (this.poster) {
        return this.poster
      }
      const playbackId = this.src.match(/stream\.mux\.com\/(?<playbackId>\w+).m3u8/)?.groups?.playbackId
      if (playbackId) {
        return `https://image.mux.com/${playbackId}/thumbnail.png`
      }
      return null
    }
  },
  methods: {
    optionSelect (answer) {
      if (this.selected) return
      this.selected = answer
      this.trackAction('Workshops: Video Player: Select option', { question: this.activeCheckpoint, answer })
    },
    tryAgain () {
      this.selected = null
      this.trackAction('Workshops: Video Player: TRY AGAIN question', { question: this.activeCheckpoint }
      )
    },

    isSelected (answer) {
      return this.selected === answer
    },

    playVideo () {
      if (!this.canContinue) {
        return
      }
      if (this.onCheckpoint) {
        this.lastCheckpointTime = this.rawCurrentSourceTimestamp
      }
      this.selected = null
      this.$refs.videoPlayer.play()
      this.isPlay = true
      this.isLoading = false

      if (!this.sourceDuration) {
        this.sourceDuration = this.$refs.videoPlayer.duration
      }
      this.$emit('play')
      this.showControls = false
      this.trackAction('Workshops: Video Player: Play')
    },

    pauseVideo () {
      this.$refs.videoPlayer.pause()
      this.isPlay = false
      this.trackAction('Workshops: Video Player: Pause')
    },
    onWait () {
      this.isLoading = true
    },
    onResume () {
      this.isLoading = false
    },

    hideControls: debounce(function () {
      this.showControls = false
    }, 1500),

    smallJumpBack () {
      const targetTime = Math.max(0, this.rawCurrentSourceTimestamp - 5)
      this.seekTo(targetTime, true)
      this.trackAction('Workshops: Video Player: Skip back', { seconds: 5 })
    },

    seekTo (position, overrideAdmin = false) {
      this.trackAction('Workshops: Video Player: Seek to time', { time: position, currentTime: this.rawCurrentSourceTimestamp })
      this.$refs.videoPlayer.currentTime = position
      this.rawCurrentSourceTimestamp = position
      this.lastCheckpointTime = 0
    },

    isCurrentTime (timestamp) {
      return Math.floor(this.rawCurrentSourceTimestamp) === timestamp
    },

    handleTimeUpdate () {
      this.rawCurrentSourceTimestamp = this.$refs.videoPlayer?.currentTime
      if (this.onCheckpoint) {
        this.pauseVideo()
        this.trackAction('Workshops: Video Player: Reached timestamp', this.activeCheckpoint)
      }
    },

    currentQuestionsIndex (timestamp) {
      return this.totalQuestions.indexOf(timestamp) + 1
    },
    specialScrollToElement (elementToScroll) {
      if (elementToScroll) {
        if (this.$q.platform.is.mobile) {
          elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          const scrollablePage = getScrollTarget(elementToScroll)
          // scrollablePage is undefined for courses, setting to 0
          const scrollablePageTop = scrollablePage?.getBoundingClientRect().top || 0

          scrollablePage.scrollBy({
            top: elementToScroll.getBoundingClientRect().top - scrollablePageTop,
            left: 0,
            behavior: 'smooth'
          })
        }
      }
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
    onCheckpoint (val) {
      if (val) {
        setTimeout(() => {
          const el = this.$refs.checkpointPanel
          if (el) {
            if (this.$q.screen.lt.sm) {
              this.specialScrollToElement(el)
            } else {
              this.specialScrollToElement(this.$refs.videoPlayer)
            }
          }
        }, 100)
      }
    },
    isPlay (val) {
      if (val) {
        this.specialScrollToElement(this.$refs.videoPlayer)
      }
    }
    // TODO: resume video automatically after answering?
    // canContinue (val) {
    //   if (val) {
    //     setTimeout(() => {
    //       this.playVideo()
    //     }, 3000)
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.video-player{
  width: 95%;
  max-width: 1278px;
  position: relative;
  border-radius: 6px;
  background-size: cover;
  box-shadow: 0 4px 8px rgba(#000, .2);
  @media (max-width: $breakpoint-sm-max) {
    width: 100%;
  }
  &__video-container{
    width: 100%;
    background: #000;
    position: relative;
    img{
      opacity: .5;
    }
  }
  &__point-container{
    position: absolute;
    top: 15px;
    right: 15px;
    height: 85%;
    width: 360px;
    overflow: hidden;
    transition: all .2s ease;
    z-index: 20;
    ul{
      padding: 0;
      margin: 15px 0;
      li{
        list-style: none;
        padding-left: 20px;
        position: relative;
        margin-bottom: 10px;
        &:last-child{
          margin-bottom: 0;
        }
        &:before{
          position: absolute;
          top: 6px;
          left: 0;
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background: $pink;
          display: block;
        }
      }
    }
    @media (max-width: $breakpoint-sm-max) {
      width: 60%;
      height: unset;
    }
    @media (max-width: $breakpoint-xs-max) {
      position: relative;
      overflow: unset;
      width: 100%;
      height: unset;
      right: 0;
      left: 0;
      top: 25px;
    }
  }
  &__point-content{
    $root: &;
    transition: transform 0.6s ease-out;
    &--minimized {
      transform: translateY(calc(100% - 60px)); // 30px is padding of checkpoint content
      #{$root}__toggle  {
        transform: rotateZ(45deg);
      }
    }
  }
  &__video-controls{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(#000, .6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    opacity: 0;
    transition: all .2s ease-in-out;
    &--active{
      opacity: 1;
    }
    .control-item{
      width: 70px;
      height: 70px;
      margin: 0 6px;
      border-radius: 100%;
      border: 4px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: brightness(0) invert(1);
      transition: all .2s ease-in-out;
      &:hover{
        cursor: pointer;
        transform: scale(1.05);
      }
    }
  }
}

.point-leave-active{
  transition: 0.2s;
}
.point-enter-active {
  transition: 0.8s;
}
.point-enter {
  opacity: 0;
  position: absolute;
  top: 0;
  overflow: hidden;
}
.point-leave-to {
  opacity: 0;
  position: absolute;
  top: 0;
  overflow: hidden;
}
</style>
