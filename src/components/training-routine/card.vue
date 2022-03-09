<template>
  <q-card
    class="routine-card"
    :class="{
      'routine-card--small': small,
      'routine-card--vertical': isVertical
    }"
    @click="$emit('click', id)"
  >
    <div class="ribbon ribbon--top-left" v-if="isExclusive">Exclusive</div>

    <q-card-section v-if="approvedOnTop && showApproved && !isVertical" class="flex align-center q-px-none q-pt-none">
      <approved-by :author="approvedBy"
                   label="Created by"
                   class="justify-center opacity-5"
                   :short="$q.screen.lt.md || shortApproved"
                   @click.native.stop />
      <n-difficulty class="routine-card-difficulty"
                    style="top: 0; right: 0"
                    :difficulty="difficulty"/>
    </q-card-section>
    <q-card-section class="routine-card-img">
      <n-difficulty class="routine-card-difficulty"
                    v-if="!approvedOnTop && !isVertical"
                    :difficulty="difficulty"/>
      <q-img
        :ratio="16/9"
        v-if="!small"
        :src="computedThumbnail"/>
      <div class="routine-card-activity-counter" v-if="showCounter">
        <n-activity-counter  :counter="counter || 0"/>
      </div>
    </q-card-section>
    <q-card-section class="routine-card__content" :class="{'q-pa-none': !isVertical}">
      <n-difficulty class="routine-card-difficulty"
                    v-if="isVertical"
                    :difficulty="difficulty"/>
      <div class="routine-card-desc">
        <div class="q-mb-sm" :class="[ $q.screen.gt.sm ? 'text-h4' : 'text-h5' ]">
          {{ title }}
        </div>
        <div>
          {{ subtitle }}
        </div>
      </div>
      <q-space />
      <div class="routine-card-tags">
        <div class="routine-card-tag">
          <routine-category :category="skill" size="20px" xsmall/>
        </div>
        <div v-if="computedDuration" class="routine-card-tag text-weight-bold">
          {{ computedDuration }} min
        </div>
        <approved-by :author="approvedBy"
                     v-if="!approvedOnTop && showApproved && !isVertical"
                     class="justify-center"
                     :short="$q.screen.lt.md || shortApproved"
                     @click.native.stop />
        <div class="routine-card-tag text-weight-bold text-pink" v-if="isNew">
          NEW
        </div>
      </div>
    </q-card-section>
  </q-card>
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
    counter: {
      type: Number,
      default: 0
    },
    subtitle: {
      type: String
    },
    skill: {
      type: String,
      default: ''
    },
    approvedBy: {
      type: String,
      default: 'N/A'
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
    isNew: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    shortApproved: {
      type: Boolean,
      default: false
    },
    approvedOnTop: {
      type: Boolean,
      default: false
    },
    showApproved: {
      type: Boolean,
      default: true
    },
    vertical: {
      type: Boolean,
      default: false
    },
    showCounter: {
      type: Boolean,
      default: true
    },
    isExclusive: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false, // prevent unused routine fields from being bound as attrs on root div
  components: {
    'routine-category': () => import('@/components/common/activity-category'),
    'n-difficulty': () => import('@/components/training-routine/difficulty'),
    'approved-by': () => import('@/components/training-routine/approved-by'),
    'n-activity-counter': () => import('@/components/training-routine/activity-counter')
  },
  mixins: [urlTypes],
  computed: {
    isVertical () {
      return this.vertical && this.$q.screen.gt.sm
    },
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
  }
}
</script>

<style lang="scss" scoped>
.routine-card {
  $root: &;
  padding: 18px 15px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  color: #fff;
  background: $dark-one;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;

  @media (max-width: $breakpoint-sm-max) {
    width: 100%;
    min-width: 300px;
    margin: 10px 0;
    padding: 14px 10px 0;

    &-desc, &-tags {
      padding: 15px 5px;
    }
  }

  &-desc {
    padding: 20px 10px 10px;
  }

  &--active {
    border-color: $dark-pink;
  }

  &-img {
    padding: 0;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
  }

  &-difficulty {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9;
  }

  &-activity-counter {
    position: absolute;
    bottom: 10px;
    left: 5px;
    z-index: 9;
  }

  &-tags {
    display: flex;
    min-width: 200px;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;
    color: #DFDAE7;
    font-size: 12px;
    white-space: nowrap;
    padding: 10px;
    margin-top: auto;
  }

  &-tag {
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid $soft-tone;

    &:last-child {
      border: none;
      margin: 0;
    }
  }
  &--small{
    #{$root}-difficulty{
      position: relative;
      right: unset;
      left: 10px;
      top: 0;
    }
  }

  &--vertical{
    flex-direction: row;
    padding: 0;
    border: 1px solid $soft-tone;
    #{$root}__content{
      width: 280px;
      margin-left: auto;
      padding: 28px 28px 65px;
    }
    #{$root}-img{
      width: calc( 100% - 280px );
      border-right: 1px solid $soft-tone;
      /deep/ .q-img{
        height: 100%
      }
    }

    #{$root}-difficulty{
      position: relative;
      top: unset;
      right: unset;
      margin-bottom: 24px;
    }
    #{$root}-desc{
      padding: 0;
      .text-h4{
        font-size: 24px;
      }
    }
    #{$root}-tags{
      padding-left: 0;
    }
  }
}
</style>
