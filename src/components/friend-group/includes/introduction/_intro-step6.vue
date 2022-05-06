<template>
  <div class="d-flex items-center intro-step6 q-pa-md-lg q-pa-xs-sm">
    <div class="row items-center">
      <div class="col-md-5 col-12 q-px-lg-lg q-px-xs-sm q-px-sm-lg items-center">
        <div class="text-white font-rift" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
          Get your best <br>team now
        </div>
        <div class="text-gray q-mt-lg-md q-mt-sm-sm q-mt-xs-sm q-pr-md text-desc">Keep up with your peers and simply have fun! You can leave or change the group any time.</div>
      </div>
      <div class="col-md-7 col-12 q-py-sm-none q-py-xs-none q-px-sm-xl q-px-xs-md text-center">
        <div class="step6-icon q-pa-sm-md">
          <img :src="step6Icon" :width="'100%'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import step6Icon from '@/assets/friend-group/introduction/step6-icon.svg'

export default {
  data () {
    return {
      step6Icon
    }
  }
}
</script>

<style lang="scss">
  .intro-step6 {
    height: 490px;
    background: url('../../../../assets/friend-group/introduction/step6-bg.png'), #5865F2;
    background-repeat: no-repeat;
    .text-desc {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      .text-desc {
        font-size: 16px;
      }
    }
    @media screen and (min-width: $breakpoint-xs-max) and (max-width: $breakpoint-sm-max) {
      .step6-icon {
        max-width: 390px;
        display: inline-flex;
      }
    }
  }
</style>
