<template>
  <n-modal :visible="visible"
           showClose noPadding
           size="custom"
           @close="$emit('close')">
    <div class="modal-subscription-details row">
      <img class="modal-subscription-details__logo" src="@/assets/trainingPlan/logo-sm.svg" width="50" />

      <div class="modal-subscription-details__mobile-header"></div>

      <div class="modal-subscription-details__left col-sm-5 text-left">
        <div class="modal-subscription-details__title q-mt-md">
          Subscription
        </div>
        <div class="divider" />
        <div class="section-title">
          Payment details
        </div>
        <div class="modal-subscription-details__info column">
          <div class="modal-subscription-details__info-label font-rift text-weight-bold">
            Product
          </div>
          <div class="modal-subscription-details__info-value font-roboto text-weight-bold q-mb-md">
            {{ info.name }}
          </div>
          <div class="modal-subscription-details__info-label font-rift text-weight-bold">
            Subscription
          </div>
          <div class="modal-subscription-details__info-value font-roboto text-weight-bold q-mb-md">
            {{ info.subscriptionType }}
          </div>
          <div class="modal-subscription-details__info-label font-rift text-weight-bold">
            Price
          </div>
          <div class="modal-subscription-details__info-value font-roboto text-weight-bold q-mb-md">
            ${{ info.price }}
          </div>
          <template v-if="subscriptionWillRenew">
            <div class="modal-subscription-details__info-label font-rift text-weight-bold">
              Renewal date
            </div>
            <div class="modal-subscription-details__info-value font-roboto text-weight-bold q-mb-md">
              <span v-if="showReferralsReward" class="text-strike text-gray text-weight-regular">
                {{ originalRenewalDate }}<br/>
              </span>
              {{ dateToString(info.renewalDate) }}
            </div>
            <div class="modal-subscription-details__info-label font-rift text-weight-bold cursor-pointer"
              v-if="showReferralsReward"
              @click="$emit('show-referrals')"
            >
              Bonus days from referrals
              <c-icon icon="question" width="12px" class="q-ml-sm" />
            </div>
            <div class="modal-subscription-details__info-value font-roboto text-weight-bold q-mb-md"
              v-if="showReferralsReward"
            >
              {{ referralsData.numDaysCredited }}
            </div>
          </template>
          <template v-if="trialDaysLeft > 0">
            <div class="modal-subscription-details__info-label font-rift text-weight-bold">
              Trial days remaining
            </div>
            <div class="modal-subscription-details__info-value font-roboto text-weight-bold q-mb-md">
              {{ trialDaysLeft }}
            </div>
          </template>
          <c-btn
            class="modal-subscription-details__info-cancel"
            outline
            v-if="subscriptionWillRenew"
            @click="$emit('cancelSubscription')"
          >
            cancel subscription
          </c-btn>
          <div >

          </div>
        </div>

      </div>

      <div class="modal-subscription-details__right col-sm-7">
        <div>
          <div class="section-title">
            Payment method
          </div>
          <div class="credit-card q-my-md">
            <img src="@/assets/payments/card.svg" />
            <div class="credit-card__type">
              {{ subscriptionWillRenew ? card.cardType.toUpperCase() : 'Cancelled' }}
            </div>
            <div class="credit-card__number">
              {{ subscriptionWillRenew ? card.number : '' }}
            </div>
            <div class="credit-card__holder font-rift text-weight-bold">
              {{ subscriptionWillRenew ? card.holder : '' }}
            </div>
            <div class="credit-card__expired font-rift text-weight-bold">
              {{ subscriptionWillRenew ? card.expired : '' }}
            </div>
          </div>
        </div>

        <div>
          <c-btn v-if="subscriptionWillRenew" @click="$emit('cancelSubscription')" class="q-mt-md cancel-button">
            cancel subscription
          </c-btn>
          <div v-else class="font-roboto" style="font-size: 14px">
            Your subscription has been cancelled and will end at: {{ dateToString(info.renewalDate) }}
            <br/>
            If this was your first 30 days, you can contact
            <a class="text-pink" @click.stop="trackAction('Payments: Click support link from money-back notice'); $emit('open-support')">Support</a>
            for a refund
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    referralsData: {
      type: Object,
      required: false
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
    // 'n-payment-details': () => import('@/components/common/payment-details')
  },
  methods: {
    dateToString (date) {
      return this.$date(date).format('MMMM DD, YYYY')
    }
  },

  computed: {
    ...mapGetters({
      userSubscription: 'payments/userSubscription',
      trialDaysLeft: 'user/trialDaysLeft'
    }),

    info () {
      return {
        name: this.userSubscription?.name,
        subscriptionType: this.userSubscription?.bluesnap?.chargeFrequency,
        price: this.userSubscription?.bluesnap?.recurringCharge,
        renewalDate: this.userSubscription?.bluesnap?.nextChargeDate,
        startDate: this.userSubscription?.updatedAt
      }
    },
    card () {
      const cardInfo = this.userSubscription?.bluesnap?.paymentInfo
      return cardInfo?.type === 'creditcard' ? {
        number: `XXXX XXXX XXXX ${cardInfo.creditCard.cardLastFourDigits || '????'}`,
        holder: `${cardInfo.billingContactInfo.firstName} ${cardInfo.billingContactInfo.lastName}`,
        expired: `${cardInfo.creditCard.expirationMonth}/${cardInfo.creditCard.expirationYear}`,
        cardType: cardInfo.creditCard.cardType
      } : {
        cardType: cardInfo.type
      }
    },

    subscriptionWillRenew () {
      return this.userSubscription?.bluesnap?.autoRenew
    },

    showReferralsReward () {
      return this.referralsData?.numDaysCredited > 0
    },
    originalRenewalDate () {
      const date = this.showReferralsReward
        ? this.$date(this.info.renewalDate)
          .subtract(this.referralsData.numDaysCredited, 'days')
        : this.info.renewalDate
      return this.dateToString(date)
    }
  }
}
</script>

