import * as api from '@/services/api'

export default {
  data () {
    return {
      routineWithSessionsData: null
    }
  },
  methods: {
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
      if (this.routineWithSessionsData.sessions) {
        this.$set(this.routineWithSessionsData, 'sessions', this.routineWithSessionsData.sessions.map(s => {
          return { ...s, isCompleted: true }
        }))
      }
    },
    async fetchRoutine (routineId) {
      if (!routineId) {
        return
      }
      const response = await api.getRoutine(routineId)
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
  }
}
