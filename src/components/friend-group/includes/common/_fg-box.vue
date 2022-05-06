<template>
  <div class="fg-box-details q-px-lg-lg q-px-sm-sm row items-center">
    <div class="col-md-9 col-6 q-py-md q-px-md">
      <div class="text-fg-discord text-gray">
        Discord Friends Group
      </div>
      <div class="text-white"
        :class="{'text-h1': !$q.screen.lt.sm, 'text-h3': $q.screen.lt.sm}"
      >
        {{name}}
      </div>
    </div>
    <div v-if="region" class="col-md-3 col-6 q-py-md text-right q-pr-md">
      <img :src="getRegionImageSrc" class="q-mt-md map-icon full-width" alt="open-league" />
    </div>
  </div>
</template>

<script>

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    region: {
      type: String,
      default: null
    }
  },
  computed: {
    getRegionImageSrc () {
      switch (this.region) {
        case 'Europe':
          return require('@/assets/friend-group/map/eu.svg')
        case 'North America East':
          return require('@/assets/friend-group/map/nae.svg')
        case 'South America':
          return require('@/assets/friend-group/map/sa.svg')
        case 'North America West':
          return require('@/assets/friend-group/map/naw.svg')
        case 'Asia':
          return require('assets/friend-group/map/as.svg')
        case 'Middle East':
          return require('@/assets/friend-group/map/me.svg')
        case 'Oceania':
          return require('assets/friend-group/map/au.svg')
        case 'Africa':
          return require('assets/friend-group/map/af.svg')
        default:
          return require('@/assets/friend-group/map/eu.svg')
      }
    }
  }
}
</script>

<style lang="scss">
  .fg-box-details {
    background: $dark-one;
    border-radius: 24px;
    background: url('../../../../assets/friend-group/discord-pattern.svg'), #5865F2;
    background-size: cover;
    max-height: 221px;
    .text-fg-discord {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
    }
    .map-icon {
      height: 172px;
    }
    @media all and (max-width: $breakpoint-sm-max) {
      border-radius: 16px;
      .text-fg-discord {
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
      }
      .map-icon {
        height: 142px;
      }
    }
  }
</style>