<style lang="scss">
.modal-subscription-details{
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  border-radius: 6px;
  overflow: hidden;
  width: 85vw;
  max-width: 680px;
  &__logo {
    position: absolute;
    top: 20px;
    left: 20px;
  }
  &__mobile-header {
    min-height: 90px;
    background: linear-gradient(135deg, rgba(217,39,121,1) 0%, rgba(124,39,126,1) 100%);
    border-radius: 12px 12px 0 0;
  }
  &__left{
    padding: 40px;
    background: linear-gradient(135deg, rgba(217,39,121,1) 0%, rgba(124,39,126,1) 100%);
    position: relative;
    z-index: 1;
    .divider{
      width: 100%;
      height: 1px;
      background: #fff;
      margin: 12px 0 20px;
    }
  }
  &__title {
    font-family: 'Roboto';
    font-size: 24px;
    font-weight: bold;
  }
  &__right{
    padding: 40px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__info{
    color: #F4D8E9;
    font-size: 1em;
    &-label{
      text-transform: uppercase;
    }
    &-value{
      color: #fff;
    }
    &-cancel {
      display: none;
    }
  }
  &__scroll{
    overflow-y: auto;
    padding-right: 15px;
    margin-right: -15px;
    // height: 490px;
  }
}

.credit-card {
  width: 100%;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(217,39,121,1) 0%, rgba(124,39,126,1) 100%);
    img{
      float: left;
    }
    &__type{
      position: absolute;
      bottom: 70%;
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-weight: bold;
      font-size: 20px;
      padding: 0 20px;
    }
    &__number{
      position: absolute;
      bottom: 30%;
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-weight: bold;
      font-size: 20px;
      padding: 0 20px;
    }
    &__holder{
      position: absolute;
      bottom: 10%;
      left: 20px;
      font-size: 16px;
    }
    &__expired{
      position: absolute;
      bottom: 10%;
      font-size: 16px;
      right: 20px;
    }
    &__action{
      position: absolute;
      top: 20px;
      right: 20px;
      width: 80px;
      .n-btn{
        min-width: unset;
      }
    }
}

.section-title {
  display: none;
}

@media screen and (max-width: $breakpoint-xs-max) {
  .cancel-button,
  .divider {
    display: none;
  }

  .section-title {
    display: block;
    font-weight: bold;
    border-bottom: 2px solid $soft-tone;
    color: #fff;
    font-family: 'Roboto';
    margin-bottom: 10px;
    padding-bottom: 10px;
  }

  .modal-subscription-details {
    flex-direction: column;
    align-items: initial;
    border-radius: 12px;
    width: 100%;
    max-width: 340px;
    overflow-x: auto;

    &__logo {
      top: 60px;
      left: 0;
      right: 0;
      margin: 0 auto;
      z-index: 4;
      width: 56px;
      height: 56px;
    }

    &__mobile-header {
      display: table;
    }

    &__left {
      padding: 0 20px;
      width: initial;
      background: initial;
      background-color: $dark;
      border-radius: 12px;

      .divider {
        margin: 0; // REMOVE
      }
    }

    &__title {
      font-family: 'Bebas Neue';
      font-size: 36px;
      text-transform: uppercase;
      font-weight: normal;
      text-align: center;
      margin-top: 36px;
    }

    &__right {
      width: initial;
      justify-content: initial;
      padding: 0 20px;
      margin-top: 24px;
    }

    &__info {
      display: grid;
      grid-template-columns: 3fr 2fr;
      column-gap: 10px;

      &-label {
        text-transform: none;
        font-family: 'Roboto' !important;
      }

      &-value {
        justify-self: end;
        font-weight: normal;
      }

      &-cancel {
        display: block;
        grid-column: 1 / 3;
      }
    }
  }
}
</style>
