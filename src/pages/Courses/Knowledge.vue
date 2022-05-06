<template>
  <div class="courses-workshops relative-position">
    <div class="courses-workshops__top-line">
      <div class="flex align-center cursor-clickable" @click="$emit('back')">
        <c-icon icon="leftArrowRounded" class="q-mr-sm"/>
        <span class="opacity-25">Go back</span>
      </div>
      <!-- <div class="flex align-center">
        <div class="q-ml-md">
          <c-icon icon="change" class="float-left"></c-icon>
        </div>
        <div class="q-ml-md">
          <c-icon icon="supportPink" class="float-left"></c-icon>
        </div>
        <div class="q-ml-md">
          <c-icon icon="starPink" class="float-left"></c-icon>
        </div>
        <div class="q-ml-md">
          <c-icon icon="sharePink" class="float-left"></c-icon>
        </div>
      </div> -->
    </div>

    <div class="courses-workshops__scrollable">
      <div class="courses-workshops__header">
        <div class="container">
          <div class="column">
            <div class="q-col-12">
              <div class="information">
                <div class="information__item">
                  <routine-category :category="data.category" size="20px" xsmall/>
                </div>
                <div class="information__item flex items-center">
                  <c-icon icon="timer"/>
                  <div class="text-subtitle2 q-ml-sm">
                    {{ duration }} min
                  </div>
                </div>
                <div class="information__item flex items-center">
                  <span class="q-mr-sm">Difficulty:</span>
                  <n-difficulty :difficulty="data.difficulty"/>
                </div>
              </div>
            </div>
            <div class="q-col-12 q-my-md">
              <div class="text-h2">
                {{ data.title }}
              </div>
              <div class="text-h4 text-weight-regular q-mt-xs">
                {{ data.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="courses-workshops__content q-mt-lg">
        <div class="container">
          <n-multimedia :externalTrackAction="trackAction" :src="data.videoUrl" :thumbnail="data.thumbnail"/>
        </div>
        <div class="container q-mt-xl">
          <div class="bordered bordered--full q-pa-lg" v-for="insight in insights" :key="insight.title">
            <div class="text-container">
              <div class="text-pink">
                Noteworthy
              </div>
              <div class="text-h4 q-mb-lg q-mt-sm">
                {{insight.title}}
              </div>
              <p class="pink-links" v-html="insight.description"></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="courses-workshops__footer">
      <div class="row justify-between items-center full-width">
        <div class="q-col-6 row courses-workshops__footer-info">
          <div class="q-ml-md">
            <div class="text-h4 q-mb-xs">{{ data.title }}</div>
            <div class="opacity-25">{{ duration }} minutes</div>
          </div>
        </div>
        <div class="q-col-6 text-right">
          <n-lottie-complete-button v-if="!isCompleted && !wasCompletePressed" @click="wasCompletePressed = true; $emit('done')"/>
          <c-btn v-else @click="$emit('back')">
            {{ `Go back` }}
          </c-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Difficulty from 'components/training-routine/difficulty'

export default {
  components: {
    'routine-category': () => import('@/components/common/activity-category'),
    'n-difficulty': Difficulty,
    'n-multimedia': () => import('@/components/common/multimedia'),
    'n-lottie-complete-button': () => import('@/components/common/lottie-complete-button')
  },
  props: {
    isCompleted: String,
    data: {}
  },
  data () {
    return {
      wasCompletePressed: false
    }
  },
  computed: {
    insights () {
      return [this.data.insights?.[this.data.insights.length - 1] || {}]
    },
    duration () {
      return Math.round(this.data.videoDurationSeconds / 60)
    }
  },
  methods: {
    trackAction () {
      this.$emit('analytics', ...arguments)
    }
  }
}
</script>

<style lang="scss">
.pink-links {
  a {
    color: $dark-pink;
    text-decoration: none;
    font-weight: bold;
    &:hover {
      color: #B53B56;
    }
  }
}
</style>

<style lang="scss" scoped>
.courses-workshops {
  $root: &;
  position: relative;
  padding: 56px 0 80px;
  overflow: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;

  &__scrollable{
    overflow: auto;
    height: 100%;
    padding-bottom: 30px;
  }

  &__top-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: $dark;
    z-index: 100;
    height: 56px;
  }

  &__header {
    padding: 30px 0;
    background: $mid-tone;

    .information {
      display: flex;
      align-items: center;

      &__item {
        margin-right: 24px;
      }
    }
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 100px 0 40px;
    background: $dark-sec;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    display: block;
    padding-right: 200px;
    padding-left: 200px;
    .text-container {
      width: 60%;
    }
    @media (max-width: $breakpoint-tablet-max) {
      padding-right: 100px;
      padding-left: 100px;
      .text-container {
        width: 100%;
      }
    }

    @media (max-width: $breakpoint-mobile-max) {
      padding-right: 10px;
      padding-left: 10px;
    }

  }

  .bordered {
    &--full {
      border: 1px solid $soft-tone;
      border-radius: 6px;
    }
    &--top {
      border-top: 1px solid $soft-tone;
    }
    &--right {
      border-right: 1px solid $soft-tone;
    }
  }

  @media (max-width: $breakpoint-565-max) {
    padding: 60px 0 100px;
    min-height: unset;
    display: block;
    height: auto;
    #{$root}__content,
    #{$root}__top-line,
    #{$root}__header {
      padding: 20px;
    }

    #{$root}__content{
      margin-top: 0;
    }

    #{$root}__footer{
      padding: 0 20px;
      .row{
        justify-content: center;
      }
      &-info{
        display: none;
      }
    }

    .container{
      width: 100%;
    }
  }
}
</style>
