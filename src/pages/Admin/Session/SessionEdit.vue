<template>
  <base-session
    v-if="computedSession"
    :initialSession="computedSession"
    :isDuplicate="isDuplicate"
    @submit="submitSession"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseSessionEdit from './BaseSessionEdit'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {
    'base-session': BaseSessionEdit
  },

  created () {
    this.fetchAllSessions()
  },
  computed: {
    ...mapGetters('session', {
      getSessionById: 'getSession'
    }),

    sessionId () {
      return this.$route.params.sessionId
    },

    computedSession () {
      return cloneDeep(this.session)
    },

    session () {
      return this.getSessionById(this.sessionId)
    },

    isDuplicate () {
      return this.$route.query.duplicate
    }
  },

  methods: {
    ...mapActions({
      updateSession: 'session/updateSession',
      _createSession: 'session/createSession',
      fetchAllSessions: 'session/fetchAllSessions'
    }),

    async submitSession (session) {
      if (this.isDuplicate) {
        await this.createSession(session)
      } else {
        await this.updateSessionSubmit(session)
      }
    },
    async createSession (session) {
      try {
        await this._createSession(session)
        this.$q.notify({
          message: 'Session was created',
          color: 'positive'
        })
      } catch (err) {
        this.$q.notify({
          message: err.message,
          color: 'negative'
        })
      }
    },
    async updateSessionSubmit (session) {
      try {
        await this.updateSession({
          id: this.session.id,
          ...session
        })

        this.$q.notify({
          message: 'Session was updated',
          color: 'positive'
        })
      } catch (err) {
        this.$q.notify({
          message: err.message,
          color: 'negative'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
