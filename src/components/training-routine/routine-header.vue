<template>
  <div
    class="routine-header"
    :class="{
      'routine-header--minimize': minimize,
      'routine-header--background': !backgroundless
     }"
    ref="routineHeader"
  >
<!--    For mobile-->
    <div class="routine-header--mobile">
      <div class="column">
        <div class="flex items-center justify-between">
          <div @click="$emit('back')">
            <c-icon
              icon="goBack"
              width="24px"
            />
          </div>
          <div>
            <n-difficulty :difficulty="difficultyLevel"/>
          </div>
          <div @mouseleave="drop = false">
            <div class="routine-header__drop">
              <div class="routine-header__drop-btn" @click="drop = !drop">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="routine-header__drop-content" v-if="drop">
                <div @click="$emit('pickRoutine')">
                  Pick another routine
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center text-h2 q-mt-md">
          {{title}}
        </div>
        <div class="text-subtitle1 text-weight-regular">
          {{subtitle}}
        </div>
        <div class="q-my-md text-center">
          <approved-by :author="author" class="justify-center"/>
        </div>
        <div class="flex items-center">
          <div class="routine-info__item" ref="category">
            <routine-category :category="category" size="20px" xsmall/>
          </div>
          <div class="routine-info__item items-center" ref="duration">
            <c-icon icon="timer" />
            <div class="text-subtitle2 q-ml-sm">
              {{routineDuration}} min
            </div>
          </div>
          <div class="q-ml-auto">
            <c-btn outline
                   dense
                   color="white"
                   :bold="false"
                   size="xs"
                   @click="$emit('showList')">
              View sessions
            </c-btn>
          </div>
        </div>
      </div>
      <div class="fixed-button q-px-md q-pb-md" style="z-index: 10">
        <slot></slot>
      </div>
    </div>
<!--    For web-->
    <div class="routine-header--web">
      <div :class="` row ${ minimize ? 'items-center' : 'items-end'} q-mx-auto`"
           style="max-width: 1100px; width: 100%">
        <div :class="`col-12 col-sm-${minimize ? 6 : 8} col-lg-${minimize ? 6 : 9}  relative-position`">
          <div class="routine-header__row routine-info routine-info--1">
            <div class="routine-info__item" ref="category">
              <routine-category :category="category" small/>
            </div>

            <div class="routine-info__item items-center" ref="duration">
              <c-icon icon="timer" />
              <div class="text-h5 q-ml-sm">
                {{routineDuration}} min
              </div>
            </div>

            <div v-if="routineUpdated" class="routine-info__item items-center" ref="lastUpdated">
              <div class="text-h5 q-ml-sm" style="font-weight:400">
                Last updated {{routineUpdated}}
              </div>
            </div>
          </div>

          <div class="routine-header__row q-py-lg">
            <div class="text-h1 overflow-hidden" ref="title" style="white-space: nowrap;text-overflow: ellipsis">
              {{title}}
            </div>

            <div class="text-h5 text-weight-regular" ref="subtitle">
              {{subtitle}}
            </div>
          </div>

          <div class="routine-header__row routine-info routine-info--2">
            <div class="routine-info__item" ref="approvedBy" >
              <approved-by :author="author"/>
            </div>

            <div class="routine-info__item items-center" ref="difficulty">
              <div class="text-h5 q-mr-md">
                Difficulty:
              </div>
              <n-difficulty :difficulty="difficultyLevel"/>
            </div>
          </div>
        </div>
        <div :class="`col-12 col-sm-${minimize ? 6 : 4} col-lg-${minimize ? 6 : 3}`">
          <div class="routine-header__row routine-actions"
               :class="{'routine-actions--small': minimize}">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApprovedBy from './approved-by'
import Difficulty from './difficulty'

import animationSlideUpFadeOut from '@/animations/slideUpFadeOut'

