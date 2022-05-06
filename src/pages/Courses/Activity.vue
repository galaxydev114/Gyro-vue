<template>
  <div class="full-height">
    <knowledge v-if="knowledge"
      :data="knowledge"
      :isCompleted="isCompleted"
      @back="handleBack"
      @done="handleDone"
      @analytics="trackAction"/>
    <workshop
      v-else-if="workshop"
      :data="workshop"
      :isCompleted="isCompleted"
      @back="handleBack"
      @done="handleDone"
      @analytics="trackAction"/>
    <training-routine-standard
      v-else-if="routine"
      :routineId="routine.trainingRoutineId"
      :sessionId="sessionId"
      :isViewingSession="isViewingSession"
      :externalCompletion="true"
      :externalIsCompleted="isCompleted"
      returnRouteName=""
      :currentRoutine="routineWithSessionsData"
      :routineWithSessionsData="routineWithSessionsData"
      @loading="handleLoading"
      @completed-session-local="markSessionAsCompletedLocal"
      @completed-routine-local="markRoutineAsCompletedLocal"
      @done="handleDone"
      @analytics="trackAction"
      @reroute-to-session="rerouteToSession"
      @reroute-to-overview="rerouteToOverview"
      />
    <page-loader v-if="isDataLoading || internalsBusy"/>
   </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import routineDataMixin from '@/mixins/routineData.mixin'
import segmentAnalyticsMixin from '@/mixins/segmentAnalytics.mixin'
import * as api from '@/services/api'

export default {
  components: {
    knowledge: () => import('./Knowledge.vue'),
    workshop: () => import('./Workshop.vue'),
    'page-loader': () => import('@/components/common/page-loader'),
    'training-routine-standard': () => import('@/pages/TrainingRoutineNew/TrainingRoutineStandard.vue')
  },
  mixins: [routineDataMixin],
  props: {
    activityId: null,
    courseId: null,
    sessionId: null
  },
  data () {
    return {
      internalsBusy: false,
      isDataLoading: false,
      activity: null
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser'
    }),
    isCompleted () {
      return this.activity?.isCompleted
    },
    knowledge () {
      return this.activity?.knowledgeTimeId && this.activity
    },
    workshop () {
      return this.activity?.gamesenseWorkshopId && this.activity
    },
    // We do not use activity here for compatibility reasons
    routine () {
      return this.routineWithSessionsData?.trainingRoutineId && this.routineWithSessionsData
    },
    // For routines
    toRoutineOverview () {
      return { name: 'CourseActivity', query: this.$route.query }
    },
    toSession () {
      return { name: 'CourseRoutineSession', query: this.$route.query }
    },
    isViewingSession () {
      return this.$route.name === 'CourseRoutineSession'
    }
  },
  methods: {
    ...mapActions({
      markKnowledgeActivityDone: 'courses/markKnowledgeActivityDone',
      getUserCourses: 'courses/getUserCourses'
    }),
    trackAction (event, opts = {}) {
      segmentAnalyticsMixin.methods.trackAction('Course: ' + event,
        {
          ...opts,
          layout: 'v2',
          ...this.activity,
          courseId: this.courseId
        })
    },
    rerouteToSession ({ sessionId }, callback) {
      if (sessionId) {
        this.$router.replace({
          name: 'CourseRoutineSession',
          query: this.$route.query,
          params: { id: this.courseId, activityId: this.activityId, sessionId }
        })
          .then(callback)
      }
    },
    rerouteToOverview () {
      this.$router.replace({ name: 'CourseActivity', query: this.$route.query, params: { id: this.courseId, activityId: this.activityId } })
    },
    goToCourse (query) {
      this.$router.push({ name: 'Course', params: { id: this.courseId }, query: query })
    },
    handleBack () {
      this.goToCourse()
    },
    async handleDone () {
      this.isDataLoading = true
      if (this.activity?.knowledgeTimeId) {
        await api.markKnowledgeDoneNew(this.currentUser.id, this.activity.knowledgeTimeId)
      } else if (this.activity?.gamesenseWorkshopId) {
        await api.markWorkshopDone(this.currentUser.id, this.activity.gamesenseWorkshopId)
      } else if (this.routineWithSessionsData?.trainingRoutineId) {
        await api.completeDiscoveredRoutine(this.routineWithSessionsData.trainingRoutineId, this.currentUser.id)
      } else {
        console.error('Done handler called, but no activity was loaded')
      }
      this.trackAction('Complete an Activity')
      this.goToCourse({ completedActivityId: this.activityId })
    },
    async fetchActivity () {
      const activityId = this.activityId
      if (!activityId) {
        return
      }

      const response = await api.getUserCourseTrainingActivity(this.currentUser.id, this.courseId, this.activityId)
      if (response.status === 200) {
        this.activity = response.data
        if (this.activity.trainingRoutineId) {
          this.routineWithSessionsData = this.activity
          await this.fetchDefaultSessions(this.routineWithSessionsData.defaultSessionIds)
          if (this.activity?.isCompleted) {
            this.markRoutineAsCompletedLocal()
          }
        }
      }
    },
    handleLoading (loading) {
      this.internalsBusy = loading
    }
  },
  async created () {
    this.isDataLoading = true
    try {
      await this.fetchActivity()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Couldn\'t get this content, please go back...' })
    }
    this.isDataLoading = false
  }
}
</script>
