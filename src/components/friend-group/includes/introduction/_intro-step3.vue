<template>
  <div class="d-flex items-center intro-step3 q-pa-md-lg q-pa-xs-sm">
    <div class="row items-center">
      <div class="col-md-5 col-12 q-px-lg-lg q-px-xs-sm q-px-sm-lg">
        <div class="text-white font-rift" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
          It all takes place <br> in discord
        </div>
        <div class="q-mt-lg text-gray text-desc">We created groups in Discord, where all of the fun will take place.</div>
      </div>
      <div class="col-md-6 offset-md-1 col-12 q-py-sm-md q-py-xs-lg q-px-sm text-center">
        <div class="gt-sm text-center">
          <img :src="discordNameIcon" :width="225" />
        </div>
        <div class="step3-icon">
          <img :src="step3Icon" :width="'100%'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import step3Icon from '@/assets/friend-group/introduction/step3-icon.svg'
import discordNameIcon from '@/assets/friend-group/introduction/discord-name.svg'

export default {
  data () {
    return {
      step3Icon,
      discordNameIcon
    }
  }
}
</script>

<style lang="scss">
  .intro-step3 {
    height: 490px;
    background: url('../../../../assets/friend-group/introduction/step3-mask.svg'), $blue;
    background-position-y: bottom;
    background-repeat: no-repeat;
    .text-desc {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      background: url('../../../../assets/friend-group/introduction/step3-mask-mobile.svg'), $blue;
      background-position-y: bottom;
      background-repeat: no-repeat;
      background-size: cover;
      .text-desc {
        font-size: 16px;
        padding-right: 50px;
      }
    }
    @media screen and (min-width: $breakpoint-xs-max) and (max-width: $breakpoint-sm-max) {
      .step3-icon {
        display: inline-flex;
      }
    }
  }
</style>
