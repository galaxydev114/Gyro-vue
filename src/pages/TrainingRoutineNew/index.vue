<template>
  <div :class="{'full-height': $q.screen.width > 576}" ref="main">
    <training-routine-shared
      v-if="isSharedRoutine && routineWithSessionsData"
      :routineId="routineWithSessionsData.id"
      :sessionId="sessionId"
      :isViewingSession="isViewingSession"
      :isDiscovery="isDiscovery"
      :isPublic="isPublic"
      :returnRouteName="returnRouteName"
      :currentRoutine="currentRoutine"
      :friendGroupEventId="friendGroupEventId"
      :routineWithSessionsData="routineWithSessionsData"
      @loading="handleLoading"
      @analytics="trackAction"
      @reroute-to-session="rerouteToSession"
      @reroute-to-overview="rerouteToOverview"
    />
    <training-routine-measure
      v-else-if="isRoutineMeasurable && routineId"
      :routineId="routineId"
      :userRoutineId="userRoutineId"
      :sessionId="sessionId"
      :isViewingSession="isViewingSession"
      :isDiscovery="isDiscovery"
      :isPublic="isPublic"
      :returnRouteName="returnRouteName"
      :currentRoutine="currentRoutine"
      :routineWithSessionsData="routineWithSessionsData"
      @loading="handleLoading"
      @completed-session-local="markSessionAsCompletedLocal"
      @completed-routine-local="markRoutineAsCompletedLocal"
      @analytics="trackAction"
      @reroute-to-session="rerouteToSession"
      @reroute-to-overview="rerouteToOverview"
      @reroute-to-new-user-routine="rerouteToRoutine"
    />
    <training-routine-standard
      v-else-if="routineId"
      :routineId="routineId"
      :userRoutineId="userRoutineId"
      :sessionId="sessionId"
      :isViewingSession="isViewingSession"
      :isDiscovery="isDiscovery"
      :isPublic="isPublic"
      :returnRouteName="returnRouteName"
      :currentRoutine="currentRoutine"
      :routineWithSessionsData="routineWithSessionsData"
      @loading="handleLoading"
      @completed-session-local="markSessionAsCompletedLocal"
      @completed-routine-local="markRoutineAsCompletedLocal"
      @analytics="trackAction"
      @reroute-to-session="rerouteToSession"
      @reroute-to-overview="rerouteToOverview"
      @reroute-to-new-user-routine="rerouteToRoutine"
    />
    <page-loader v-if="routineDataLoading || internalsBusy" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import routineDataMixin from '@/mixins/routineData.mixin'
import segmentAnalyticsMixin from '@/mixins/segmentAnalytics.mixin'

export default {
  components: {
    'page-loader': () => import('@/components/common/page-loader'),
    'training-routine-standard': () => import('./TrainingRoutineStandard.vue'),
    'training-routine-measure': () => import('./TrainingRoutineMeasure.vue'),
    'training-routine-shared': () => import('./TrainingRoutineShared.vue')
  },

  props: {
    routineId: {
      type: String,
      default: null
    },
    userRoutineId: {
      type: String,
      default: null
    },
    sessionId: {
      type: String,
      default: null
    },
    friendGroupEventId: {
      type: String,
      default: null
    }
  },
  mixins: [routineDataMixin],
  data () {
    return {
      routineDataLoading: null,
      internalsBusy: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.currentUser.id
    }),
    ...mapGetters({
      getTrainingRoutine: 'trainingRoutine/trainingRoutine',
      getFriendGroupEvent: 'trainingPlan/getFriendGroupEvent',
      isLoggedIn: 'user/isLoggedIn'
    }),
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
        case 'FriendGroupEventRoutine':
        case 'FriendGroupEventSession':
          return {
            routineRouteName: 'FriendGroupEventRoutine',
            sessionRouteName: 'FriendGroupEventSession',
            analyticsContext: 'FG Event Routine: ',
            returnTo: 'TrainingPlan'
          }
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
    isSharedRoutine () {
      return this.routeInfo.routineRouteName.includes('FriendGroup')
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
      getRoutineUserData: 'trainingRoutine/getRoutineUserData',
      getUserFriendGroupEvents: 'trainingPlan/getUserFriendGroupEvents'
    }),
    trackAction (event, opts) {
      segmentAnalyticsMixin.methods.trackAction(this.analyticsContext + event, { ...opts, layout: 'v2' })
    },
    handleLoading (loading) {
      this.internalsBusy = loading
    },
    rerouteToSession ({ sessionId }, callback) {
      const rootId = this.isSharedRoutine ? this.friendGroupEventId : this.routineId
      if (sessionId) {
        this.$router.replace({ name: this.routeInfo.sessionRouteName, query: this.$route.query, params: { id: rootId, sessionId } }).then(callback)
      }
    },
    rerouteToOverview () {
      // TODO - not nice tactics
      const rootId = this.isSharedRoutine ? this.friendGroupEventId : this.routineId
      this.$router.replace({ name: this.routeInfo.sessionRouteName, query: this.$route.query, params: { id: rootId } })
    },
    rerouteToRoutine ({ routineId, userTrainingActivityId }) {
      this.$router.replace({ ...this.toRoutineOverview, query: { userTrainingActivityId }, params: { id: routineId } })
    },
    async fetchData () {
      this.routineDataLoading = true
      try {
        if (this.isSharedRoutine) {
          let trainingRoutine = this.getFriendGroupEvent(this.friendGroupEventId)?.trainingRoutine
          if (!trainingRoutine) {
            await this.getUserFriendGroupEvents()
            trainingRoutine = this.getFriendGroupEvent(this.friendGroupEventId)?.trainingRoutine
          }
          this.routineWithSessionsData = trainingRoutine
          await this.fetchDefaultSessions(trainingRoutine.defaultSessionIds)
        }
        await this.fetchRoutine(this.routineId)
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
    const scrollEl = document.getElementsByClassName('n-dashboard__content')
    if (scrollEl && scrollEl.length) {
      scrollEl[0].scrollTop = 0
    }
    if (from.params.id !== to.params.id) {
      this.fetchData()
    }
    next()
  }
}
</script>
