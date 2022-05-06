<template>
    <div class="pref-box q-pa-sm  row full-width justify-center">
      <div v-if="preferences && preferences.platform" class="q-px-md-xs q-px-sm-none" :class="{'col': $q.screen.gt.xs}">
        <div class="d-flex items-center justify-center pref-box--bg pref-box--bg-xbox q-px-lg-none q-px-md-none q-px-sm-none q-px-xs-md">
          <img :src="getPlatformIcon(preferences.platform)"
               v-if="getPlatformIcon(preferences.platform)"
               width="18px"
               :alt="preferences.platform"/>
          <span class="q-ml-sm">
            {{ preferences.platform }}
          </span>
        </div>
      </div>
      <div v-if="preferences && preferences.availability" class="q-px-md-xs q-px-sm-none" :class="{'col': $q.screen.gt.xs}">
        <div class="d-flex items-center justify-center pref-box--bg pref-box--bg-time q-px-lg-none q-px-md-none q-px-sm-none q-px-xs-md">
          <img
            :src="timeIcon"
            :width="18"
            :height="18"/>
          <span class="q-pl-xs-sm q-pl-sm-xs q-pl-md-sm">
            {{`Time: ${preferences.availability}`}}
          </span>
        </div>
      </div>
      <div v-if="preferences && preferences.region" class="q-px-md-xs q-px-sm-none" :class="{'col': $q.screen.gt.xs}">
        <div class="d-flex items-center justify-center pref-box--bg pref-box--bg-location q-px-lg-none q-px-md-none q-px-sm-none q-px-xs-md">
          <img
            :src="locationIcon"
            :width="18"
            :height="18"/>
          <span class="q-ml-sm">
            {{preferences.region}}
          </span>
        </div>
      </div>
      <div v-if="preferences && preferences.skillScore" class="q-px-md-xs q-px-sm-none" :class="{'col': $q.screen.gt.xs}">
        <div class="d-flex items-center justify-center pref-box--bg pref-box--bg-level q-px-lg-none q-px-md-none q-px-sm-none q-px-xs-md">
          <img :src="getSkillLang(preferences.skillScore)"
               v-if="getSkillLang(preferences.skillScore)"
               width="18px"
               :alt="preferences.skillScore"/>
          <span class="q-ml-sm">
            {{preferences.skillScore}}
          </span>
        </div>
      </div>
      <div v-if="preferences && preferences.language" class="q-px-md-xs q-px-sm-none" :class="{'col': $q.screen.gt.xs}">
        <div class="d-flex items-center justify-center pref-box--bg pref-box--bg-lang q-px-lg-none q-px-md-none q-px-sm-none q-px-xs-md">
          <img :src="getLangFlagIcon(preferences.language)"
               v-if="getLangFlagIcon(preferences.language)"
               width="18px"
               :alt="preferences.language"/>
          <span class="q-ml-sm">
            {{preferences.language}}
          </span>
        </div>
      </div>
    </div>
</template>

<script>
import timeIcon from '@/assets/friend-group/time.svg'
import locationIcon from '@/assets/friend-group/location.svg'

export default {
  props: {
    preferences: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      timeIcon,
      locationIcon
    }
  },
  methods: {
    getPlatformIcon (platform) {
      switch (platform.toLowerCase()) {
        case 'pc':
          return require('@/assets/platforms/desktop.svg')
        case 'mobile':
          return require('@/assets/platforms/mobile.svg')
        case 'console':
          return require('@/assets/platforms/ps.svg')
        case 'xbox':
          return require('@/assets/platforms/xbox.svg')
        case 'nintendo':
          return require('@/assets/platforms/nintendo.svg')
      }
    },
    getLangFlagIcon (locale) {
      switch (locale) {
        case 'English':
          return require('@/assets/friend-group/uk-flag.svg')
        case 'Spanish':
          return require('@/assets/friend-group/sp-flag.svg')
        case 'French':
          return require('@/assets/friend-group/fr-flag.svg')
      }
    },
    getSkillLang (locale) {
      switch (locale) {
        case 'Beginner':
          return require('@/assets/icons/bronze-icon.webp')
        case 'Advanced':
          return require('@/assets/icons/silver-icon.webp')
        case 'PRO':
          return require('@/assets/icons/gold-icon.webp')
      }
    }
  }
}
</script>

<style lang="scss">
  .pref-box {
    background: #1F183A;
    border-radius: 18px;
    .q-btn {
      font-size: 20px;
    }
    span {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      color: #F4D8E9;
    }
    &--bg {
      box-sizing: border-box;
      border-radius: 100px;
      padding-top: 6px;
      padding-bottom: 6px;
      &-xbox {
        background: rgba(44, 173, 109, 0.3);
        border: 1.5px solid #2CAD6D;
      }
      &-time {
        background: rgba(207, 115, 79, 0.3);
        border: 1.5px solid #E3734F;
      }
      &-location {
        background: rgba(62, 133, 200, 0.3);
        border: 1.5px solid #3E85C8;
      }
      &-level {
        background: rgba(248, 201, 70, 0.3);
        border: 1.5px solid #F8C946;
      }
      &-lang {
        background: rgba(79, 209, 207, 0.3);
        border: 1.5px solid #4FD1E3;
      }
    }
    @media screen and (max-width: $breakpoint-sm-max) {
      &--bg {
        margin: 2px;
      }
    }
  }
</style>
