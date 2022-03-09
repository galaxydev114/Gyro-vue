<template>
  <n-modal :visible="visible"
           class="modal-referrals"
           showClose noPadding
           @close="$emit('close')">
    <div class="text-center modal-referrals__header">
    </div>
    <div class="modal-referrals__content text-center">
      <div class="text-h3 q-mb-lg font-roboto" style="text-transform: unset">
        Refer a friend for free subscription days
      </div>
      <div class="text-h5 text-weight-regular q-mb-md">
        Give your friends 7 days free trial &ndash;
        if they subscribe, you get 7 days free too!
      </div>
      <div class="text-weight-regular q-mb-sm">
        Copy the URL below and share it with your friends
      </div>

      <div>
        <q-card-section class="modal-referrals__link flex items-center justify-between bordered q-mb-sm">
          <span class="modal-referrals__link-text text-weight-regular">{{ referralLink }}</span>
          <q-icon name="content_copy"
                  @click="copyReferralLink"
                  color="dark-pink"
                  size="20px"
                  class="cursor-clickable">
          </q-icon>
        </q-card-section>

        <c-btn v-if="canNativeShare"
          class="full-width"
          outline
          @click="openNativeShare"
        >
          <c-icon icon="share" width="16px" class="icon"/>
          <span class="q-ml-sm">Share it with your friends</span>
        </c-btn>
        <div v-else/>
      </div>

      <div v-if="referralsData && referralsData.numSuccessfulRefers > 0">
        <div class="fake-line"/>
        <span class="text-h5">Friends successfully referred: </span>
        <span class="text-h2 font-roboto">{{ referralsData.numSuccessfulRefers }}</span>
      </div>
    </div>
  </n-modal>
</template>

<script>
import { copyToClipboard } from 'quasar'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    referralLink: {
      type: String,
      required: true
    },
    referralsData: {
      type: Object,
      required: false
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  computed: {
    shareData () {
      return {
        url: this.referralLink
      }
    },
    canNativeShare () {
      return navigator.canShare(this.shareData)
    }
  },

  methods: {
    copyReferralLink: async function () {
      try {
        await copyToClipboard(this.referralLink)
        this.$q.notify({
          type: 'positive',
          message: 'Copied!'
        })
        this.copied = true
        this.trackAction('Referrals: Copy referral link', { referralLink: this.referralLink })
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: 'Oops! Something went wrong'
        })
      }
    },
    openNativeShare () {
      this.trackAction('Referrals: Open native share dialog', this.shareData)
      navigator.share(this.shareData)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-referrals {
  &__header {
    padding-top: 50%;
    background:
      url("./../../assets/other/referral-bg-pic.png") top 20% center / calc(100% * 584 / 456) no-repeat,
      url("./../../assets/other/referral-bg.svg") top center / 100% no-repeat;
  }
  &__content{
    padding: 18px 40px;
    @media all and (max-width: $breakpoint-xs-max){
      padding: 18px 18px;
    }
  }
  &__link {
    border: 2px solid $soft-tone;
    border-radius: 6px;
    padding: 12px;
    &-text {
      overflow-x: auto;
      white-space: nowrap;
      max-width: 90%;
    }
    @media all and (max-width: $breakpoint-410-max){
      padding: 8px;
      &-text {
        font-size: 0.7rem;
      }
    }
  }
}

.fake-line{
  height: 1px;
  width: 100%;
  background: $soft-tone;
  margin: 30px 0 15px;
  @media all and (max-width: $breakpoint-xs-max){
    margin: 15px 0 10px;
  }
}
</style>
