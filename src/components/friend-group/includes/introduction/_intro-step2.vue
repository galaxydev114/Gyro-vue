<template>
  <div class="intro-step2 q-pa-md-lg q-pa-xs-sm">
    <div class="row items-center q-py-md-xl q-py-xs-md q-py-sm-sm">
      <div class="col-md-6 col-12 q-px-lg-lg q-px-xs-sm q-px-sm-lg">
        <div class="text-white font-rift q-pr-xs-xl q-pr-md-lg q-pr-sm-xl" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
          The <span class="text-pink">perfect</span> Friend Group for you
        </div>
        <div class="q-my-lg-lg q-my-sm-md q-my-xs-sm text-desc">Based on such preferences:</div>
        <div class="q-mt-md items-center d-flex lt-md">
          <div class="intro-pref-box">
            <img :src="scoreIcon" :width="19" /><span class="q-ml-sm">Skill score</span>
          </div>
        </div>
        <div class="q-mt-sm items-center d-flex gt-sm">
          <div class="intro-pref-box">
            <img :src="scoreIcon" :width="21" /><span class="q-ml-sm">Skill score</span>
          </div>
          <div class="intro-pref-box">
            <img :src="timerIcon" :width="18" /><span class="q-ml-sm">Preferred time to play</span>
          </div>
        </div>
        <div class="q-mt-sm items-center d-flex">
          <div class="intro-pref-box">
            <img :src="platformIcon" :width="18" /><span class="q-ml-sm">Platform</span>
          </div>
          <div class="intro-pref-box">
            <img :src="langIcon" :width="18" /><span class="q-ml-sm">Language</span>
          </div>
          <div class="intro-pref-box gt-sm">
            <img :src="locationIcon" :width="18" /><span class="q-ml-sm">Location</span>
          </div>
        </div>
        <div class="q-mt-sm items-center d-flex lt-md">
          <div class="intro-pref-box">
            <img :src="timerIcon" :width="18" /><span class="q-ml-sm">Preferred time to play</span>
          </div>
          <div class="intro-pref-box">
            <img :src="locationIcon" :width="18" /><span class="q-ml-sm">Location</span>
          </div>
        </div>
      </div>
      <div class="d-flex col-md-6 w-100 col-12 justify-center items-center">
        <div class="step2-icon q-mt-xl">
          <img :src="step2Icon" :width="'100%'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import step2Icon from '@/assets/friend-group/introduction/step2-icon.png'
import locationIcon from '@/assets/friend-group/introduction/location.svg'
import platformIcon from '@/assets/friend-group/introduction/platform.svg'
import langIcon from '@/assets/friend-group/introduction/language.svg'
import timerIcon from '@/assets/friend-group/introduction/timer.svg'
import scoreIcon from '@/assets/friend-group/introduction/score.svg'

export default {
  data () {
    return {
      step2Icon,
      locationIcon,
      platformIcon,
      langIcon,
      timerIcon,
      scoreIcon
    }
  }
}
</script>

<style lang="scss">
  .intro-step2 {
    height: 490px;
    background: url('../../../../assets/friend-group/introduction/step2-mask.svg'), linear-gradient(151.27deg, #EA86B4 18.81%, #D886DA 85.12%);
    .step2-icon {
      position: absolute;
      bottom: 72px;
    }
    .text-desc {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
    }
    .intro-pref-box {
      background: rgba(255, 255, 255, 0.7);
      border-radius: 14px;
      align-items: center;
      padding: 8px 16px;
      display: flex;
      margin-right: 10px;
      span {
        color: #26242D;
      }
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      background: url('../../../../assets/friend-group/introduction/step2-mask-mobile.svg'), linear-gradient(151.27deg, #EA86B4 18.81%, #D886DA 85.12%);
      .text-desc {
        font-size: 16px;
      }
      .step2-icon {
        max-width: 160px;
        bottom: 83px;
      }
      .intro-pref-box {
        padding: 6px 12px;
        border-radius: 12px;
        span {
          font-size: 12px;
        }
      }
    }
    @media screen and (min-width: $breakpoint-xs-max) and (max-width: $breakpoint-sm-max) {
      .step2-icon {
        max-width: 160px;
        bottom: 73px;
      }
    }
  }
</style>
