<template>
  <div class="intro-step4 q-pa-md-lg q-pa-xs-sm">
    <div class="row items-center q-py-md-xl q-py-xs-md q-py-sm-sm">
      <div class="col-md-5 col-12 q-py-lg-lg q-py-sm-none ">
        <div class="step4-icon q-pa-sm">
          <img :src="step4Icon" :width="'100%'" />
        </div>
      </div>
      <div class="col-md-6 offset-md-1 col-12 q-px-sm">
        <div class="text-white font-rift q-mt-lg-xl q-mt-md-xl q-mt-sm-sm" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
          Zero Toxicity &<br><span class="text-pink">Friendly Environment</span>
        </div>
        <div class="q-mt-md-lg q-mt-sm-sm q-mt-xs-sm text-desc q-pr-xs-lg">There’s no place for toxic people in our community. Our moderators are 24/7 on the guard in all of Friends Groups. Enjoy playing and imrpoving your skills with nice people.</div>
      </div>
    </div>
  </div>
</template>

<script>
import step4Icon from '@/assets/friend-group/introduction/step4-icon.png'
import discordNameIcon from '@/assets/friend-group/introduction/discord-name.svg'

export default {
  data () {
    return {
      step4Icon,
      discordNameIcon
    }
  }
}
</script>

<style lang="scss">
  .intro-step4 {
    height: 490px;
    background: url('../../../../assets/friend-group/introduction/step4-mask.svg'), $dark-sec;
    background-repeat: no-repeat;
    .step4-icon {
      position: absolute;
      bottom: 65px;
      left: 0px;
    }
    .text-desc {
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
      color: $light-pink;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      background: url('../../../../assets/friend-group/introduction/step4-mask-mobile.svg'), $dark-sec;
      background-repeat: no-repeat;
      background-size: cover;
      .text-desc {
        font-size: 16px;
      }
      .step4-icon {
        left: unset;
        right: 0px;
        max-width: 260px;
        bottom: 75px;
      }
    }
    @media screen and (min-width: $breakpoint-xs-max) and (max-width: $breakpoint-sm-max) {
      background: url('../../../../assets/friend-group/introduction/step4-mask-mobile.svg'), $dark-sec;
      background-repeat: no-repeat;
      background-size: cover;
      .step4-icon {
        left: unset;
        right: 0px;
        max-width: 360px;
        bottom: 65px;
      }
    }
  }
</style>
