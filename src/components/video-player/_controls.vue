<template>
  <div class="controls"
       ref="controls"
       @click="doAction"
       :class="{
    'show': show,
    'full': full
  }">
    <div v-if="showRepeat"
         class="float-left">
      <c-icon icon="repeat" width="16px" class="icon"/>
    </div>
    <template v-else>
      <div v-if="!isPlay" class="float-left" data-intercom-target="Play video">
        <c-icon icon="play" width="14px" class="icon"/>
      </div>
      <div v-else class="float-left">
        <c-icon icon="pause" width="14px" class="icon"/>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    showRepeat: {
      type: Boolean,
      default: false
    },
    isPlay: {
      type: Boolean,
      default: false
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    doAction () {
      if (this.showRepeat) {
        this.repeat()
      } else if (this.isPlay) {
        this.pause()
      } else {
        this.play()
      }
    },
    repeat () {
      this.$emit('repeat')
    },
    play () {
      this.$emit('play')
    },
    pause () {
      this.$emit('pause')
    }
  }
}
</script>

<style lang="scss" scoped>
.controls{
  position: absolute;
  bottom: 20px;
  left: 30px;
  z-index: 999;
  .icon{
    filter: brightness(0) invert(1);
    cursor: pointer;
  }
  @media (max-width: $breakpoint-sm-max){
    left: 15px;
    bottom: 15px;
  }
  @media (max-width: $breakpoint-xs-max){
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    background: rgba(0, 0, 0, .7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    opacity: 0;
    &.show{
      opacity: 1;
    }
    .icon{
      transform: scale(2);
    }
  }
}
</style>
