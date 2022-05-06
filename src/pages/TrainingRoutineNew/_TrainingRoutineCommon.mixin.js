import * as api from '@/services/api'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

export default {
  props: {
    routineId: {
      type: String,
      required: true
    },
    userRoutineId: {
      type: String,
      default: null
    },
    sessionId: {
      type: String,
      default: null
    },
    isViewingSession: {
      type: Boolean,
      default: false
    },
    analyticsContext: {
      type: String,
      default: ''
    },
    isDiscovery: {
      type: Boolean,
      default: false
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    routineWithSessionsData: {
      type: Object,
      default: null
    },
    currentRoutine: {
      type: Object,
      default: null
    },
    returnRouteName: {
      type: String,
      default: null
    },
    externalCompletion: {
      type: Boolean,
      default: false
    },
    exteralIsCompleted: {
      type: Boolean,
      default: null
    },
    nonCompletable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    animation: false
  }),
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn'
    }),
    ...mapGetters('userSession', ['getUserSession']),

    ...mapGetters('trainingRoutine', {
      getTrainingRoutine: 'trainingRoutine'
    }),
    ...mapState({
      userId: state => state.user.currentUser.id
    }),

    currentSession () {
      return this.userRoutineId
        ? this.getUserSession(this.userRoutineId, this.sessionId)
        : this.routineWithSessionsData?.sessions?.find(session => session.id === this.sessionId)
    },
    computedMap () {
      const sessions = this.routineWithSessionsData?.sessions
      // used for 1-session routines case
      const fallbackMap = sessions?.length ? sessions[0].map : null
      return this.currentSession?.map || fallbackMap
    },
    nextUndoneSession () {
      return this.currentRoutine.sessions
        .find(session => session.id !== this.sessionId && !session.isCompleted)
    },
    firstSession () {
      return this.currentRoutine.sessions[0]
    }
  },
  methods: {
    ...mapMutations({
      toggleSignWallModal: 'common/toggleSignWallModal'
    }),
    ...mapActions({
      markSessionAsCompleted: 'trainingRoutine/markSessionAsDone',
      markRoutineAsDone: 'trainingRoutine/markRoutineAsDone'
    }),
    triggerLoading (loadingState) {
      this.$emit('loading', loadingState)
    },
    handleNewRoutinePicked (routineParams) {
      this.$emit('reroute-to-new-user-routine', routineParams)
    },
    clickSession (session) {
      if (session.id === this.sessionId) {
        return
      }

      this.animation = true
      setTimeout(() => {
        this.trackAction('Routine: Click Left panel Sessions', { routineId: this.userRoutineId, sessionId: session.id })
        this.rerouteToSession(session.id)
      }, 300)
    },
    overviewRoutine () {
      this.trackAction('Routine: Click Overview', {
        routine: this.currentRoutine
      })
      this.$emit('reroute-to-overview')
    },
    rerouteToSession (sessionId) {
      this.$emit('reroute-to-session', { sessionId }, () => {
        this.animation = false
      })
    },
    startRoutine () {
      this.animation = true
      setTimeout(() => {
        this.trackAction('Routine: Start Routine', this.currentRoutine)
        this.rerouteToSession(this.nextUndoneSession?.id || this.firstSession?.id)
      }, 300)
    },
    getNextSession (sessionId) {
      const sessions = this.currentRoutine.sessions
      const currentSessionObj = sessions.find(({ id }) => sessionId === id)
      const sessionIndex = sessions.indexOf(currentSessionObj)
      const nextSession = sessions[sessionIndex + 1] || this.nextUndoneSession
      return nextSession
    },
    getPrevSession (sessionId) {
      const sessions = this.currentRoutine.sessions
      const currentSessionObj = sessions.find(({ id }) => sessionId === id)
      const sessionIndex = sessions.indexOf(currentSessionObj)
      const prevSession = sessions[sessionIndex - 1]
      return prevSession
    },
    selectNextSession (sessionId) {
      this.animation = true
      setTimeout(() => {
        const nextSessionId = this.getNextSession(sessionId)?.id
        if (!nextSessionId) {
          console.error('No next session id')
        } else {
          this.rerouteToSession(this.getNextSession(sessionId)?.id)
        }
      }, 300)
    },
    selectPrevSession (sessionId) {
      this.animation = true
      setTimeout(() => {
        const prevSessionId = this.getPrevSession(sessionId)?.id
        if (!prevSessionId) {
          console.error('No prev session id')
        } else {
          this.rerouteToSession(this.getPrevSession(sessionId)?.id)
        }
      }, 300)
    },

    goBack () {
      this.trackAction('Routine: Go Back', {
        routine: this.currentRoutine,
        session: this.currentSession
      })
      if (!this.returnRouteName) {
        this.$router.back()
      } else {
        this.$router.push({ name: this.returnRouteName })
      }
    },

    handleCompletionRedirect () {
      if (this.returnRouteName) {
        this.$router.push({ name: this.returnRouteName, query: this.isDiscovery ? {} : { routineCompleted: true } })
      }
    },

    async markAsCompletedDiscoveredRoutine () {
      const response = await api.completeDiscoveredRoutine(this.routineId, this.userId)
      if (response.status === 200) {
        this.isCongratsVisible = true
      }
    },

    openSignWall (trigger = '') {
      this.toggleSignWallModal(true)
      this.trackAction('Shared content: Open Sign UP CTA Modal', { trigger })
    },

    shareRoutine () {
      const location = this.$router.resolve({ name: 'PublicRoutineDetails', params: this.$route.params })
      const url = window.location.origin + location.href
      const shareData = { url }
      if (navigator.canShare(shareData)) {
        this.trackAction('Routine: Open native share dialog', shareData)
        navigator.share(shareData)
      }
    },

    async completeRoutine ({ isSingleSession, noCongrats }) {
      if (this.externalCompletion) {
        this.$emit('done')
        return
      }
      this.triggerLoading(true)
      if (this.isDiscovery || this.isPublic) {
        this.$emit('completed-routine-local')
      }
      if (this.isLoggedIn) {
        this.trackAction('Routine: Finish Routine', { ...this.currentRoutine })
        if (this.isDiscovery) {
          await this.markAsCompletedDiscoveredRoutine()
        } else {
          await this.markRoutineAsDone({ routineId: this.userRoutineId })
          if (this.routineWithSessionsData?.tags?.some(t => t.toLowerCase() === 'first activity')) {
            this.handleCompletionRedirect()
          } else if (!noCongrats) {
            this.isCongratsVisible = true
          }
        }
      } else if (isSingleSession) {
        this.openSignWall('Mark single session as completed')
      } else {
        this.openSignWall('Routine completed')
      }
      this.triggerLoading(false)
    },

    joinNovosIfPublic () {
      this.openSignWall('Public: Show paywall modal')
    }
  }
}
