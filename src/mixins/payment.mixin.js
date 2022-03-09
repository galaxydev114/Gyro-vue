import { sendSegmentEvent } from '@/services/segment'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  mounted () {
    window.scrollTo(0, 0)
  },
  computed: {
    ...mapGetters('user', {
      currentUser: 'currentUser',
      isPaidUser: 'isPaidUser',
      canGenerateTrainingPlan: 'canGenerateTrainingPlan',
      isAllowedToUsePlatform: 'isAllowedToUsePlatform',
      trialDaysLeft: 'trialDaysLeft'
    }),
    ...mapGetters('payments', {
      showModalSubscriptions: 'showUserSubscriptions',
      showModalUpgrade: 'showPaywall'
    }),
    ...mapState('trainingPlan', {
      tpStartDate: state => state.startDate
    }),
    ...mapState('payments', {
      isUpgradeButtonTriggerPayWall: state => state.isUpgradeButtonTriggerPayWall
    })
  },
  methods: {
    ...mapMutations('payments', {
      setPaywall: 'setPaywall',
      setShowUserSubscriptions: 'setShowUserSubscriptions',
      setIsUpgradeButtonTriggerPayWall: 'setIsUpgradeButtonTriggerPayWall'
    }),
    checkGeneratingTrainingPlanRestriction (source) {
      if (this.canGenerateTrainingPlan) {
        return true
      } else {
        this.setPayWallMethod('On Generate TP', source)
        return false
      }
    },
    checkPremiumActionRestriction (source) {
      if (this.isAllowedToUsePlatform) {
        return true
      } else {
        this.setPayWallMethod('On Other Premium Actions', source)
        return false
      }
    },
    setPayWallOff (source) {
      sendSegmentEvent(`Payments: Close Paywall: ${source}`, {
        source,
        user: this.currentUser
      })
      this.setIsUpgradeButtonTriggerPayWall(false)
      return this.setPaywall({ show: false })
    },
    setPayWallMethod (method, source, isTriggeredByUpgrade = false) {
      sendSegmentEvent(`Payments: Show Paywall: ${method}`, {
        source,
        user: this.currentUser
      })
      this.setIsUpgradeButtonTriggerPayWall(isTriggeredByUpgrade)
      return this.setPaywall({ show: true })
    },
    isExtraDayActive (startDate) {
      const _startDate = startDate || this.tpStartDate
      return (this.$date().diff(this.$date(_startDate), 'days') > 6)
    }
  }
}