export default {
  components: {
    'routine-category': () => import('@/components/common/activity-category'),
    'approved-by': ApprovedBy,
    'n-difficulty': Difficulty
  },

  data () {
    return {
      drop: false
    }
  },

  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String
    },
    category: {
      type: String,
      required: true,
      default: 'undefined'
    },
    difficultyLevel: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: () => 'N/A'
    },
    minimize: {
      type: Boolean,
      default: false
    },
    routineDuration: {
      type: Number
    },
    routineUpdated: {
      type: String
    },
    shouldStartAnimation: {
      type: Boolean,
      default: false
    },
    backgroundless: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    routineHeaderDisappearAnimation () {
      const el = this.$refs.routineHeader
      if (!el) { return }
      return animationSlideUpFadeOut(el, { delay: 100 })
    },
    categoryDisappearAnimation () {
      const el = this.$refs.category
      if (!el) { return }
      return animationSlideUpFadeOut(el, { translate: '-45px' })
    },
    durationDisappearAnimation () {
      const el = this.$refs.duration
      if (!el) { return }
      return animationSlideUpFadeOut(el, { translate: '-40px' })
    },
    lastUpdatedDisappearAnimation () {
      const el = this.$refs.lastUpdated
      if (!el) { return }
      return animationSlideUpFadeOut(el, { translate: '-35px' })
    },
    titleDisappearAnimation () {
      const el = this.$refs.title
      if (!el) { return }
      return animationSlideUpFadeOut(el, { translate: '-40px' })
    },
    subtitleDisappearAnimation () {
      const el = this.$refs.subtitle
      if (!el) { return }
      return animationSlideUpFadeOut(el)
    },
    approvedByDisappearAnimation () {
      const el = this.$refs.approvedBy
      if (!el) { return }
      return animationSlideUpFadeOut(el)
    },
    difficultyDisappearAnimation () {
      const el = this.$refs.difficulty
      if (!el) { return }
      return animationSlideUpFadeOut(el)
    }
  },

  watch: {
    shouldStartAnimation: function (value) {
      if (value) {
        this.routineHeaderDisappearAnimation.play()
        this.categoryDisappearAnimation.play()
        this.durationDisappearAnimation.play()
        this.lastUpdatedDisappearAnimation.play()
        this.titleDisappearAnimation.play()
        this.subtitleDisappearAnimation.play()
        this.approvedByDisappearAnimation.play()
        this.difficultyDisappearAnimation.play()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.routine-header {
  background-color: $mid-tone;
  padding: 40px;
  border-bottom: 2px solid $soft-tone;
  transition: all .3s ease-in-out;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  &--background {
    background-image: url('../../assets/trainingRoutine/routine-title-background.png');
    background-size: cover !important;
  }
  &--web{
    display: block;
  }
  &--mobile{
    display: none;
  }
  @media (max-width: $breakpoint-tablet-max) {
    &--web{
      display: none;
    }
    &--mobile{
      display: block;
    }
  }
  .routine-info{
    transition: all .1s ease-in-out;
    position: absolute;
    &--1{
      top: 0;
      transform: translateY(-100%);
    }
    &--2{
      bottom: 0;
      transform: translateY(100%);
    }
  }
  .text-h1{
    transition: all .1s ease-in-out;
  }
  &--minimize{
    padding: 20px 40px;
    height: 100px;
    .text-h1{
      font-size: 2.5rem;
    }
    .routine-info{
      opacity: 0;
    }
  }
  @media (max-width: $breakpoint-xs-max) {
    height: auto;
    text-align: center;
    padding: 20px;
    .text-h1{
      font-size: 36px;
      margin-bottom: 16px;
    }
    .routine-info--2{
      flex-direction: column;
      position: relative;
    }
  }
  &__drop{
    position: relative;
    &-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      background: $mid-tone;
      border-radius: 6px;
      z-index: 10;
      width: 200px;
      overflow: hidden;
      border: 1px solid $soft-tone;
      div{
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
}

.routine-info {
  display: flex;
  align-items: center;
  font-weight: bold;
  line-height: 120%;
  color: #DFDAE7;

  &__item {
    display: flex;
    justify-content: center;
    padding: 0 1rem 0 0;
    margin-right: 1rem;
    border-right: 1px solid $soft-tone;

    &:last-child {
      border-right: none;
    }
  }
}

.routine-actions {
  margin: auto 0 0 auto;
  position: relative;
  display: inline-block;
  float: right;
  padding-bottom: 60px;
  transition: all .3s linear;
  & /deep/{
    .n-btn{
      margin: 0;
      width: 230px;
      &:nth-child(2) {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
  &--small{
    padding: 0 240px 0 0;
    & /deep/{
      .n-btn{
        &:nth-child(2) {
          position: absolute;
          white-space: nowrap;
        }
      }
    }
  }
}

@media all and (max-width: $breakpoint-tablet-max) {
  .fixed-button{
    position: fixed;
    max-width: unset!important;
    right: 10px;
    bottom: 20px;
    bottom: env(safe-area-inset-bottom); // iOS 11+
    bottom: constant(safe-area-inset-bottom); // iOS 11
    z-index: 20;
    left: 50%;
  }
}

@media (max-width: $breakpoint-sm-max) {
  .fixed-button{
    left: 10px;
  }
}
</style>
