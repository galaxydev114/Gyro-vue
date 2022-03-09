<template>
  <div class="full-height">
    <training-routine-measure
      v-if="isRoutineMeasurable"
      :routineId="routineId"
      :userRoutineId="userRoutineId"
      :sessionId="sessionId"
      :isViewingSession="isViewingSession"
      :urlForRoutineOverview="toRoutineOverview"
      :urlForSession="toSession"
      :analyticsContext="analyticsContext"
      :isDiscovery="isDiscovery"
      :isPublic="isPublic"
      :returnRouteName="returnRouteName"
      :currentRoutine="currentRoutine"
      :routineWithSessionsData="routineWithSessionsData"
      @loading="handleLoading"
      @completed-session-local="markSessionAsCompletedLocal"
      @completed-routine-local="markRoutineAsCompletedLocal"
    />
    <training-routine-standard
      v-else
      :routineId="routineId"
      :userRoutineId="userRoutineId"
      :sessionId="sessionId"
      :isViewingSession="isViewingSession"
      :urlForRoutineOverview="toRoutineOverview"
      :urlForSession="toSession"
      :analyticsContext="analyticsContext"
      :isDiscovery="isDiscovery"
      :isPublic="isPublic"
      :returnRouteName="returnRouteName"
      :currentRoutine="currentRoutine"
      :routineWithSessionsData="routineWithSessionsData"
      @loading="handleLoading"
      @completed-session-local="markSessionAsCompletedLocal"
      @completed-routine-local="markRoutineAsCompletedLocal"
    />
    <page-loader v-if="routineDataLoading || internalsBusy" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import * as api from '@/services/api'

export default {
  components: {
    'page-loader': () => import('@/components/common/page-loader'),
    'training-routine-standard': () => import('./TrainingRoutineStandard.vue'),
    'training-routine-measure': () => import('./TrainingRoutineMeasure.vue')
  },

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
    }
  },

  data () {
    return {
      routineWithSessionsData: null,
      routineDataLoading: null,
      internalsBusy: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.currentUser.id
    }),
    ...mapGetters('trainingRoutine', {
      getTrainingRoutine: 'trainingRoutine'
    }),
    ...mapGetters({ isLoggedIn: 'user/isLoggedIn' }),
    currentRoutine () {
      return this.userRoutineId
        ? this.getTrainingRoutine(this.userRoutineId)
        : this.routineWithSessionsData
    },
    isRoutineMeasurable () {
      return this.userRoutineId && Boolean(this.currentRoutine?.tags?.some(tag => tag.toLowerCase() === 'measure'))
    },
    isViewingSession () {
      return this.$route.name === this.routeInfo.sessionRouteName
    },
    routeInfo () {
      switch (this.$route.name) {
        case 'RoutineDetailsNew':
        case 'SessionDetailsNew':
          return {
            routineRouteName: 'RoutineDetailsNew',
            sessionRouteName: 'SessionDetailsNew',
            analyticsContext: '',
            returnTo: 'TrainingPlan'
          }
        case 'DiscoveryRoutineDetails':
        case 'DiscoverySessionDetails':
          return {
            routineRouteName: 'DiscoveryRoutineDetails',
            sessionRouteName: 'DiscoverySessionDetails',
            analyticsContext: 'CD: ',
            returnTo: 'Discovery'
          }
        case 'PublicRoutineDetails':
        case 'PublicSessionDetails':
          return {
            routineRouteName: 'PublicRoutineDetails',
            sessionRouteName: 'PublicSessionDetails',
            analyticsContext: 'Shared content: ',
            returnTo: null
          }
        default:
          return {
            routineRouteName: this.$route.name,
            sessionRouteName: this.$route.name,
            analyticsContext: '',
            returnTo: null
          }
      }
    },
    toRoutineOverview () {
      return { name: this.routeInfo.routineRouteName, query: this.$route.query }
    },
    toSession () {
      return { name: this.routeInfo.sessionRouteName, query: this.$route.query }
    },
    isDiscovery () {
      return this.routeInfo.routineRouteName.includes('Discovery')
      // return this.isLoggedIn && !this.userRoutineId
    },
    isPublic () {
      return this.routeInfo.routineRouteName.includes('Public')
      // return !this.isLoggedIn && !this.userRoutineId
    },
    analyticsContext () {
      return this.routeInfo.analyticsContext
    },
    returnRouteName () {
      return this.routeInfo.returnTo
    }
  },
  methods: {
    ...mapActions({
      fetchAlternativeRoutines: 'trainingRoutine/fetchAlternativeRoutines',
      fetchUserTrainingRoutineSessions: 'trainingRoutine/fetchUserTrainingRoutineSessions',
      getRoutineUserData: 'trainingRoutine/getRoutineUserData'
    }),
    handleLoading (loading) {
      this.internalsBusy = loading
    },
    markSessionAsCompletedLocal (session) {
      this.routineWithSessionsData = {
        ...this.routineWithSessionsData,
        sessions: this.routineWithSessionsData.sessions.map(s => {
          return s.id === session.id
            ? { ...s, isCompleted: true }
            : s
        })
      }
    },
    markRoutineAsCompletedLocal () {
      this.$set(this.routineWithSessionsData, 'sessions', this.routineWithSessionsData.sessions.map(s => {
        return { ...s, isCompleted: true }
      }))
    },
    async fetchData () {
      this.routineDataLoading = true
      try {
        await this.fetchRoutine()
        if (this.isLoggedIn) {
          if (this.routineId) {
            await this.getRoutineUserData({ userId: this.userId, trainingRoutineId: this.routineId })
          }
          if (this.userRoutineId) {
            await this.fetchUserTrainingRoutineSessions(this.userRoutineId)
          }
          if (this.currentRoutine) {
            await this.fetchAlternativeRoutines({ excludeIds: [`${this.userRoutineId}`], skillBased: this.currentRoutine.skill })
          }
        }
      } catch (err) {
        this.$q.notify({ type: 'negative', message: 'Couldn\'t get this content, please go back...' })
      }

      this.routineDataLoading = false
    },
    async fetchRoutine () {
      if (!this.routineId) {
        return
      }

      const response = await api.getRoutine(this.routineId)
      if (response.status === 200) {
        this.routineWithSessionsData = response.data.trainingRoutine
        await this.fetchDefaultSessions(this.routineWithSessionsData.defaultSessionIds)
      }
    },
    async fetchDefaultSessions (ids = []) {
      let sessions = []
      if (ids.length) {
        sessions = await api.getSessions(ids, true)
          .then(response => response.data.sessions)
      } else {
        sessions = [{}]
      }

      this.routineWithSessionsData = { ...this.routineWithSessionsData, sessions }
    }
  },
  created () {
    this.fetchData()
      .finally(() => {
        if (this.isPublic) {
          this.trackAction('Shared content: visit shared content', { routine: this.routineWithSessionsData })
        }
      })
  },
  beforeRouteUpdate (to, from, next) {
    if (from.params.id !== to.params.id) {
      this.fetchData()
    }
    next()
  }
}
</script>
