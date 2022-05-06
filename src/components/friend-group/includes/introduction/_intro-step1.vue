<template>
  <div class="d-flex items-center intro-step1 q-pa-md-lg q-pa-xs-sm">
    <div class="row items-center">
      <div class="col-md-6 col-12 q-px-lg-lg q-px-xs-sm q-px-sm-lg items-center" :class="{'text-center': $q.screen.lt.md}">
        <div class="text-white font-rift" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
          Introducing Novos <br><span class="text-pink">Friend Groups</span>
        </div>
        <div class="text-gray text-desc q-pr-md-xl q-pr-xs-none q-mt-sm">Discord Friends Groups organized by NOVOS. </div>
      </div>
      <div class="col-md-6 col-12 q-py-sm-md q-py-xs-lg q-px-sm-md q-px-xs-sm text-center">
        <div class="bordered-icon q-pa-sm d-flex items-center">
          <img :src="itemIcon" :width="'100%'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import itemIcon from '@/assets/friend-group/introduction/step1-icon.png'

export default {
  data () {
    return {
      itemIcon
    }
  }
}
</script>

<style lang="scss">
  .intro-step1 {
    height: 490px;
    background: url('../../../../assets/friend-group/introduction/step1-mask.svg'), $dark-sec;
    background-repeat: no-repeat;
    .text-desc {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
    }
    .bordered-icon {
      border: 2px solid $soft-tone;
      box-sizing: border-box;
      border-radius: 36px;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      .bordered-icon {
        border-radius: 30px;
      }
      .text-desc {
        font-size: 16px;
      }
    }
    @media screen and (min-width: $breakpoint-xs-max) and (max-width: $breakpoint-sm-max) {
      .bordered-icon {
        display: inline-flex;
      }
    }
  }
</style>
