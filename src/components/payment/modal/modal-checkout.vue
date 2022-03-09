<template>
  <n-modal :visible="visible" showClose size="custom" width="700px" @close="$emit('close')">
    <div class="checkout">
      <div class="checkout__side">
         <q-img src="@/assets/trainingPlan/logo-sm.svg" width="60px" />

        <div>
          <h2 class="checkout__order-info-title">Order information</h2>
          <hr>

          <div class="checkout__info">
            <h3>Product</h3>
            <span>Subscription {{defaultPaymentPlan.name}}</span>
          </div>

          <div class="checkout__info">
            <h3>Price</h3>
            <span>${{defaultPaymentPlan.pricePerMonth && defaultPaymentPlan.pricePerMonth.toPrecision(3)}} monthly</span>
          </div>

          <div class="checkout__info">
            <h3>Billing Date</h3>
            <span>{{billingDate}} (after trial ends)</span>
          </div>
        </div>
      </div>

      <div class="checkout__form">
        <h1 class="checkout__title">Checkout</h1>

        <form class="form" @submit.prevent="submitCheckout">
          <div class="form__input" ref="cardNumberBlock">
            <label for="ccn">Card number</label>
            <div data-bluesnap="ccn"></div>
          </div>

          <div ref="expCvvBlock" class="form__input form__input--2column">
            <div>
              <label for="expDate">Expiration date</label>
              <div data-bluesnap="exp"></div>
            </div>

            <div>
              <label for="securityCode">Security code</label>
              <div data-bluesnap="cvv"></div>
            </div>
          </div>

          <div ref="agreementBlock" class="form__input">
            <q-checkbox v-model="isStoreUserCard" color="pink"/>
            <label for="agreement">Securely store my credit card information</label>
          </div>

          <div ref="submitBlock" class="form__input form__input--separate">
            <c-btn class="form__button" :disabled="!isFormValid || isFormProcessing" type="submit">Confirm purchase</c-btn>

            <paypal-button class="form__button" :disabled="isFormProcessing" @click.native="submitPayPalCheckout"/>
          </div>

          <div v-if="!isFormReady" class="loader">
            <q-spinner size="3rem" color="pink" />
            <div>Processing...</div>
          </div>
        </form>
      </div>
    </div>
  </n-modal>
</template>

