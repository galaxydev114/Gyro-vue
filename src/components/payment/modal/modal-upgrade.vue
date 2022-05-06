<template>
  <n-modal :visible="showModal"
           noPadding
           :width="modalWidth"
           :forceHideClose="forceHideClose"
           :showClose="canClose"
           @close="checkClose"
           :size="!isFailedSubscriptionUser ? 'custom' : ''">
    <div class="modal-cannot-delete">
      <div v-if="isFailedSubscriptionUser" class="text-center q-pa-lg modal-payment-failed">
        <div class="text-center modal-header">
          <c-icon icon="info" width="160px" />
          <div class="warning-block font-rift text-h5 text-weight-bold text-uppercase" style="margin-top: -40px">
            Uh oh, your subscription isn't active
          </div>
        </div>
        <div class="text-h5 text-weight-regular text-gray q-mt-md font-roboto q-my-lg" style="text-transform: unset">
          Your payment didn't go through. Please check your payment details or select a different payment option.
        </div>

        <div class="d-flex items-center q-pt-lg justify-between">
          <c-btn class="full-width" @click="onCTA">
            Update payment information
          </c-btn>
        </div>
      </div>
      <div v-else class="modal-upgrade-v2">
        <img class="modal-upgrade-v2__logo" :src="logoSrc" width="50" />

        <div class="modal-upgrade-v2__left text-left">
          <img :src="imgSrc" />
        </div>

        <div class="modal-upgrade-v2__right text-left">
          <div v-if="!$q.screen.lt.sm" class="modal-upgrade-v2__badge q-mb-md">
            Fastest way to improve
          </div>

          <div class="text-h1" :class="{'smaller-header':  $q.platform.is.desktop}">
            Start your training
          </div>
          <div>
            <div v-if="!$q.screen.lt.sm" class="text-subtitle1 text-pink text-uppercase text-weight-bold q-mt-sm q-mt-sm-lg font-rift q-mb-sm">
              what to expect
            </div>
            <ul class="feature-list text-gray">
              <li>
                <c-icon icon="purpleCheck" width="14px" class="q-mr-xs" />
                No commitments - cancel anytime
              </li>
              <li>
                <c-icon icon="purpleCheck" width="14px" class="q-mr-xs" />
                Unlimited training plans
              </li>
              <li v-if="benefitAfterUpgrade">
                <c-icon icon="purpleCheck" width="14px" class="q-mr-xs" />
                {{benefitAfterUpgrade}}
              </li>
              <li v-if="!$q.screen.lt.sm">
                <c-icon icon="purpleCheck" width="14px" class="q-mr-xs" />
                Exclusive training routines
              </li>
              <li>
                <c-icon icon="purpleCheck" width="14px" class="q-mr-xs" />
                Not satisfied? 30 days money-back guarantee
              </li>
            </ul>

            <div class="text-dark-pink q-mt-sm q-mt-sm-lg">
              <a class="text-dark-pink q-mt-sm q-mt-sm-lg" flat type="a" href="https://www.novos.gg/why-novos-is-good-for-you" target="_blank">Why NOVOS is good for you?</a>
            </div>
            <div class="q-mt-sm q-mt-sm-lg">
              <div class="coupon-input coupon-input--a"
                   :class="{
                      'coupon-input--success': couponSuccess,
                      'coupon-input--error': couponCode.length && !couponSuccess,
              }">
                <discount-icon
                  :is-success-icon-visible="couponSuccess"
                  :is-loading="isLoadingCouponValidationResult"/>
                <div>
                  <input type="text"
                         @keydown="couponKeyDownEvent"
                         @input="setCouponCode"
                         placeholder="Coupon Code"/>
                </div>
                <discount-icon
                  :is-success-icon-visible="couponSuccess"
                  :is-loading="isLoadingCouponValidationResult"/>
              </div>
              <div class="coupon-input-result">
                <span
                  v-if="isCouponFormTouched && !isLoadingCouponValidationResult && !couponSuccess"
                  class="coupon-input-result__text">
                  Coupon not valid
                </span>
              </div>
            </div>
          </div>
          <div class="modal-upgrade-v2__action">
            <div class="q-mb-lg q-mb-sm-none" :style="$q.screen.gt.md ? 'align-self: self-start;':''">
              <div class="text-weight-bold opacity-5 text-h5 text-gray">
                Subscription
              </div>
              <div class=" text-h4" v-if="couponSuccess">
                <span class="text-dark-pink opacity-5 q-mr-sm" style="text-decoration: line-through;">${{pricePerMonth}}</span>
                <span class="text-green">${{pricePerMonthWithCoupone}} First month</span>
              </div>
              <div class="text-green text-h4" v-else>
                ${{pricePerMonth}}/<span class="text-h5">month</span>
              </div>
            </div>
            <div style='text-align: center;'>
              <c-btn :disabled="disallowCTA" @click="onCTA">
                Subscribe Now
              </c-btn>
              <c-btn
                  flat
                  dense
                  padding="0"
                  textColor="dark-pink"
                  noHover
                  size='sm'
                  class="text-h7 text-capitalize q-ml-sm"
                  @click="onLogout">
                logout
              </c-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-loader v-if="showLoader" />
  </n-modal>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import { debounce } from 'quasar'
