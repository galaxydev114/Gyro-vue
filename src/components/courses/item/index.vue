<template>
  <div
    class="course-card"
    :class="[{'course-card--done': isCompleted}]"
    @click="$emit('click', id)"
    @mouseenter="showOptionsButton"
    @mouseleave="hideOptionsButton"
  >
    <div class="course-card__img">
      <n-difficulty class="course-card__difficulty"
                    :difficulty="difficulty"/>
      <q-img
        :ratio="16/9"
        :src="computedThumbnail"/>
    </div>
    <div class="course-card__content">
      <div class="course-card__details">
        <div class="course-card__details-item text-gray">
          <routine-category :category="skill" size="16px" xsmall/>
        </div>
        <div class="course-card__details-item">
          {{ computedDuration }} min
        </div>
        <div class="course-card__details-item">
          <approved-by :author="approvedBy || creator" label="" size="20px" class="justify-center"/>
        </div>
      </div>
      <div class="course-card__description">
        <div class="q-mb-sm font-roboto"
             style="text-transform: unset"
             :class="[ $q.screen.gt.sm ? 'text-h4' : 'text-h5' ]">
          {{ title }}
        </div>
      </div>
    </div>
    <div class="course-card__drop" v-if="showOptions && !isCompleted">
      <div class="course-card__drop-btn"
           v-outside-click="() => (showDropdown = false)"
           @click.stop="showDropdown = true">
        <span></span>
        <span></span>
        <span></span>
        <q-tooltip
          v-if="$q.screen.gt.xs"
          anchor="top middle"
          self="bottom middle"
          max-width="240px"
          content-style="background-color: #382B4B; font-size: 14px"
          :offset="[10, 10]"
        >
          More options
        </q-tooltip>
      </div>
      <div class="course-card__drop-content" v-if="showDropdown">
        <div @click.stop="showDropdown=false; $emit('done')">Mark as Done</div>
      </div>
    </div>
  </div>
</template>

<script>
import urlTypes from '@/mixins/urlType.mixins'
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      default: ''
    },
    subtitle: {
      type: String
    },
    skill: {
      type: String,
      default: ''
    },
    creator: {
      type: String,
      default: 'N/A'
    },
    approvedBy: {
      type: String,
      default: null
    },
    difficulty: {
      type: String,
      default: ''
    },
    thumbnail: {
      type: String,
      default: require('@/assets/other/Fortnite-Original-Map.webp')
    },
    sessions: {
      type: Array,
      default: () => []
    },
    duration: {
      type: [String, Number],
      default: null
    },
    isCompleted: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      showOptions: false,
      showDropdown: false
    }
  },
  components: {
    'routine-category': () => import('@/components/common/activity-category'),
    'n-difficulty': () => import('@/components/training-routine/difficulty'),
    'approved-by': () => import('@/components/training-routine/approved-by')
  },
  mixins: [urlTypes],
  computed: {
    computedDuration () {
      return this.duration || this.sessions.reduce((duration, session) => {
        duration += session.duration
        return duration
      }, 0)
    },
    computedThumbnail () {
      let computedThumbnail = this.thumbnail
      if (this.isYoutubeUrl(this.thumbnail)) {
        const matched = this.thumbnail?.match(/youtube.com\/embed\/([^#&?]*)/)
        if (matched) {
          computedThumbnail = `https://i.ytimg.com/vi/${matched[1]}/mqdefault.jpg`
        }
      } else if (!this.thumbnail || this.isVideoUrl(this.thumbnail)) {
        computedThumbnail = require('@/assets/other/Fortnite-Original-Map.webp')
      }
      return computedThumbnail
    }
  },
  methods: {
    showOptionsButton () {
      this.showOptions = true
      this.showDropdown = false
    },
    hideOptionsButton () {
      this.showOptions = false
      this.showDropdown = false
    }
  }
}
</script>

<style lang="scss">
.course-card {
  $root: &;
  border-radius: 6px;
  display: flex;
  color: #fff;
  background: $dark-one;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  max-width: 720px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.202551);
  transition: all 0.3s ease;

  &__img {
    padding: 0;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    width: 245px;
    @media (max-width: $breakpoint-sm-max) {
      width: 200px;
    }
  }

  &__content{
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: calc(100% - 285px);
    @media (max-width: $breakpoint-sm-max) {
      max-width: calc(100% - 215px)
    }
  }

  &__details{
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    &-item{
      padding: 0 10px 0 0;
      margin: 0 10px 0 0;
      border-right: 1px solid $soft-tone;
      font-size: 12px;
      &:last-child{
        border: none;
      }
    }
  }

  &__difficulty {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9;
  }

  &:hover {
    background: $dark-sec;
  }

  @media (max-width: $breakpoint-565-max) {
    flex-direction: column;
    #{$root}__img,
    #{$root}__content {
      width: 100%;
      max-width: unset;
    }
  }
  &__drop{
    z-index: 99;
    margin-top: 20px;
    margin-right: 16px;
    margin-left: auto;

    &-btn{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 24px;
      height: 24px;
      span{
        width: 5px;
        height: 5px;
        background: $dark-pink;
        border-radius: 2px;
        margin-bottom: 4px;
      }
      &:hover{
        cursor: pointer;
        span{
          background: $gray;
        }
      }
    }
    &-content{
      position: absolute;
      top: 35px;
      right: 10px;
      @media all and (max-width: $breakpoint-xs-max) {
        top: -35px;
      }
      background: $mid-tone;
      border-radius: 6px;
      z-index: 10;
      width: 200px;
      overflow: hidden;
      border: 1px solid $soft-tone;
      div {
        padding: 6px 10px;
        font-size: 14px;
        overflow: hidden;
        cursor: pointer;
        color: #fff;
        font-weight: normal;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 46px;
        &:hover{
          color: $dark-pink;
          background: $soft-tone;
        }
      }
    }
  }
  &--done{
    background: #231538;
    border: 1.5px solid #382B4B;
    opacity: 0.7;
  }
}

</style>
