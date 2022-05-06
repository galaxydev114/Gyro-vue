<template>
  <div class="full-height">
    <content-part
      v-if="content"
      :title="content.title"
      :subtitle="content.subtitle"
      :category="currentRoutine.skill"
      :author="content.approvedBy"
      :difficulty="content.difficulty"
      :isExclusive="currentRoutine.isExclusive"
      :tags="content.tags"
      :content="content.content"
      :notesSubtitle="content.notesSubtitle"
      :notes="content.notes"
      :credits="content.credits"
      :videoUrl="isShowingSecondVideo ?  content.secVideoUrl : content.videoUrl"
      :thumbnail="isShowingSecondVideo ? content.secThumbnail : content.thumbnail"
      :sessions="currentRoutine.sessions"
      :participants="participants"
      :lastUpdated="content.lastUpdated"
      :sessionId="sessionId"
      :trainingSessionStats="trainingSessionStats"
      :routineId="routineId"
      :duration="currentSession && parseInt(currentSession.duration)"
      :map="computedMap"
      :benchmark="currentSession && currentSession.benchmark"
      :routineDaysCounter="computedRoutineDaysCounter"
      :isRoutineStarted="isRoutineStarted"
      :isRoutineCompleted="externalCompletion ? isRoutineCompleted : isRoutineInitiallyCompleted"
      :isRoutineMeasurable="isRoutineMeasurable"
      :nonCompletable="nonCompletable"
      :isDone="currentSession && currentSession.isCompleted"
      :isLoggedIn="isLoggedIn"
      :isInActivity="!!userRoutineId"
      :animation="animation"
      :userEmail="userEmail"
      :currentSessionScore="currentSession && currentSession.score"
      :isUserGoing="isUserGoing"
      backButtonName='Go back'
      v-on="$listeners"
      @pick-another-routine="openPickAnotherRoutineDialog"
      @start-timer="handleStartTimerClick"
      @copy-credits="handleCreditsClick"
      @copy-map-code="handleMapCodeClick"
      @click-video="handleVideoClick"
      @click-playlist="handlePlaylistClick"
    />

    <n-pick-another-routine
      v-if="isPickAnotherRoutineDialog"
      :available-routines="alternativeRoutines"
      @close="closePickAnotherRoutineDialog"
      @select="selectAnotherRoutineDialog"
    />
   <!--  TODO  handle case for courses -->
    <n-congrats-routine
      v-if="currentRoutine"
      :ctaTitle="isDiscovery ? 'Back to discover' : 'Go to training plan'"
      :visible="isCongratsVisible && isRoutineCompleted"
      :routine="currentRoutine"
      @post-completion-redirect="$emit('post-completion-redirect')"
    />

  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import paymentMixin from '@/mixins/payment.mixin'
import notesContextMixin from '@/mixins/notesContext.mixin'

