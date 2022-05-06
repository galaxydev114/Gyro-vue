<template>
  <div class="relative-position">
    <lottie-animation
      v-if="!$q.platform.is.mobile"
      path="lottie-animations/MarkAsDone_Button.json"
      :loop="false"
      :autoPlay="false"
      :width="160"
      :height="100"
      class="absolute"
      style="top: -27px; left: 3px"
      @AnimControl="saveAnimationReference"
    />
    <c-btn
      noWidth
      data-intercom-target="Mark As Done"
      :style="{ opacity: !isAnimationPlaying ? 1 : 0 }"
      :flat="$q.screen.lt.sm"
      :dense="$q.screen.lt.sm"
      @click="handleButtonClick"
      class="q-ml-sm"
    >
      <c-icon icon="checkRound" width="32px" class="lt-sm" />
      <span class="gt-xs">{{
        "Mark As Done"
      }}</span>
    </c-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      animationReference: null,
      isAnimationPlaying: false
    }
  },
  methods: {
    saveAnimationReference (reference) {
      this.animationReference = reference
    },
    async handleButtonClick () {
      if (!this.$q.platform.is.mobile) {
        await this.playAnimation()
      }
      this.$emit('click', this.isSingleSession)
    },
    playAnimation () {
      return new Promise((resolve) => {
        this.$emit('animation-start')
        this.isAnimationPlaying = true
        if (this.animationReference) {
          this.animationReference.play()
        }
        setTimeout(() => {
          resolve()
        }, 1800)
      }).finally(() => {
        if (this.animationReference) {
          this.animationReference.stop()
        }
        this.isAnimationPlaying = false
        this.$emit('animation-done')
      })
    }
  }
}
</script>
