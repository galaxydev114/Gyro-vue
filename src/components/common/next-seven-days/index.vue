<template>
  <div class="next-seven-days">
    <div class="next-seven-days__bg">
      <q-img src="@/assets/bg-1.svg" width="100%" />
    </div>
    <div class="next-seven-days__btn">
      <div class="font-rift text-weight-bold text-white text-h2">
        Time for your next 7 days of training!
      </div>
      <div class="text-h4 text-weight-regular q-my-md next-seven-days__btn_reason">
        You can generate a new training plan after completing your current week
      </div>
      <div class="next-seven-days__btn_description">
        <div class="text-subtitle1 font-rift text-uppercase">
          WHAT YOU GET
        </div>
        <div class="block q-mb-md">
          <ul>
            <li>Adjusted plan for the next week</li>
            <li>New activities to do</li>
            <li>Masteries to keep track</li>
          </ul>
        </div>
      </div>
      <div>
        <div class="next-seven-days__btn-fake font-rift" @click="clickGenerateNewTrainingPlan">
          GET MY NEXT PLAN
        </div>
      </div>
    </div>

    <n-modal :visible="visible" showClose @close="close">
      <div class="modal-congrats text-center">
        <div class="text-center congrats-all-header">
          <c-icon icon="done" width="160px" />
          <div class="text-dark-pink font-rift text-h5 text-weight-bold text-uppercase" style="margin-top: -40px">
            you have completed your weely training plan!
          </div>
        </div>
        <div class="text-h3 font-roboto q-mt-lg" style="text-transform: unset">
          Ready to generate your <br/>training plan for the next<br/>week?
        </div>

        <div class="d-flex items-center justify-between q-mt-xl">
          <c-btn
            class="full-width"
            :bold="false"
            :disable="!enable"
            @click="done"
          >
            PROCEED
          </c-btn>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script>
import paymentMixin from '@/mixins/payment.mixin'

export default {
  props: {
    enable: {
      type: Boolean,
      default: true
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  mixins: [paymentMixin],
  data () {
    return {
      visible: false
    }
  },
  methods: {
    clickGenerateNewTrainingPlan () {
      this.trackAction('TP: Click Generate New TrainingPlan')
      if (!this.checkGeneratingTrainingPlanRestriction('generateTrainingPlanCTA')) {
        return
      }
      this.visible = true
    },
    close () {
      this.visible = false
      this.$emit('close')
    },
    done () {
      this.visible = false
      if (this.enable) {
        this.$router.push('/onboarding-repeat')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.next-seven-days{
  width: 100%;
  overflow: hidden;
  position: relative;
  background: linear-gradient(151.32deg, #D92779 17.68%, #7C277E 86.39%);
  border-radius: 6px;
  &__bg{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    z-index: 1;
  }
  &__btn{
    padding: 20px;
    position: relative;
    z-index: 2;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    .text-h2{
      font-size: 36px;
      line-height: 42px;
      @media (max-height: $breakpoint-mobile-max-height) {
        font-size: 20px;
        line-height: 22px;
      }
    }
    &_reason {
      @media (max-height: $breakpoint-mobile-max-height) {
        font-size: 16px;
      }
    }
    &_description {
      @media (max-height: $breakpoint-565-max) {
        display: none;
      }
    }
    &-fake{
      margin-top: auto;
      background: #fff;
      border-radius: 6px;
      padding: 10px 20px;
      color: $dark-pink;
      font-size: 20px;
      text-align: center;
      font-weight: 500;
      cursor: pointer;
      transition: all .3s ease-in-out;
      opacity: .8;
      width: auto;
      display: inline-block;
      &:hover{
        opacity: 1;
        box-shadow: 0 0 10px rgba(0, 0, 0, .3);
      }
    }
  }
}
</style>
