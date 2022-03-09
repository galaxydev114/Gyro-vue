<template>
  <div class="time-bar">
    <div class="time-bar__container relative-position">
      <div class="time-bar__hover-time column items-center"
           :data-has-thumbnail="!!hoverThumbnail"
           :style="`left: clamp(var(--thumb-offset), ${hoverPosition}px, calc(100% - var(--thumb-offset)))`"
           v-if="hoverPosition && hoverTime">
        <div v-if="hoverThumbnail"
          class="time-bar__hover-time-thumbnail q-mb-xs"
        >
          <div
            style="transform-origin: top left;"
            :style="{
              'background-image': `url(${hoverThumbnail.url})`,
              'background-position-x': `-${hoverThumbnail.x}px`,
              'background-position-y': `-${hoverThumbnail.y}px`,
              'transform': `scale(calc(var(--thumb-width) / ${hoverThumbnail.width}))`,
              'width': `${hoverThumbnail.width}px`,
              'height': `${hoverThumbnail.height}px`
            }"/>
        </div>
        <span>{{ hoverTime | time }}</span>
      </div>
      <div class="time-bar__full"
           :class="{'time-bar__full--transparent': transparent}"
           @click="setTime"
           @mouseleave="timeLineOut"
           @mousemove="timeLineHover"></div>
      <div class="time-bar__active time-bar__active--preview"
           :style="`width: ${hoverPercent}%`"></div>
      <div class="time-bar__active"
           :style="`width: ${timeProgress}%`"></div>
    </div>
  </div>
</template>

<script>
import clamp from '@/util/clamp'
import timeFilter from '@/filters/time.filter'
import videoTimelineMixin from '@/mixins/videoTimeline.mixin'

export default {
  mixins: [videoTimelineMixin],
  props: {
    totalTime: {
      type: Number,
      require: true
    },
    currentTime: {
      type: Number,
      require: true
    },
    transparent: {
      type: Boolean,
      require: true
    },
    storyboard: {
      type: Object,
      default: null
    }
  },
  methods: {
    setTime (event) {
      const targetFactor = event.offsetX / event.target.clientWidth
      const targetTime = clamp(targetFactor * this.totalTime, 0, this.totalTime) || this.currentTime
      this.$emit('seek', targetTime)
    }
  },
  filters: {
    time: timeFilter
  }
}
</script>

<style lang="scss" scoped>

.time-bar{
  $root: &;
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 10px;
  display: flex;
  align-items: center;
  z-index: 1000;
  &__hover-time{
    position: absolute;
    bottom: 20px;
    padding: 3px 6px;
    border-radius: 4px;
    background-color: rgba($dark-sec, .7);
    font-size: 12px;
    color: #fff;
    transform: translateX(-50%);
    z-index: 99999;

    $thumbWidth: 30;
    &[data-has-thumbnail="true"] {
      $thumbWidth: 160;
    }
    --thumb-width: #{$thumbWidth};
    --thumb-width-px: #{1px * $thumbWidth};
    --thumb-offset: calc(var(--thumb-width-px) / 2 + 10px);
    &-thumbnail {
      width: var(--thumb-width-px);
      height: 90px;
    }
  }
  &__container{
    width: 100%;
    cursor: pointer;
  }
  &__full{
    width: 100%;
    top: 0;
    height: 10px;
    background-color: $dark-sec;
    position: relative;
    border-left: none;
    border-bottom: 1.5px solid $soft-tone;
    border-top: 1.5px solid $soft-tone;
    &--transparent{
      background: rgba(#1C102C, .8);
    }
  }
  &__active{
    border-radius: 0 5px 5px 0;
    pointer-events: none;
    position: absolute;
    height: 4px;
    left: 0;
    top: 3.5px;
    background: $pink;
    &--preview {
      background: rgba($midGray, 0.5);
    }
    z-index: 8;
  }
  @media (max-width: $breakpoint-sm-max){
    bottom: 50px;
  }
}
</style>
