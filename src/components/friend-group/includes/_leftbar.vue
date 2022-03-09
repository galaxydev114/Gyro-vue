<template>
  <div class="joinfg__leftbar"
       :class="{'joinfg__leftbar--not-rendered': firstInit}"
       ref="leftbar">
    <div class="joinfg__leftbar-header text-left q-px-lg">
      <div class="q-mr-md cursor-clickable" @click="goBack">
        <c-icon icon="leftArrowRounded" class="float-left"/>
        <span class="q-ml-sm">
          Back to Menu
        </span>
      </div>
    </div>
    <div class="joinfg__leftbar-content q-px-lg q-py-lg">
      <div class="row">
        <div class="user-name">
          <div class="text-h2 full-width text-weight-bold">
            <span>
              Matching you to novos friends group
            </span>
          </div>
        </div>
      </div>
      <q-list class="join-fg-steps q-mt-lg">
        <q-item v-for="step in preparingList"
                :key="`p-step-${step.step}`"
                class="q-pl-none join-fg-steps__item"
                :class="`join-fg-steps__item--${stepClass(step)}`">
          <q-item-section side top>
            <div class="join-fg-steps__item-index text-h5">
              <q-icon class="text-h4" name="done" v-if="isStepDone(step)"/>
              <template v-else>
                {{ step.step }}
              </template>
            </div>
          </q-item-section>
          <q-item-section class="join-fg-steps__item-label text-weight-bold text-h5">
            {{ step.label }}
          </q-item-section>
        </q-item>
      </q-list>
      <q-btn v-if="showAgainBtn" class="not-me" outline @click="$emit('not-me')">
        START OVER
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentStep: {
      type: Number,
      default: () => 1
    },
    preparingList: {
      type: Array,
      default: () => []
    },
    showAgainBtn: {
      type: Boolean,
      default: true
    }
  },
  components: {

  },
  data () {
    return {
      firstInit: true
    }
  },
  methods: {
    stepClass (step) {
      if (step.disabled) {
        return 'disable'
      } else {
        return this.currentStep === step.step ? 'active' : this.currentStep > step.step ? 'done' : 'no'
      }
    },
    isStepDone (step) {
      return this.currentStep > step.step && !step.disabled
    },
    goBack () {
      window.history.length > 2 ? this.$router.go(-1) : this.$router.push('/training-plan')
    }
  },
  mounted () {
    setTimeout(() => {
      this.firstInit = false
    }, 200)
  }
}
</script>

<style lang="scss">
.joinfg{
  &__leftbar{
    height: var(--app-height);
    width: 100%;
    max-width: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all .3s ease-in-out;
    position: relative;
    &--not-rendered{
      transform: translateX(-100%);
    }
    &-header{
      height: 80px;
      border-bottom: 1px solid $mid-tone;
      display: flex;
      align-items: center;
    }
    &-content{
      height: calc(100% - 100px);
      padding-bottom: 80px;
    }
    .not-me{
      position: absolute;
      bottom: 30px;
      left: 30px;
    }
    @media all and (max-width: $breakpoint-md-max){
      height: auto;
      &-content{
        height: auto;
      }
      .join-fg-steps{
        transform: scale(0.8);
        transform-origin: 0 0;
      }
    }
  }
}
</style>
