<template>
  <q-card
    class="workshop-card"
    :class="{'workshop-card--small': small}"
    @click="$emit('click', id)"
  >
    <div class="ribbon ribbon--top-left" v-if="isExclusive">Exclusive</div>

    <q-card-section class="workshop-card-img">
      <n-difficulty class="workshop-card-difficulty" :difficulty="difficulty" v-if="difficulty"/>
      <q-img
        :ratio="5/3"
        v-if="!small"
        :src="computedThumbnail"/>
        <div class="workshop-card-activity-counter">
          <n-activity-counter  :counter="counter || 0"/>
        </div>
    </q-card-section>
    <q-card-section class="workshop-card-desc">
      <div class="q-mb-sm" :class="[ $q.screen.gt.sm ? 'text-h4' : 'text-h5' ]">
        {{ title }}
      </div>
      <div>
        {{ subTitle }}
      </div>
    </q-card-section>
    <q-space />
    <q-card-section class="workshop-card-tags">
      <div class="workshop-card-tag" style="display: flex">
        <c-skill-icons v-slot="{ getIcon }">
          <img :src="getIcon('workshop')" width="20px" height="20px"/>
        </c-skill-icons>
        <div style="padding-left:5px; align-self: flex-end;">
          WORKSHOP
        </div>
      </div>
      <div v-if="duration" class="workshop-card-tag text-weight-bold">
        {{ duration }} min
      </div>
      <approved-by :author="approvedBy" class="justify-center" :short="true" @click.native.stop />
      <div class="workshop-card-tag text-weight-bold text-pink" v-if="isNew">
        NEW
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import urlTypes from '@/mixins/urlType.mixins'
import SkillIcons from '@/components/common/skill-icons-manager'
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
    subTitle: {
      type: String
    },
    duration: {
      type: Number
    },
    approvedBy: {
      type: String,
      default: 'N/A'
    },
    difficulty: {
      type: String
    },
    thumbnail: {
      type: String,
      default: require('@/assets/other/Fortnite-Original-Map.webp')
    },
    sessions: {
      type: Array,
      default: () => []
    },
    isNew: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    isExclusive: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false, // prevent unused workshop fields from being bound as attrs on root div
  components: {
    'n-difficulty': () => import('@/components/training-routine/difficulty'),
    'approved-by': () => import('@/components/training-routine/approved-by'),
    'c-skill-icons': SkillIcons,
    'n-activity-counter': () => import('@/components/training-routine/activity-counter')
  },
  mixins: [urlTypes],
  computed: {
    parsedDuration () {
      return this.duration && new Date(this.duration * 1000).toISOString('MM:SS').substr(14, 5)
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
  }
}
</script>

<style lang="scss" scoped>
.workshop-card {
  $root: &;
  padding: 18px 15px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  color: #fff;
  background: $dark-one;
  text-decoration: none;
  cursor: pointer;

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
}
</style>
