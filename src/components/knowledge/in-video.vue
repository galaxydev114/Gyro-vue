<template>
  <div class="in-video">
    <div class="in-video__row">
      <div class="in-video__video">
        <n-multimedia :src="data.video" :thumbnail="data.thumbnail" @click="delayedMarkAsWatch"/>
      </div>
      <div class="in-video__text">
        <q-scroll-area class="full-height full-width">
          <div v-for="insight of insights" :key="insight.title" class="q-pr-md">
            <div class="text-h4 q-mb-sm">
              {{ insight.title }}
            </div>
            <p v-html="insight.description"></p>
          </div>
        </q-scroll-area>
      </div>
      <div class="in-video__description column items-start q-mt-lg">
        <div class="full-width">
          <div class="flex items-center">
            <div class="order-last order-sm-first in-video__detail-tag">
              <routine-category :category="data.category" small />
            </div>
            <div class="order-last order-sm-first in-video__detail-tag flex items-center">
              <c-icon icon="timer" />
              <div class="text-h5 q-ml-sm">
                {{ data.time }} min
              </div>
            </div>
            <div class="order-first order-sm-first in-video__detail-tag in-video__detail-tag--no-border flex items-center">
              <div class="text-h5 q-mr-sm gt-xs">
                Difficulty:
              </div>
              <n-difficulty class="videos-list__item-difficulty" :difficulty="data.difficulty" />
            </div>
            <div class="order-first order-sm-last flex q-ml-auto items-center">
              <div class="in-video__drop" v-if="!isPublic">
                <div class="in-video__drop-btn"
                    v-outside-click="() => (showDropdown = false)"
                    @click.stop="showDropdownOptions">
                  <span class='span-points'></span>
                  <span class='span-points'></span>
                  <span class='span-points'></span>
                </div>
                <div class="in-video__drop-content" v-if="showDropdown">
                  <div @click.stop="watched(); showDropdown = false">
                    Mark as {{ data.isDone ? 'unwatched' : 'watched' }}
                  </div>
                </div>
              </div>
              <router-link v-if="returnPath" :to="returnPath">
                <c-btn outline
                       @click="$emit('back')"
                       size="xs"
                       style="color: white;">
                  switch video
                </c-btn>
              </router-link>
            </div>
            <div class="full-width q-my-lg q-mt-sm-lg q-mb-sm-sm order-first order-sm-last">
              <div class="flex items-center no-wrap">
                <div class="text-h2 q-pr-lg">
                  {{ data.title }}
                </div>
                <router-link v-if="returnPath" :to="returnPath">
                  <c-icon icon="goBack" @click="goBack()" style="cursor: pointer" />
                </router-link>
              </div>
              <div class="gt-xs" style="font-size: 16px">
                {{ data.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    returnPath: {
      type: [String, Object],
      require: false
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      require: true
    }
  },
  data: () => ({
    timer: null,
    isStartedWatchVideo: false,
    showDropdown: false
  }),

  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },

  components: {
    'routine-category': () => import('@/components/common/activity-category'),
    'n-difficulty': () => import('@/components/training-routine/difficulty'),
    'n-multimedia': () => import('@/components/common/multimedia')
  },
  methods: {
    ...mapActions({
      markVideoAsWatched: 'knowledgeTime/markKnowledgeWatched'
    }),

    showDropdownOptions () {
      this.showDropdown = !this.showDropdown
      this.trackAction('Knowledge time: click main Knowledge Time options', {
        'knowledge-id': this.knowledgeId,
        date: new Date()
      })
    },
    goBack () {
      this.$emit('back')
    },
    watched () {
      const label = this.data?.isDone ? 'mark as unwatched' : 'mark as watched'
      this.trackAction(`Knowledge time: click "${label}" from dropdown for main video`, this.data)
      this.markVideoAsWatched(this.data)
      return this.$router.push(this.returnPath)
    },
    delayedMarkAsWatch () {
      if (this.isStartedWatchVideo) {
        return
      } else {
        this.isStartedWatchVideo = true
      }

      this.timer = setTimeout(() => {
        this.markVideoAsWatched(this.data)
        this.trackAction('Knowledge time: trigger "mark as watched" after 2 minutes', { props: this.data, videoUrl: this.data.video })
        this.isStartedWatchVideo = false
      }, 2 * 60 * 1000)
    }
  },
  computed: {
    knowledgeId () {
      return this.$route.params.id
    },

    insights () {
      return [this.data.insights?.[this.data.insights.length - 1] || {}]
    }
  }
}
</script>

<style lang="scss">
.in-video {
  width: 100%;
  display: flex;

  &__row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    flex-wrap: wrap;
  }

  &__video {
    width: calc( 100% - 290px );
    padding-right: 40px;
    @media (max-width: $breakpoint-sm-max) {
      width: 100%;
      padding: 0;
    }
  }

  &__text {
    flex: 0 0 290px;
    padding: 20px 5px 20px 20px;
    border: 1px solid $soft-tone;
    border-radius: 6px;
    @media (max-width: $breakpoint-sm-max) {
      flex: 0 0 100%;
      border-radius: 0;
      order: 2;
      margin-top: 25px;
      max-height: 250px;
      .absolute{
        position: relative;
      }
    }
    a {
      color: $dark-pink;
      text-decoration: none;
      font-weight: bold;
      &:hover {
        color: #B53B56;
      }
    }
  }
  &__detail-tag{
    padding-right: 15px;
    margin-right: 15px;
    border-right: 1px solid $soft-tone;
    &--no-border{
      margin: 0;
      border: none;
    }
  }
  &__drop {
    margin-right: 30px;
    position: relative;
    &-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 24px;
      height: 18px;
      transform: translateX(50%);
      .span-points {
        width: 6px;
        height: 6px;
        background: $gray;
        border-radius: 4px;
        margin-bottom: 3px;
      }

      &:hover {
        cursor: pointer;

        span {
          background: $dark-pink;
        }
      }
    }

    &-content {
      position: absolute;
      top: 24px;
      right: 0;
      background: $mid-tone;
      border-radius: 6px;
      z-index: 10;
      width: 200px;
      overflow: hidden;
      border: 1px solid $soft-tone;
      @media (max-width: $breakpoint-xs-max){
        transform: translateX(50%);
      }

      div {
        padding: 6px 10px;
        font-size: 14px;
        overflow: hidden;
        cursor: pointer;
        color: #fff;

        &:hover {
          color: $dark-pink;
          background: $soft-tone;
        }
      }
    }
  }
  &__description{
    width: 100%;
    padding-right: 330px;
    @media (max-width: $breakpoint-md-max) {
      padding-right: 0;
    }
    @media (max-width: $breakpoint-xs-max) {
      padding: 0;
      order: 1;
      .text-h2{
        font-size: 22px;
      }
    }
  }
}
</style>
