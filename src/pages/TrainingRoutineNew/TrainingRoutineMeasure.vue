<template>
  <div class="full-height">
  <training-routine-base
    :routineId="routineId"
    :userRoutineId="userRoutineId"
    :sessionId="sessionId"
    :isViewingSession="isViewingSession"
    :analyticsContext="analyticsContext"
    :urlForRoutineOverview="urlForRoutineOverview"
    :urlForSession="urlForSession"
    :isRoutineMeasurable="true"
    :isDiscovery="isDiscovery"
    :isPublic="isPublic"
    :isCongratsVisible="isCongratsVisible"
    :routineWithSessionsData="routineWithSessionsData"
    :trainingSessionStats="currentSessionStats"
    :currentRoutine="currentRoutine"
    :currentSession="currentSession"
    :computedMap="computedMap"
    :animation="animation"
    @back="goBack"
    @click-session="clickSession"
    @overview-routine="overviewRoutine"
    @start-routine="startRoutine"
    @prev="selectPrevSession"
    @next="selectNextSession"
    @doneSession="doneSession"
    @doneRoutine="doneRoutine"
    @share="shareRoutine"
    @post-completion-redirect="handleCompletionRedirect"
    @score-submit-request="handleScoreSubmitRequest"
    @analytics="trackAction"
    @join-novos-if-public="joinNovosIfPublic"
  />
    <n-modal-submit-score
      :key="sessionId"
      :visible="showScoreModal"
      :providedScore="currentSession && currentSession.score"
      @close="showScoreModal = false"
      @skip="skipEnterScore()"
      @score="enteredScore"
      @analytics="trackAction"
    >
      {{currentSession ? `${currentSession.title}` : ''}}
    </n-modal-submit-score>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import paymentMixin from '@/mixins/payment.mixin'
import trainingRoutineCommonMixin from './_TrainingRoutineCommon.mixin'
import segmentAnalyticsMixin from '@/mixins/segmentAnalytics.mixin'

export default {
  components: {
    'training-routine-base': () => import('./TrainingRoutineBase.vue'),
    'n-modal-submit-score': () => import('@/components/common/modal/modal-tracking-score')
  },

  data () {
    return {
      isCongratsVisible: false,
      showScoreModal: false,
      measureGoNextTimer: null,
      scoreModalCallback: null
    }
  },

  mixins: [paymentMixin, trainingRoutineCommonMixin],
  computed: {
    ...mapGetters({ getSessionStats: 'session/getSessionStats' }),
    currentSessionStats () {
      const trainingSessionId = this.currentSession?.trainingSessionId
      const sessionStats = trainingSessionId && this.getSessionStats(trainingSessionId)
      return { ...sessionStats, sessionCounter: this.currentRoutine.defaultSessionIds.filter(a => a === sessionStats?.sessionId)?.length }
    }
  },
  methods: {
    ...mapActions({
      setSessionScoreGetStats: 'trainingRoutine/setSessionScoreGetStats',
      getSessionScoreStats: 'trainingRoutine/getSessionScoreStats',
      markSessionAsCompleted: 'trainingRoutine/markSessionAsDone'
    }),
    trackAction (event, opts = {}) {
      segmentAnalyticsMixin.methods.trackAction(this.analyticsContext + event,
        {
          ...opts,
          layout: 'v2',
          isTrackableRoutineAction: true,
          userRoutineId: this.userRoutineId,
          routineId: this.routineId,
          sessionId: this.sessionId,
          routineName: this.currentRoutine?.title,
          sessionName: this.currentSession?.title
        })
    },
    async handleScoreSubmitRequest () {
      this.showScoreModal = true
    },
    async doneRoutine (isSingleSession) {
      await this.completeRoutine(isSingleSession)
      if (this.currentSessionStats?.scores?.length <= 1) {
        this.$router.push({ path: '/progress', query: { tracking: 'true' } })
      } else {
        this.handleCompletionRedirect()
      }
    },
    async completeSession (sessionId, score) {
      this.trackAction('Session: Click Mark as complete', {
        routine: this.currentRoutine,
        session: this.currentSession
      })
      this.triggerLoading(true)
      if (this.userRoutineId) {
        await this.markSessionAsCompleted({
          routineId: this.userRoutineId,
          sessionId: sessionId
        })
        if (this.sessionId && score !== undefined) {
          await this.setSessionScoreGetStats({ routineId: this.userRoutineId, sessionId: this.sessionId, score })
        }
      } else {
        this.$emit('completed-session-local', {
          id: sessionId
        })
      }
      this.triggerLoading(false)
    },

    // shouldnt get called for this (measure) flow, just for fallback
    async doneSession (sessionId) {
      await this.completeSession(sessionId)

      if (this.nextUndoneSession) {
        this.selectNextSession(sessionId)
      }
    },
    async skipEnterScore () {
      this.showScoreModal = false
      await this.completeSession(this.sessionId)
      const isLastSession = this.currentRoutine?.sessions?.slice(-1)[0]?.id === this.sessionId
      if (this.nextUndoneSession && !isLastSession) {
        this.selectNextSession(this.sessionId)
      }
    },
    async enteredScore (score) {
      this.showScoreModal = false
      await this.completeSession(this.sessionId, score)
    }
  },
  watch: {
    sessionId: {
      immediate: true,
      handler (value) {
        if (value) {
          this.getSessionScoreStats(value)
        }
      }
    },
    showScoreModal: {
      immediate: true,
      handler (value) {
        if (value) {
          this.trackAction('Trackable Session: Submit score: show modal')
        }
      }
    }
  }
}
</script>
