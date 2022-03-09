<template>
  <div class="time-bar"
       :class="{'time-bar--mobile': $q.screen.lt.lg}"
       data-intercom-target="Workshop Time Bar">
    <div class="time-bar__time time-bar__time">
      {{ currentTime | time}} / {{ totalTime | time }}
    </div>
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
        @click="setTime"
        @mouseleave="timeLineOut"
        @mousemove="timeLineHover"></div>
      <div class="time-bar__active time-bar__active--preview"
           :style="`width: ${hoverPercent}%`"></div>
      <div class="time-bar__active"
           :style="`width: ${timeProgress}%`"></div>
      <div class="time-bar__checkpoints">
        <div
          v-for="checkpoint of checkpoints"
          :class="{
          'done' : checkpoint < Math.floor(currentTime),
          'current': checkpoint === Math.floor(currentTime)
        }"
          :key="checkpoint"
          :style="`left: ${calculateCheckpointPosition(checkpoint)}%`"
        ></div>
      </div>
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
    checkpoints: {
      type: Array,
      default: () => []
    },
    totalTime: {
      type: Number,
      require: true
    },
    currentTime: {
      type: Number,
      require: true
    }
  },
  computed: {
    timeProgress () {
      const progress = this.currentTime / this.timePercent
      return clamp(progress, 0, 100)
    },
    timePercent () {
      return this.totalTime ? this.totalTime / 100 : 0
    }
  },
  methods: {
    calculateCheckpointPosition (time) {
      return (time * 100) / this.totalTime
    },
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
$positionDimension: 20px;

.time-bar{
  $root: &;
  position: absolute;
  bottom: $positionDimension / 2;
  left: $positionDimension;
  right: $positionDimension;
  height: 36px;
  padding: 10px 0;
  display: flex;
  align-items: center;
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
    border-radius: 0 8px 8px 0;
    top: 0;
    height: 16px;
    border: 2px solid $soft-tone;
    background: rgba(67, 53, 88, 0.5);
    position: relative;
    border-left: none;
  }
  &__active{
    pointer-events: none; // so that time bar can be clicked by user
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border: 2px solid $green;
    border-left: none;
    background: rgba(44, 173, 109, 0.3);
    border-radius: 0 8px 8px 0;
    z-index: 8;
    &--preview {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
  }
  &__checkpoints{
    pointer-events: none; // so that time bar can be clicked by user
    position: absolute;
    border: 3px solid transparent;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
    z-index: 9;
    transform: translateX(-10px);
    div{
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background: $dark-pink;
      position: absolute;
      display: inline-block;
      z-index: 10;
      &.done{
        background: $green;
      }
      &.current{
        background: $gray;
      }
    }
  }
  &__time{
    padding: 4px 6px;
    background: rgba(67, 53, 88, 1);
    border-radius: 8px;
    font-size: 12px;
    font-weight: bold;
    z-index: 999;
    transition: all .2s ease;
    left: 0;
    white-space: nowrap;
    box-shadow: 0 0 3px #000;
  }
  &--mobile{
    padding: 0;
    bottom: -8px;
    height: 16px;
    left: 0;
    right: 0;
    border-bottom: 1px solid #000;
    #{$root}__full,
    #{$root}__active{
      border-radius: 0;
      border: none;
      height: 16px;
    }
    #{$root}__full{
      background: $mid-tone
    }
    #{$root}__checkpoints{
      transform: none;
      border: none;
      opacity: .7;
      div{
        height: 16px;
        width: 3px;
        transform: translateX(-1px);
        border-radius: 0;
      }
    }
    #{$root}__time{
      padding: 0 4px;
      height: 16px;
      line-height: 16px;
      border-radius: 0;
      box-shadow: none;
      font-size: 10px;
      background: #000;
      font-weight: normal;
    }
  }
}
</style>