export default {
  components: {
    'content-part': () => import('@/components/training-routine-new/index.vue'),
    'n-pick-another-routine': () => import('@/components/training-routine/pick-another-routine'),
    'n-congrats-routine': () => import('@/components/dashboard/modal/modal-congrats-routine')
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
    },
    isViewingSession: {
      type: Boolean,
      default: null
    },
    isCongratsVisible: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      default: false
    },
    isRoutineMeasurable: {
      type: Boolean,
      default: false
    },
    isDiscovery: {
      type: Boolean,
      default: false
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    trainingSessionStats: {
      type: Object,
      default: null
    },
    currentSession: {
      type: Object,
      default: null
    },
    currentRoutine: {
      type: Object,
      default: null
    },
    computedMap: {
      type: Object,
      default: null
    },
    externalCompletion: {
      type: Boolean,
      default: false
    },
    nonCompletable: {
      type: Boolean,
      default: false
    },
    participants: {
      type: Array,
      default: () => []
    },
    isUserGoing: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isPickAnotherRoutineDialog: false,
      isRoutineInitiallyCompleted: false
    }
  },

  mixins: [paymentMixin, notesContextMixin],

  async mounted () {
    this.trackAction('Routine: Visit Routine', { ...this.content })
  },

  computed: {

    ...mapGetters('trainingRoutine', {
      trainingRoutineUserData: 'getTrainingRoutineUserData',
      alternativeRoutines: 'getAlternativeRoutines'
    }),

    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn'
    }),

    ...mapState({
      userEmail: state => state.user?.currentUser?.email
    }),

    content () {
      if (this.isViewingSession) {
        return this.currentSession
      } else {
        return this.currentRoutine
      }
    },

    isShowingSecondVideo () {
      return this.computedRoutineDaysCounter > 0 && this.content?.secVideoUrl
    },

    computedRoutineDaysCounter () {
      return this.trainingRoutineUserData?.daysCounterCompleted || 0
    },

    isRoutineStarted () {
      if (!this.currentRoutine?.sessions) {
        return false
      }

      const countCompletedSessions = this.currentRoutine.sessions
        .filter(session => session.isCompleted)

      return countCompletedSessions.length > 0
    },

    isRoutineCompleted () {
      if (!this.currentRoutine?.sessions) {
        return false
      }

      const countCompletedSessions = this.currentRoutine.sessions
        .filter(session => session.isCompleted)
      const isAllSessionsCompleted = countCompletedSessions.length === this.currentRoutine.sessions.length

      return Boolean(this.currentRoutine.isCompleted) || isAllSessionsCompleted
    }
  },

  methods: {
    ...mapActions({
      createNewUserRoutine: 'trainingRoutine/createNewUserRoutine',
      pickAnotherRoutine: 'trainingPlan/pickAnotherRoutine'
    }),
    trackAction () {
      this.$emit('analytics', ...arguments)
    },
    handleVideoClick () {
      if (this.isViewingSession) {
        this.trackAction('Session: Click Session Video', {
          routine: this.currentRoutine,
          session: this.currentSession
        })
      } else {
        this.trackAction('Routine: Click Routine Video', {
          ...this.currentRoutine,
          videoOrderNum: this.isShowingSecondVideo ? 2 : 1
        })
      }
    },
    handleCreditsClick () {
      if (this.isViewingSession) {
        this.trackAction('Session: Copy credits code', {
          routine: this.currentRoutine,
          session: this.currentSession
        })
      } else {
        this.trackAction('Routine: Copy credits code', this.currentRoutine)
      }
    },
    handleStartTimerClick () {
      if (this.isViewingSession) {
        this.trackAction('Session: Start Timer', {
          routine: this.currentRoutine,
          session: this.currentSession
        })
      } else {
        this.trackAction('Routine: Start Timer', this.currentRoutine)
      }
    },
    handleMapCodeClick () {
      if (this.isViewingSession) {
        this.trackAction('Session: Copy credits code', {
          routine: this.currentRoutine,
          session: this.currentSession
        })
      } else {
        this.trackAction('Routine: Copy credits code', this.currentRoutine)
      }
    },
    handlePlaylistClick () {
      if (this.isViewingSession) {
        this.trackAction('Session: Click Session Playlist Download', {
          routine: this.currentRoutine,
          session: this.currentSession
        })
      } else {
        this.trackAction('Routine: Click Routine Playlist Download', this.currentRoutine)
      }
    },
    async openPickAnotherRoutineDialog () {
      if (!this.checkPremiumActionRestriction('showAddNewRoutineModal')) {
        return
      }
      if (this.isPublic) {
        this.openSignWall('Pick another routine')
        return
      }
      this.isPickAnotherRoutineDialog = true
      this.trackAction('Routine: Click Pick Another routine', this.currentRoutine)
    },
    closePickAnotherRoutineDialog () {
      this.isPickAnotherRoutineDialog = false
      this.trackAction('Routine: Cancel Pick Another routine')
    },
    async selectAnotherRoutineDialog (choosedRoutine) {
      this.trackAction('Routine: Approve Pick Another routine', choosedRoutine)

      const userTrainingRoutine = await this.createNewUserRoutine(choosedRoutine)
      if (!userTrainingRoutine) {
        return
      }

      await this.pickAnotherRoutine({ newRoutine: userTrainingRoutine, oldId: this.userRoutineId })

      this.closePickAnotherRoutineDialog()
      this.$emit('new-routine-picked', { routineId: choosedRoutine.id, userTrainingActivityId: userTrainingRoutine.id })
    }
  },
  watch: {
    content (value) {
      if (value) this.setNotesContext(value.title)
    },
    currentRoutine: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal?.id && (!oldVal || newVal.id !== oldVal.id)) {
          this.isRoutineInitiallyCompleted = this.isRoutineCompleted
        }
      }
    }
  }
}
</script>
