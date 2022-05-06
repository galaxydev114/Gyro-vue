<template>
  <div class="d-flex items-center intro-step5 q-pa-md-lg q-pa-xs-sm">
    <div class="row items-center">
      <div class="col-md-6 col-12 q-px-lg-lg q-px-xs-sm q-px-sm-lg items-center">
        <div class="text-white font-rift" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
          Live Friend Group<br>activities
        </div>
        <div class="text-gray q-mt-lg-md q-mt-sm-md q-mt-xs-sm q-pr-lg-xl text-desc">We will make the experience fun and easy for you. Responsibility for creating and curating events will be on us :)</div>
      </div>
      <div class="col-md-6 col-12 q-px-lg-none q-py-lg-xl q-py-sm-sm q-py-xs-lg q-px-sm-xl q-px-xs-none text-center">
        <div class="step5-icon q-pa-lg-sm q-pa-sm-none">
          <img :src="step5Icon" :width="'100%'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import step5Icon from '@/assets/friend-group/introduction/step5-icon.png'

export default {
  data () {
    return {
      step5Icon
    }
  }
}
</script>

<style lang="scss">
  .intro-step5 {
    height: 490px;
    background: url('../../../../assets/friend-group/introduction/step5-mask.svg'), url('../../../../assets/friend-group/introduction/step5-bg.png');
    background-position-x: right;
    background-position-y: center;
    background-repeat: no-repeat;
    .text-desc {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      background: url('../../../../assets/friend-group/introduction/step5-mask-mobile.svg'), $dark-sec;
      background-position-x: center;
      background-position-y: top;
      background-repeat: no-repeat;
      .text-desc {
        font-size: 16px;
      }
    }
  }
</style>