import { checkCouponCode } from '@/services/api'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    forceHideClose: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'page-loader': () => import('@/components/common/page-loader'),
    'n-modal': () => import('@/components/dashboard/modal'),
    'discount-icon': () => import('@/components/common/icon/discount-icon.vue')
  },
  data () {
    return {
      disallowCTA: false,
      selectedPaymentPlan: false,
      showLoader: false,
      images: {
        mainDesktop: require('@/assets/payments/modal-upgrade-bg.png'),
        mainMobile: require('@/assets/payments/modal-upgrade-bg.png'),
        logoMobile: require('@/assets/logo.svg'),
        logoDesktop: require('@/assets/trainingPlan/logo-sm.svg')
      },
      checkInterval: null,
      showModal: false,
      couponCode: '',
      couponSuccess: false,
      isLoadingCouponValidationResult: false,
      isCouponFormTouched: false
    }
  },
  computed: {
    ...mapGetters({
      paymentPlans: 'payments/plans',
      trialDaysLeft: 'user/trialDaysLeft',
      isFailedSubscriptionUser: 'user/isFailedSubscriptionUser',
      currentUser: 'user/currentUser'
    }),
    ...mapState({
      benefitAfterUpgrade: state => state.fortniteSeason.benefitAfterUpgrade
    }),
    defaultPaymentPlan () {
      return this.paymentPlans[0]
    },
    pricePerMonth () {
      return Number(this.selectedPaymentPlan?.pricePerMonth).toFixed(2)
    },
    planId () {
      return this.selectedPaymentPlan?.id
    },
    imgSrc () {
      return this.$q.screen.lt.md ? this.images.mainMobile : this.images.mainDesktop
    },
    logoSrc () {
      return this.$q.screen.lt.md ? this.images.logoMobile : this.images.logoDesktop
    },
    modalWidth () {
      return this.$q.screen.gt.sm ? '900px' : this.$q.screen.gt.xs ? '500px' : '90%'
    },
    computedTitle () {
      return 'start your 7 days for free'
    },
    canClose () {
      return this.trialDaysLeft > 0 || this.$q.platform.is.mobile
    },
    pricePerMonthWithCoupone () {
      return '1.90'
    }
  },
  methods: {
    ...mapActions({
      getPaymentPlans: 'payments/getPaymentPlans',
      userLogout: 'user/logout'
    }),
    ...mapMutations({
      finishLoadingPaymentDetails: 'payments/setIsPaymentDetailsFinishLoading'
    }),
    couponKeyDownEvent: debounce(function (e) {
      this.trackAction('Paywall coupon: player started typing coupon')
    }, 350),

    onLogout () {
      clearInterval(this.checkInterval)
      this.trackAction('Payments: Click Logout')
      this.userLogout().then(() => {
        this.$router.push('/login')
      })
    },
    onCTA () {
      this.showLoader = true
      clearInterval(this.checkInterval)
      this.$emit('checkout', { planId: this.selectedPaymentPlan.id, couponCode: this.couponCode.toUpperCase() })
    },
    isInViewport (element) {
      if (!this.checkElementIsInView(element)) {
        return false
      }
      const elList = [
        '.q-dialog',
        '.q-dialog__inner',
        '.n-modal',
        '.n-modal__content'
      ]

      for (const key of elList) {
        const el = element.closest(key)
        if (!el) {
          return false
        }
        if (!this.checkElementIsInView(el)) {
          return false
        }
      }
      return true
    },
    checkElementIsInView (element) {
      if (!element) return false
      const isHidden = !!(element.style.visibility)
      const isHiddenByOverflow = element.style.overflow === 'hidden'
      return (
        !isHidden &&
        !isHiddenByOverflow
      )
    },
    checkClose () {
      if (!this.canClose) return
      this.removeEventListener()
      this.$emit('close')
    },
    addElementListener () {
      if (this.showModal && !this.checkInterval) {
        this.checkInterval = setInterval(() => {
          const element = document.getElementsByClassName('modal-cannot-delete')[0]
          if (this.showModal && !this.isInViewport(element) && !this.canClose && !this.$route.matched.some(route => route.meta.suppressPaywall)) {
            clearInterval(this.checkInterval)
            this.$router.push('/404')
          }
        }, 2500)
      }
    },
    removeEventListener () {
      if (!this.checkInterval || !this.canClose) return
      clearInterval(this.checkInterval)
    },
    initTest () {
      if (this.visible) {
        this.showModal = this.visible
        this.addElementListener()
      } else {
        this.removeEventListener()
      }
    },
    async setCouponCode (event) {
      if (event.target.value === '') {
        this.isCouponFormTouched = false
        this.isLoadingCouponValidationResult = false
        this.couponSuccess = false
        this.couponCode = ''
        return
      }

      this.isCouponFormTouched = true
      this.isLoadingCouponValidationResult = true
      this.couponSuccess = false
      this.couponCode = event.target.value.toUpperCase()
      await this.validateCouponCode()
    },
    async validateCouponCode () {
      const response = await checkCouponCode(this.couponCode)
      if (response.data.isCouponCodeValid) {
        this.trackAction('Paywall coupon: Coupon valid')
        this.couponSuccess = true
      } else {
        this.couponSuccess = false
      }
      this.isLoadingCouponValidationResult = false
    }
  },
  created: function () {
    this.validateCouponCode = debounce(this.validateCouponCode, 500)
    return this.getPaymentPlans().then(() => {
      this.selectedPaymentPlan = this.defaultPaymentPlan
      this.trackAction('Payments: Show Paywall type:', { type: this.isFailedSubscriptionUser ? 'failed' : 'regular' })
      this.finishLoadingPaymentDetails(true)
    })
  },
  mounted () {
    this.initTest()
  },
  watch: {
    visible () {
      this.initTest()
    }
  }

}
</script>