<script>
import * as api from '@/services/api'
import dayJs from 'dayjs'
import { mapGetters, mapState, mapActions } from 'vuex'
import slideDownFadeInAnimation from '@/animations/slideDownFadeIn'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  components: {
    'n-modal': () => import('@/components/dashboard/modal'),
    'paypal-button': () => import('@/components/common/button/paypalButton')
  },

  data: () => ({
    token: null,
    isStoreUserCard: false,
    isFormReady: false,
    isCcnValid: false,
    isExpValid: false,
    isCvvValid: false,
    isFormProcessing: false
  }),

  async mounted () {
    await this.obtainPfToken()
    this.initiatePaymentFields()
  },

  computed: {
    ...mapGetters({
      paymentPlans: 'payments/plans'
    }),

    ...mapState({
      user: state => state.user.currentUser,
      billingDate: state => {
        const now = new Date()
        const planStartedDate = state.trainingPlan?.startDate
          ? state.trainingPlan.startDate
          : now

        const date = dayJs(planStartedDate).add(8, 'day')

        return date.isBefore(now)
          ? dayJs(now).format('MMMM DD, YYYY')
          : date.format('MMMM DD, YYYY')
      }
    }),

    isFormValid () {
      return this.isCcnValid && this.isExpValid && this.isCvvValid && this.isStoreUserCard
    },

    defaultPaymentPlan () {
      return this.paymentPlans[0] || {}
    },

    planId () {
      return this.defaultPaymentPlan.id
    },

    cardNumberBlockAnimation () {
      const el = this.$refs.cardNumberBlock
      if (!el) { return }
      return slideDownFadeInAnimation(el, { delay: 100, fill: 'forwards' })
    },

    expCvvBlockAnimation () {
      const el = this.$refs.expCvvBlock
      if (!el) { return }
      return slideDownFadeInAnimation(el, { delay: 200, fill: 'forwards' })
    },

    agreementBlockAnimation () {
      const el = this.$refs.agreementBlock
      if (!el) { return }
      return slideDownFadeInAnimation(el, { delay: 400, fill: 'forwards' })
    },

    submitBlockAnimation () {
      const el = this.$refs.submitBlock
      if (!el) { return }
      return slideDownFadeInAnimation(el, { delay: 500, fill: 'forwards' })
    }
  },

  methods: {
    ...mapActions({
      loadUser: 'user/loadUser'
    }),

    async obtainPfToken () {
      const response = await api.obtainPfToken()
      if (response.status !== 200) {
        this.trackAction('Checkout Form: failed to obtain payment fields tokens')
        this.$emit('finish-checkout', false)
        return
      }

      this.token = response.data.pfToken
    },

    initiatePaymentFields () {
      // eslint-disable-next-line no-undef
      bluesnap.hostedPaymentFieldsCreate({
        token: this.token,
        onFieldEventHandler: {
          setupComplete: this.handleBluesnapOnSetupComplete,
          onError: this.handleBluesnapOnError,
          onType: this.handleBluesnapOnType,
          onValid: this.handleBluesnapOnValid,
          onBlur: this.handleBluesnapOnBlur,
          onFocus: this.handleBluesnapOnFocus
        },
        style: {
          input: {
            color: '#FFF',
            padding: '0 10px'
          }
        },
        ccnPlaceHolder: '1234 5678 9012 3456',
        cvvPlaceHolder: '123',
        expPlaceHolder: 'MM/YY'
      })
    },

    submitCheckout () {
      this.reverseFormAnimations()

      this.isFormProcessing = true
      this.isFormReady = false
      // eslint-disable-next-line no-undef
      bluesnap.hostedPaymentFieldsSubmitData((callback) => {
        if (callback.cardData != null) {
          api
            .proceedCheckout({
              pfToken: this.token,
              paymentPlanId: this.defaultPaymentPlan.id,
              userId: this.user.id
            })
            .then(() => {
              this.loadUser(this.user.id)
              this.$emit('finish-checkout', true)
            })
            .catch(() => {
              this.$emit('finish-checkout', false)
            })
            .finally(() => {
              this.isFormReady = true
              this.isFormProcessing = false

              this.reverseFormAnimations()
            })
        } else {
          this.isFormReady = true

          this.reverseFormAnimations()
          this.isFormProcessing = false
        }
      })
    },

    submitPayPalCheckout () {
      this.reverseFormAnimations()
      this.isFormProcessing = true
      this.isFormReady = false
      this.$emit('paypal-checkout', this.planId)
    },

    handleBluesnapOnError (tagId, errorCode) {
      if (tagId === 'ccn') { this.isCcnValid = false }
      if (tagId === 'exp') { this.isExpValid = false }
      if (tagId === 'cvv') { this.isCvvValid = false }
    },

    handleBluesnapOnType (tagId, cardType) {},

    handleBluesnapOnValid (tagId) {
      if (tagId === 'ccn') { this.isCcnValid = true }
      if (tagId === 'exp') { this.isExpValid = true }
      if (tagId === 'cvv') { this.isCvvValid = true }
    },

    handleBluesnapOnSetupComplete () {
      this.isFormReady = true
      this.playFormAnimations()
    },

    handleBluesnapOnFocus () {},

    handleBluesnapOnBlur () {},

    playFormAnimations () {
      this.cardNumberBlockAnimation.play()
      this.expCvvBlockAnimation.play()
      this.agreementBlockAnimation.play()
      this.submitBlockAnimation.play()
    },

    reverseFormAnimations () {
      this.cardNumberBlockAnimation.reverse()
      this.expCvvBlockAnimation.reverse()
      this.agreementBlockAnimation.reverse()
      this.submitBlockAnimation.reverse()
    }
  }
}
</script>

<style scoped lang="scss">
.checkout {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  border-radius: 6px;
  overflow: hidden;
}
.checkout__side {
  padding: 40px;
  width: 300px;
  background: linear-gradient(135deg, rgba(217,39,121,1) 0%, rgba(124,39,126,1) 100%);
  position: relative;
  z-index: 1;
}
.checkout__form {
  padding: 40px;
  width: calc( 100% - 300px);
  position: relative;
  z-index: 2;
}
.checkout__title {
  margin: 0 0 10px 0;
  font-family: 'Bebas Neue';
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 120%;
  text-transform: uppercase;
}
.checkout__order-info-title {
  font-size: 1.25rem;
}
.checkout__info {
  margin: 10px 0;
}
.checkout__info > h3 {
  font-family: 'Bebas Neue';
  font-weight: normal;
  font-size: 1rem;
  margin: 0;
  color: $light-pink;
}
.checkout__info > span {
  font-size: 0.875rem;
  color: $light-pink;
}

.form {
  display: flex;
  flex-flow: column;
  position: relative;
}
.form__input {
  margin: 10px 0;
  opacity: 0;
}
.form__input--2column {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.form__input--2column > div {
  width: 100%;
}
.form__input label {
  display: inline-block;
  margin-bottom: 5px;
}
.form__input [data-bluesnap] {
  height: 46px;
  border: 2px solid $soft-tone;
  border-radius: 6px;
}
.form__button {
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.loader {
  display: flex;
  align-items: center;
  flex-flow: column;
  position: absolute;
  top: calc(50% - 1.5rem);
  left: calc(50% - 1.5rem);
}
</style>
