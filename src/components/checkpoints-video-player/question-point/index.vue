<template>
  <div class="question-point">
    <div class="explanation" :class="{'explanation--active' : explainBlock}">
      <div class="question-point__header text-subtitle1 font-rift text-gray opacity-5 q-mb-sm">
        Explanation
      </div>
      <slot name="explanation"/>
    </div>
    <div class="block" :class="{'block--active' : !explainBlock}">
      <div class="question-point__header text-subtitle1 font-rift text-gray opacity-5">
        question {{ current }} of {{ total }}
      </div>
      <div class="text-h4 q-my-md">
        {{ title }}
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      require: true
    },
    current: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    showExplanation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      explainBlock: false
    }
  },
  watch: {
    showExplanation () {
      if (this.showExplanation) {
        setTimeout(() => {
          this.explainBlock = true
        }, 2000)
      } else {
        this.explainBlock = false
      }
    }
  }
}
</script>

<style lang="scss">
.question-point{
  padding: 30px;
  border-radius: 6px;
  background: $dark;
  max-height: 100%;
  height: auto;
  overflow-y: auto;
  @media all and (max-width: $breakpoint-mobile-max) {
    padding: 10px;
  }
  .block,
  .explanation{
    height: auto;
    max-height: 0;
    transition: all .2s linear;
    overflow: hidden;
    opacity: 0;
    &--active{
      max-height: 800px;
      opacity: 1;
    }
  }
}
</style>