<style lang="scss">
.modal-upgrade-v2{
  $root: &;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  border-radius: 6px;
  overflow: visible;
  width: 100%;
  max-height: 86vh;
  @media screen and (max-width: $breakpoint-sm-max) {
    flex-direction: column;
    overflow: unset;
  }
  @media screen and (max-width: $breakpoint-410-max) {
    font-size: 12px;
  }
  &__logo{
    position: absolute;
    top: 25px;
    left: 20px;
    z-index: 5;
    @media screen and (max-width: $breakpoint-sm-max) {
      width: 120px;
      display: block;
      filter: brightness(0) invert(1);
    }
  }
  &__left{
    padding: 20px;
    width: 270px;
    background:
      url("./../../../assets/payments/background.png") bottom center,
      linear-gradient(135deg, rgba(217,39,121,1) 0%, rgba(124,39,126,1) 100%);
    position: relative;
    z-index: 1;
    img{
      float: left;
      position: absolute;
      left: -45px;
      bottom: 0;
      width: calc(100% + 120px);
    }
    @media screen and (max-width: $breakpoint-sm-max) {
      width: 100%;
      height: 80px;
      z-index: 2;
      border-radius: 6px 6px 0 0;
      img {
        display: none;
        width: 100%;
        bottom: unset;
        top: -50px;
        z-index: 2;
      }
    }
    @media screen and (max-width: $breakpoint-410-max) {
      height: 70px;
    }
  }
  &__right{
    padding: 36px 60px 16px 60px;
    width: calc( 100% - 270px);
    overflow-y: auto;
    position: relative;
    z-index: 2;
    ul{
      display: flex;
      flex-direction: column;
      text-align: left;
      padding: 0;
      margin: 0;
      li{
        list-style: none;
        padding: 5px 0;
        font-size: 16px;
        color: light/soft gray;
      }
    }
    @media screen and (max-width: $breakpoint-sm-max) {
      padding: 30px;
      width: 100%;
      z-index: 3;
      background: $dark;
      border-radius: 0 0 6px 6px;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      text-align: center;
      .text-h1 {
        font-size: 32px;
      }
    }
    @media screen and (max-width: $breakpoint-410-max) {
      padding: 30px;
      .text-h1 {
        font-size: 26px;
      }
    }
  }
  &__badge{
    background: rgba(217,39,121,1);
    padding: 8px 12px;
    border-radius: 4px;
    color: #fff;
    text-transform: uppercase;
    font-size: 12px;
    width: 220px;
    text-align: center;
    &-trial {
      background: $yellow;
      color: black;
      font-weight: 500;
      width: 246px;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      margin: 0 auto 12px;
    }
    @media (max-height: $breakpoint-565-max) {
      display: none;
    }
  }
  &__action{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 32px;
    border-top: 2px solid $soft-tone;
    @media screen and (max-width: $breakpoint-xs-max) {
      margin-top: 26px;
      padding-top: 16px;
      flex-direction: column;
    }
  }
  &__description{
    font-size: 16px;
    span{
      background: $pink;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      font-size: 14px;
    }
    @media screen and (max-width: $breakpoint-410-max) {
      display: none;
    }
  }
  .smaller-header {
    font-size: 3rem;
  }
  .text-subtitle {
    padding-top: 10px;
    font-size: 16px;
  }
}
.modal-header{
  background: url("./../../../assets/onboarding/completing-bg.png") center no-repeat;
  background-size: 100%;
}
.warning-block{
  border: 2px solid $yellow;
  color: $yellow;
  border-radius: 6px;
  padding: 10px 30px;
  width: auto;
  margin: 10px auto;
  flex: 0;
  display: inline-flex;
}
.modal-cannot-delete {
  width: 100%
}
.coupon-input{
  $root: &;
  height: 46px;
  border: 2px solid $mid-tone;
  background-color: $mid-tone;
  border-radius: 6px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  font-size: 18px;
  text-align: center;
  font-family: "rift", sans-serif;
  font-weight: bold!important;
  position: relative;
  input{
    background: transparent;
    border: none;
    text-align: center;
    width: 90%;
    color: #fff;
    &:focus,
    &:active{
      border: none;
      outline: none;
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &-result {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    min-height: 20px;

    &__spinner {}

    &__text {
      font-size: 13px;
      line-height: 16px;
      color: $dark-pink;
      font-weight: bold;
      text-transform: unset;
    }
  }
  &--success{
     border-color: $green;
  }
  &--error{
     border-color: $dark-pink;
  }
  &--a{
    height: 56px;
    #{$root}__validation-msg{
      top: unset;
      text-align: center;
      bottom: -25px;
    }
  }
}
</style>
