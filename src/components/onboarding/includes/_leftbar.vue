<template>
  <div class="onboarding__leftbar"
       :class="{'onboarding__leftbar--not-rendered': firstInit}"
       ref="leftbar">
    <div class="onboarding__leftbar-header text-left q-px-lg">
      <q-img src="@/assets/logo.svg" height="28px" width="156px" />
    </div>
    <div class="onboarding__leftbar-content q-px-lg q-py-lg">
      <div class="row">
        <div class="user-avatar-container">
          <user-avatar :emailAddress="emailAddress" :userName="userName" :size="80" class="q-mb-md" />
        </div>
        <div class="user-name">
          <div class="text-h2 full-width text-weight-bold">
            Hey,<br/>
            <span style="white-space: nowrap;text-overflow: ellipsis">
              {{ computedTitle }}
            </span>
          </div>
        </div>
      </div>
      <div class="training-steps__title text-weight-bold text-subtitle q-mt-lg q-mb-md">
        PREPARING YOUR TRAINING PLAN
      </div>
      <q-list class="training-steps">
        <q-item v-for="step in preparingList"
                :key="`p-step-${step.step}`"
                class="q-pl-none training-steps__item"
                :class="`training-steps__item--${stepClass(step)}`">
          <q-item-section side top>
            <div class="training-steps__item-index text-h5">
              <q-icon class="text-h4" name="done" v-if="isStepDone(step)"/>
              <template v-else>
                {{ step.step }}
              </template>
            </div>
          </q-item-section>
          <q-item-section class="training-steps__item-label text-weight-bold text-h5">
            {{ step.label }}
          </q-item-section>
        </q-item>
      </q-list>
      <q-btn v-if="showAgainBtn" class="not-me" outline @click="$emit('not-me')">
        START AGAIN
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    emailAddress: {
      type: String,
      default: () => 'User Name'
    },
    userName: {
      type: String,
      default: () => 'User Name'
    },
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
    'user-avatar': () => import('@/components/common/user-avatar')
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
    }
  },
  computed: {
    computedTitle () {
      return this.userName || this.emailAddress?.split('@')[0]
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
.onboarding{
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
    .user-avatar,
    .user-name{
      .text-h2{
        font-family: 'Roboto', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif!important;
        text-transform: unset!important;
      }
    }
    .user-avatar-container{
      width: 100px;
    }
    .user-name{
      width: calc(100% - 100px);
    }
    @media all and (max-width: $breakpoint-md-max){
      height: auto;
      &-content{
        height: auto;
      }
      .training-steps{
        transform: scale(0.8);
        transform-origin: 0 0;
      }
    }
  }
}
</style>
