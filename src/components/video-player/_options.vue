<template>
  <div class="options-dropdown setting"
       :class="{'options-dropdown--bottom': top, 'top-setting': top}">
    <c-icon :icon="top ? 'cogRounded' : 'setting'"
            :width="top ? '20px' : '16px'"
            class="icon"
            @click="$emit('click')"/>
    <div class="options-dropdown__container"
         :style="{ 'max-height': maxHeight }"
         v-outside-click="hide"
         v-if="dropName === 'options'">
      <template v-if="showSub">
        <template v-if="showSub === 'speed'">
          <div class="title flex items-center"
               @click="toggleSubDropdown('speed')">
            <c-icon icon="leftArrowRounded"
                    width="16px"
                    class="cursor-pointer q-mr-sm"/>
            Speed
          </div>
          <ul class="sub">
            <li v-for="(s, i) in speedOptions"
                :key="i"
                :class="{'active': s === speed}"
                @click="selectSpeed(s)">
              {{ s }}x
            </li>
          </ul>
        </template>
        <template v-if="showSub === 'quality'">
          <div class="title flex items-center"
               @click="toggleSubDropdown('quality')">
            <c-icon icon="leftArrowRounded"
                    width="16px"
                    class="cursor-pointer q-mr-sm"/>
            Quality
          </div>
          <ul class="sub">
            <li v-for="(q, i) in qualityOptions"
                :key="i"
                :class="{'active': q === speed}"
                @click="selectQuality(q)">
              {{ q | capitalize }}
            </li>
          </ul></template>
        <template v-if="showSub === 'subtitle'">
          <div class="title flex items-center"
               @click="toggleSubDropdown('subtitle')">
            <c-icon icon="leftArrowRounded"
                    width="16px"
                    class="cursor-pointer q-mr-sm"/>
            Subtitle
          </div>
          <ul class="sub">
            <li :class="{'active': subtitle}"
                @click="selectSubtitle(true)">
              On
            </li>
            <li :class="{'active': !subtitle}"
                @click="selectSubtitle(false)">
              Off
            </li>
          </ul></template>
      </template>
      <ul v-else>
        <li class="row justify-between items-center" @click="toggleSubDropdown('speed')">
          Speed
          <span class="text-weight-bold text-dark-pink flex items-center">
                  {{ speed }}x <c-icon icon="rightChevron" width="8px" class="q-ml-sm"/>
                </span>
        </li>
        <li class="row justify-between items-center" @click="toggleSubDropdown('quality')"
          v-if="qualityOptions.length > 0">
          Quality
          <span class="text-weight-bold text-dark-pink flex items-center">
                  {{ quality }} <c-icon icon="rightChevron" width="8px" class="q-ml-sm"/>
                </span>
        </li>
        <li class="row justify-between items-center"
            v-if="top && hasSubtitles"
            @click="toggleSubDropdown('subtitle')">
          Subtitle
          <span class="text-weight-bold text-dark-pink flex items-center">
                  {{ subtitle ? 'On' : 'Off' }} <c-icon icon="rightChevron" width="8px" class="q-ml-sm"/>
                </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    top: {
      type: Boolean,
      default: false
    },
    playerHeight: {
      type: Number,
      default: 0
    },
    dropName: {
      type: String,
      default: ''
    },
    speed: {
      type: String,
      required: true
    },
    quality: {
      type: String,
      required: true
    },
    qualityOptions: {
      type: Array,
      default: () => []
    },
    subtitle: {
      type: Boolean,
      required: true
    },
    hasSubtitles: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showSub: '',
      speedOptions: ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'],
      speed_: undefined,
      quality_: undefined,
      subtitle_: undefined
    }
  },
  computed: {
    maxHeight () {
      return this.playerHeight
        ? ((this.playerHeight - 50) * 0.8) + 'px'
        : 'initial'
    }
  },
  filters: {
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    toggleSubDropdown (type) {
      if (this.showSub === type) {
        this.showSub = null
        return
      }
      this.showSub = type
    },
    select () {
      this.showSub = null
      this.$emit('select', {
        speed: this.speed_ || this.speed,
        quality: this.quality_ || this.quality,
        subtitle: this.subtitle_ || this.subtitle
      })
    },
    selectSpeed (val) {
      this.speed_ = val
      this.showSub = null
      this.select()
    },
    selectQuality (val) {
      this.quality_ = val
      this.showSub = null
      this.select()
    },
    selectSubtitle (val) {
      this.subtitle_ = val
      this.showSub = null
      this.select()
    },
    hide () {
      this.showSub = null
      this.$emit('hide')
    }
  }
}
</script>

<style lang="scss" scoped>

.options-dropdown{
  position: relative;
  z-index: 9999;
  .icon{
    cursor: pointer;
    /deep/ img:hover{
      opacity: 1;
    }
  }
  &__container{
    position: absolute;
    bottom: 40px;
    padding: 7px 15px;
    border-radius: 6px;
    border: 1px solid $soft-tone;
    background-color: $dark-one;
    left: 50%;
    transform: translateX(-50%);
    min-width: 160px;
    overflow-y: auto;
    .title{
      padding: 15px;
      margin: -7px -15px 0;
      border-bottom: 1px solid $soft-tone;
    }
    ul{
      padding: 0;
      margin: 0;
      li{
        list-style: none;
        padding: 7px 0;
        font-size: 12px;
        color: #DFDAE7;
        display: flex;
        align-items: center;
        &:hover{
          color: #FFF!important;
          cursor: pointer;
          filter: brightness(0) invert(1);
        }
      }
      &.sub{
        li{
          &.active{
            color: $dark-pink;
            font-weight: bold;
          }
        }
      }
    }
  }
  &--bottom{
    .options-dropdown__container{
      top: 30px;
      bottom: unset;
      right: 0;
      left: unset;
      transform: unset;
    }
  }
}

.top-setting{
  position: absolute!important;
  top: 15px;
  right: 15px;
}

</style>
