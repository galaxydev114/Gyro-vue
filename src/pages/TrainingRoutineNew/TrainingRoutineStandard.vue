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
      :isDiscovery="isDiscovery"
      :isPublic="isPublic"
      :isCongratsVisible="isCongratsVisible"
      :routineWithSessionsData="routineWithSessionsData"
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
      @analytics="trackAction"
      @join-novos-if-public="joinNovosIfPublic"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import paymentMixin from '@/mixins/payment.mixin'
import trainingRoutineCommonMixin from './_TrainingRoutineCommon.mixin'
import segmentAnalyticsMixin from '@/mixins/segmentAnalytics.mixin'

export default {
  components: {
    'training-routine-base': () => import('./TrainingRoutineBase.vue')
  },

  data () {
    return {
      isCongratsVisible: false
    }
  },

  mixins: [paymentMixin, trainingRoutineCommonMixin],

  methods: {
    ...mapActions({
      markSessionAsCompleted: 'trainingRoutine/markSessionAsDone',
      markRoutineAsDone: 'trainingRoutine/markRoutineAsDone'
    }),
    trackAction (event, opts = {}) {
      segmentAnalyticsMixin.methods.trackAction(this.analyticsContext + event, { ...opts, layout: 'v2' })
    },
    async completeSession (sessionId) {
      this.triggerLoading(true)
      if (this.userRoutineId) {
        await this.markSessionAsCompleted({
          routineId: this.userRoutineId,
          sessionId: sessionId
        })
      } else {
        this.$emit('completed-session-local', {
          id: sessionId
        })
      }
      this.triggerLoading(false)
    },
    async doneSession (sessionId) {
      this.trackAction('Session: Click Mark as complete', {
        routine: this.currentRoutine,
        session: this.currentSession
      })
      await this.completeSession(sessionId)

      if (this.nextUndoneSession) {
        this.selectNextSession(sessionId)
      }
    },
    async doneRoutine (isSingleSession) {
      this.trackAction('Routine: Click Mark as done', {
        routineId: this.routineId
      })
      await this.completeRoutine({ isSingleSession })
    }
  }
}
</script>
