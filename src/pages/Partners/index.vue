<template>
  <partners
    :current-collaborator="currentCollaborator"
    :partner-id="partnerId"
    :is-logged-in="isActivitiesShouldBeLocked"
    :creators="creators"
    @click-lock-activity="handleClickLockActivity"
  />
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import Partners from './Partners'

export default {
  components: {
    Partners
  },
  props: {
    partnerId: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapMutations({
      toggleSignWallModalEx: 'common/toggleSignWallModalEx'
    }),
    ...mapActions({
      getCollaborators: 'collaborators/getCollaborators'
    }),
    handleClickLockActivity (activity) {
      this.trackAction('Partners: Click locked activity', { partnerId: this.partnerId, activityTitle: activity.title })
      this.toggleSignWallModalEx({ active: true, referralCode: this.partnerId })
    },
    redirectToLogin () {
      this.$router.push('/')
    }
  },
  created () {
    this.getCollaborators()
  },
  mounted () {
    if (!this.partnerId) {
      this.redirectToLogin()
    }
  },
  updated () {
    if (!this.partnerId || !this.currentCollaborator) {
      this.redirectToLogin()
    }
  },
  computed: {
    ...mapState({
      collaborators: state => state.collaborators.collaborators
    }),
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      isAllowedToUsePlatform: 'user/isAllowedToUsePlatform'
    }),
    isActivitiesShouldBeLocked () {
      return this.isLoggedIn && this.isAllowedToUsePlatform
    },
    currentCollaborator () {
      return this.collaborators[this.partnerId]
    },
    creators () {
      return Object.values(this.collaborators)
        .filter(c => c.slug !== this.currentCollaborator.slug)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
