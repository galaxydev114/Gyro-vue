<template>
  <div class="courses-workshops relative-position">
    <div class="courses-workshops__top-line">
      <div class="flex align-center cursor-clickable" @click="$emit('back')">
        <c-icon icon="leftArrowRounded" class="q-mr-sm"/>
        <span class="opacity-25">Go back</span>
      </div>
      <!-- <div class="flex align-center">
        <div class="q-ml-md">
          <c-icon icon="change"></c-icon>
        </div>
        <div class="q-ml-md">
          <c-icon icon="supportPink"></c-icon>
        </div>
        <div class="q-ml-md">
          <c-icon icon="starPink"></c-icon>
        </div>
        <div class="q-ml-md">
          <c-icon icon="sharePink"></c-icon>
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
                    {{ data.duration }} min
                  </div>
                </div>
              </div>
            </div>
            <div class="q-col-12 q-my-md">
              <div class="text-h2">
                {{ data.title }}
              </div>
              <div class="q-mt-xs">
                {{ data.subtitle }}
              </div>
            </div>
            <div class="q-col-12">
              <div class="information">
                <div class="information__item">
                  <n-approved-by :author="data.approvedBy"/>
                </div>
                <div class="information__item flex items-center">
                  <span class="q-mr-sm">Difficulty:</span>
                  <n-difficulty :difficulty="data.difficulty"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="courses-workshops__content q-mt-lg">
        <div class="container">
          <checkpoints-video-player
            ref="videoPlayer"
            :externalTrackAction="trackAction"
            :src="data.videoUrl"
            :timestamps="timestampsTransformed"
            :poster="data.thumbnail" />
        </div>
        <div class="container bordered bordered--top q-mt-lg q-pt-xl q-mt-xl">
          <div class="flex">
            <div class="courses-workshops__content-left bordered bordered--right q-pr-xl">
              <credits :credits="computedCredits" :paddingTop="false"/>
            </div>
            <div class="courses-workshops__content-right q-pl-xl">
              <div class="text-h4 q-mb-md">
                Would you like to have your gameplay as a workshop?
              </div>
              <div class="q-mb-md">
                Submit your replay and Novos coach will analyse if your<br/>
                content can be turned into a workshop.
              </div>
              <div>
                <c-btn @click="submitReplay" outline noWidth class="inline-block" text-color="light-pink">
                  submit replay
                </c-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="courses-workshops__footer">
      <div class="row justify-between items-center full-width">
        <div class="courses-workshops__footer-info q-col-6 row">
          <div class="q-ml-md">
            <div class="text-h4 q-mb-xs">{{ data.title }}</div>
            <div class="opacity-25">{{ data.duration }} minutes</div>
          </div>
        </div>
        <div class="courses-workshops__footer-action q-col-6 text-right">
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
import ApprovedBy from 'components/training-routine/approved-by'
import Difficulty from 'components/training-routine/difficulty'
import { mapGetters } from 'vuex'

export default {
  components: {
    'routine-category': () => import('@/components/common/activity-category'),
    'n-approved-by': ApprovedBy,
    'n-difficulty': Difficulty,
    credits: () => import('@/components/common/credits'),
    'checkpoints-video-player': () => import('@/components/checkpoints-video-player'),
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
    ...mapGetters({
      currentUser: 'user/currentUser'
    }),
    timestampsTransformed () {
      return this.data.timestamps.map(timestamp => {
        const [minutes, seconds] = timestamp.pointOfTime.split(':')
        const exactSeconds = (Number(minutes) * 60) + Number(seconds)
        return {
          ...timestamp,
          pointOfTime: exactSeconds
        }
      })
    },
    computedCredits () {
      const credit = this.data?.credits
      if (credit && Object.keys(credit).length > 0 && credit.title !== '') {
        return [{ title: credit.title, value: credit.name, code: credit.sac, url: credit.url }]
      }
      return []
    }
  },
  methods: {
    // TODO refactor for public
    submitReplay () {
      this.trackAction('Workshops: Click submit replay')
      window.open(`https://novos.typeform.com/to/zT9zWbDk#email=${this.currentUser.email}`, '_blank')
    },
    trackAction () {
      this.$emit('analytics', ...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
.courses-workshops {
  $root: &;
  position: relative;
  padding: 56px 0 80px;
  overflow: auto;
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
    position: fixed;
    padding: 0 40px;
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

  &__content {
    &-left{
      width: 300px;
    }
    &-right{
      width: calc( 100% - 300px );
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
  }

  .container {
    width: 100%;
    // margin: 0 auto;
    display: block;
    padding-right: 200px;
    padding-left: 200px;
    @media (max-width: $breakpoint-tablet-max) {
      padding-right: 100px;
      padding-left: 100px;
    }

    @media (max-width: $breakpoint-mobile-max) {
      padding-right: 10px;
      padding-left: 10px;
    }
  }

  .bordered {
    &--top {
      border-top: 1px solid $soft-tone;
    }

    &--right {
      border-right: 1px solid $soft-tone;
    }
  }

  @media (max-width: $breakpoint-tablet-max) {
    .container{
      width: 100%;
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

    #{$root}__content-left,
    #{$root}__content-right{
      padding: 0;
      margin: 0;
      border: none;
      width: 100%!important;
    }

    #{$root}__content-left{
      margin-bottom: 40px;
    }

    #{$root}__footer{
      padding: 20px;
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
