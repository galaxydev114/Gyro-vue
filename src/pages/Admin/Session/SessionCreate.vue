<template>
  <base-session @submit="createSession"/>
</template>

<script>
import { mapActions } from 'vuex'
import BaseSessionEdit from './BaseSessionEdit'

export default {
  components: {
    'base-session': BaseSessionEdit
  },

  methods: {
    ...mapActions('session', {
      _createSession: 'createSession'
    }),

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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
