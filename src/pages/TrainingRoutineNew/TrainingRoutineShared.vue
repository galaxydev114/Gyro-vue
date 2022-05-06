<template>
  <div class="full-height">
    <training-routine-base
      :routineId="routineId"
      :sessionId="sessionId"
      :isViewingSession="isViewingSession"
      :isDiscovery="isDiscovery"
      :isPublic="isPublic"
      :currentRoutine="currentRoutine"
      :currentSession="currentSession"
      :computedMap="computedMap"
      :animation="animation"
      :participants="participants"
      :nonCompletable="true"
      :isUserGoing="isUserGoing"
      @back="goBack"
      @click-session="clickSession"
      @overview-routine="overviewRoutine"
      @start-routine="startRoutine"
      @prev="selectPrevSession"
      @next="selectNextSession"
      @doneSession="doneSession"
      @share="shareRoutine"
      @analytics="trackAction"
      @subscribe-to-event="subscribe"
      @unsubscribe-from-event="unsubscribe"
    />
    <modal-fg-sent-discord :discordLink="discordEventUrl" :visible="Boolean(justSubscribed)" @done="justSubscribed = false" @close="justSubscribed = false"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import paymentMixin from '@/mixins/payment.mixin'
import trainingRoutineCommonMixin from './_TrainingRoutineCommon.mixin'

export default {
  components: {
    'training-routine-base': () => import('./TrainingRoutineBase.vue'),
    'modal-fg-sent-discord': () => import('@/components/friend-group/modal/modal-sent-discord')
  },

  data () {
    return {
      isCongratsVisible: false,
      justSubscribed: false
    }
  },

  computed: {
    ...mapGetters({
      getFriendGroupEventParticipants: 'trainingPlan/getFriendGroupEventParticipants',
      getFriendGroupEvent: 'trainingPlan/getFriendGroupEvent',
      isUserGoingToEvent: 'trainingPlan/isUserGoingToEvent'
    }),
    isUserGoing () {
      return this.isUserGoingToEvent(this.friendGroupEventId)
    },
    participants () {
      return this.getFriendGroupEventParticipants(this.friendGroupEventId)
    },
    discordEventUrl () {
      return this.getFriendGroupEvent(this.friendGroupEventId)?.discordEventUrl
    }
  },

  props: {
    friendGroupEventId: {
      type: String,
      default: null
    }
  },

  mixins: [paymentMixin, trainingRoutineCommonMixin],

  methods: {
    ...mapActions({
      subscribeToEvent: 'trainingPlan/subscribeToEvent',
      unsubscribeFromEvent: 'trainingPlan/unsubscribeFromEvent'
    }),
    async subscribe () {
      this.triggerLoading(true)
      await this.subscribeToEvent(this.friendGroupEventId)
      this.triggerLoading(false)
      this.justSubscribed = true
    },
    async unsubscribe () {
      this.triggerLoading(true)
      await this.unsubscribeFromEvent(this.friendGroupEventId)
      this.triggerLoading(false)
    },
    trackAction (event, opts = {}) {
      this.$emit('analytics', event, { ...opts, layout: 'v2' })
    },
    // TODO - should we show like we are completing smth?
    async doneSession (sessionId) {
      this.trackAction('Session: Next session', {
        routine: this.currentRoutine,
        session: this.currentSession
      })
      this.$emit('completed-session-local', {
        id: sessionId
      })
      if (this.nextUndoneSession) {
        this.selectNextSession(sessionId)
      }
    }
  }
}
</script>
