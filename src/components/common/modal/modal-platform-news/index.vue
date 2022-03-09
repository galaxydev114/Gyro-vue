<template>
  <modal-platform-news
    :is-visible="isVisibleByAllConditions"
    :content="contentToShow"
    :background-color="backgroundColor"
    :cta-name="ctaName"
    @close="visitNews"
  />
</template>

<script>
import { getPlatformNews, visitPlatformNews } from '@/services/api'
import ModalPlatformNews from './modal-platform-news'
import { mapState } from 'vuex'

export default {
  components: {
    ModalPlatformNews
  },

  data: () => {
    return {
      isVisible: false,
      platformNewsId: null,
      content: '',
      mobileContent: null,
      backgroundColor: 'dark-pink',
      ctaName: 'Close'
    }
  },

  created () {
    if (this.userId) {
      this.loadLatestNews()
        .then(() => this.openNews())
    }
  },

  computed: {
    ...mapState({
      userId: state => state.user?.currentUser?.id,
      isPaywallVisible: state => state.payments.showPaywall,
      isPaymentDetailsFinishLoading: state => state.payments.isPaymentDetailsFinishLoading,
      isTrainingPlanLoaded: state => state.trainingPlan.id,
      isUserPaid: state => state.user.paymentPref.isPaid
    }),

    isVisibleByAllConditions () {
      return Boolean(
        this.isVisible &&
        !this.isPaywallVisible &&
        this.isPaymentDetailsFinishLoading &&
        this.isTrainingPlanLoaded &&
        this.isUserPaid
      )
    },

    contentToShow () {
      return this.$q.screen.width <= 576 ? this.mobileContent : this.content
    }
  },

  methods: {
    async loadLatestNews () {
      const response = await getPlatformNews(this.userId)
      const platformNews = response.data.platformNews
      if (!platformNews) return

      this.content = platformNews.content
      this.mobileContent = platformNews.mobileContent || platformNews.content
      this.platformNewsId = platformNews.id
      this.backgroundColor = platformNews.styles?.backgroundColor
      this.ctaName = platformNews.ctaName
    },

    openNews () {
      if (this.content && this.platformNewsId) {
        this.isVisible = true
      }
    },

    async visitNews () {
      this.isVisible = false
      await visitPlatformNews(this.userId, this.platformNewsId)
    }
  }
}
</script>
