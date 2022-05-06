<template>
  <div class="col q-px-md q-py-md border-bottom items-center lt-md join-fg-menu">
    <div class="full-width q-mr-md cursor-clickable" @click="goBack">
      <c-icon icon="leftArrowRounded" class="float-left"/>
      <span class="q-ml-sm">
        Back to Menu
      </span>
    </div>
    <div class="q-mt-lg ">
      <div class="join-fg-steps-bar">
        <div class="row join-fg-top-steps">
          <q-item v-for="step in preparingList"
                  :key="`p-step-${step.step}`"
                  class="q-pl-none join-fg-top-steps__item"
                  :class="[`join-fg-top-steps__item--${stepClass(step)}`, {'col': step.step < preparingList.length}]">
            <q-item-section class="join-fg-top-steps__item-section">
              <div class="join-fg-top-steps__item-index">
                <q-icon class="text-caption" name="done" v-if="isStepDone(step)"/>
              </div>
            </q-item-section>
          </q-item>
        </div>
      </div>
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
  }
}
</script>

<style lang="scss">
  .join-fg-menu {
    position: relative;
    background: linear-gradient(180deg, rgba(35, 21, 56, 0.3) 0%, #231538 100%), url('../../../assets/friend-group/mobile-steps-bg.png');
    background-size: cover;
    background-position-y: center;
    background-position-x: center;
    border-bottom: none;
  }
  .join-fg-steps-bar {
    position: absolute;
    z-index: 3;
    width: 92%;
  }
  .join-fg-top-steps {
    &__item {
      $root: &;
      margin-bottom: 0px;
      min-height: 24px;
      padding: 8px 0px;
      &-index {
        background: $soft-tone;
        width: calc((var(--app-height) / 100) * 1.5);
        height: calc((var(--app-height) / 100) * 1.5);
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid $soft-tone;
        color: white;
        font-size: 18px;
        font-weight: bold;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 16px;
          display: block;
          width: 16vw;
          height: 1px;
          background: $soft-tone;
        }
        @media all and (max-width: $breakpoint-sm-max) {
          width: 16px;
          height: 16px;
        }
      }

      &--active {
        #{$root}-index {
          border-color: $dark-pink;
          color: $dark-pink;
        }
      }

      &--done {
        #{$root}-index {
          border-color: $dark-pink;
          background: $dark-pink;

          &:after {
            background: $dark-pink;
          }
        }
      }
      &--disable {
        opacity: 0.2;
      }

      &:last-child {
        #{$root}-index:after {
          display: none;
        }
        #{$root}-section {
          width: 16px;
        }
      }
    }
  }
</style>
