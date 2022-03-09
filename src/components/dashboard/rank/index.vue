<template>
  <div style="height: 388px;">
    <div class="rank text-center relative-position"
         :class="{'rank--ready': anim1}">
      <q-circular-progress
        :min="0"
        :max="100"
        :value="80"
        size="250px"
        :thickness="0.22"
        color="soft-tone"
        class="rank-progress rank-progress--bg"
      />
      <q-circular-progress
        :min="0"
        :max="100"
        :value="donePercent"
        size="250px"
        :thickness="0.22"
        color="green"
        class="rank-progress"
      />
      <div class="rank-medal"
           :class="{'rank-medal--ready': anim2}">
        <img src="@/assets/trainingPlan/icons/medal-color.svg" width="200px" height="160px" />
      </div>
      <transition-group tag="div"
                        name="slide"
                        class="rank-info"
                        :class="{'rank-info--ready': anim2}">
        <div class="slide" key="empty" v-if="!todayDone || !todayTotal">
          <div class="text-h2 text-gray">
            LETS START<br />
            THIS DAY
          </div>
          <div class="font-rift text-h5 q-mt-md q-mb-sm text-gray text-weight-bold">
            {{ todayTotal }} activities
          </div>
        </div>
        <div class="slide" key="with-data" v-else>
          <div class="activities-value font-rift"
               :class="`${todayDone === todayTotal ? 'text-green' : 'text-pink'}`">
            <span :class="{'animate': anim}">{{ todayDone }}</span>
            <span class="q-mx-xs">/</span>
            <span :class="{'animate': todayDone === todayTotal}">{{ todayTotal }}</span>
          </div>
          <div class="font-rift text-h5 q-mt-md q-mb-sm text-gray text-weight-bold">
            today activities
          </div>
        </div>
      </transition-group>
      <n-modal size="lg"
               :visible="visible"
               showClose
               @close="visible = false">
        <div class="rank-modal">
          <div class="text-center">
            <img src="@/assets/trainingPlan/icons/medal-color.svg" width="200px" height="160px" />
          </div>
          <div class="text-pink text-weight-bold font-rift text-center text-uppercase q-mb-sm" style="margin-top: -40px">
            rank progression
          </div>
          <div class="text-h3 font-roboto text-weight-bold text-center" style="text-transform: unset">
            Your rank is <span class="text-pink">Expert</span>
          </div>
          <div class="text-center q-mt-sm">
            You need 2 more hours of training for the next rank
          </div>
          <div class="rank-modal__list q-mt-lg">
            <div class="rank-modal__list-item"
                 :class="{'rank-modal__list-item--current': i === 3}"
                 v-for="i in 15"
                 :key="i">
              <img src="@/assets/trainingPlan/icons/medal-color-no-shadow.svg" width="50px" height="50px" v-if="i < 4" />
              <img src="@/assets/trainingPlan/icons/medal-no-color.svg" width="50px" height="50px" v-else />
              <div class="font-rift text-h5 q-mt-sm" :class="{'opacity-5': i > 3}">
                rank name
              </div>
              <div class="text-subtitle2 text-weight-regular q-mt-xs" :class="{'opacity-5': i > 3}">
                2 hours
              </div>
            </div>
          </div>
        </div>
      </n-modal>
    </div>
    <div class="row q-gutter-lg q-mt-sm q-mb-md anim"
         :class="{'anim--ready': anim1}">
      <div class="col text-center">
        <n-total-activities :value="totalActivities" />
      </div>
    </div>
  </div>
</template>
<script>
import { sendSegmentEvent } from '@/services/segment'

export default {
  props: {
    counter: {
      type: Object,
      require: true
    },
    totalActivities: {
      type: Number
    },
    runCounterAnimation: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'n-total-activities': () => import('@/components/common/total-activities'),
    'n-modal': () => import('@/components/dashboard/modal')
  },
  data () {
    return {
      visible: false,
      rankInfo: false,
      anim1: false,
      anim2: false,
      anim: false,
      passed: false
    }
  },
  methods: {
    trackAction (event, opts = {}) {
      sendSegmentEvent(event, opts)
    },
    showRankModal () {
      this.visible = !this.visible
      this.trackAction('TP: Click view ranks')
    },
    runAnimation () {
      // Progress circle
      setTimeout(() => {
        this.anim1 = true
      }, 300)
      // Medal
      // Daily info block
      // Total info

      setTimeout(() => {
        this.anim2 = true
      }, 600)

      setTimeout(() => {
        this.passed = true
      }, 1000)
    }
  },
  computed: {
    counterLeft () {
      return (this.runCounterAnimation && !this.passed) ? this.counter?.left + 1 || 0 : this.counter?.left
    },
    todayTotal () {
      return this.counter?.count || 0
    },
    todayDone () {
      return (this.counter?.count - this.counterLeft) || 0
    },
    donePercent () {
      return (this.todayDone * 80) / this.todayTotal || 80
    }
  },
  mounted () {
    this.runAnimation()
  },
  watch: {
    todayDone () {
      this.anim = true
      setTimeout(() => {
        this.anim = false
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.rank{
  position: relative;
  max-width: 292px;
  width: 100%;
  opacity: 0;
  transition: all .3s ease-in-out;
  &--ready{
    opacity: 1;
  }
  .activities-value{
    font-size: 72px;
    line-height: 72px;
    font-weight: bold;
    .animate{
      display: inline-block;
      animation: scaleInOut .5s ease-in-out;
    }
  }
  &-progress{
    transform: rotate(35deg);
    &--bg{
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%) rotate(35deg);
    }
  }
  &-medal{
    position: absolute;
    transform: translateY(-30%) translateX(-50%);
    transition: all .3s ease-in-out;
    left: 50%;
    top: -50%;
    &--ready{
      top: 0
    }
  }
  &-info{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    opacity: 0;
    transition: all .3s ease-in-out;
    &--ready{
      opacity: 1;
    }
  }
  &-modal{
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 100%;
    padding: 40px;
    border-radius: 8px;
    background: url("./../../../assets/onboarding/completing-bg.png") no-repeat $dark;
    background-size: 55% auto;
    background-position: 50% 5%;

    &__list{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      &-item{
        margin: 5px 0;
        width: calc( 20% - 10px );
        border: 2px solid $soft-tone;
        padding: 10px 10px 16px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        &--current{
          border-color: $pink;
        }
      }
    }
  }
  .slide{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 24px;
  }
}
.anim{
  opacity: 0;
  transform: translateY(100%);
  transition: all .3s ease-in-out;
  &--ready{
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleInOut {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
