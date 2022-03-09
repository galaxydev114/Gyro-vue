<template>
  <base-tournament-edit @submit="createTournament" />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {
    'base-tournament-edit': () => import('./BaseEdit')
  },

  methods: {
    ...mapActions('tournaments', {
      _createTournament: 'createTournament'
    }),

    async createTournament (tournament) {
      try {
        await this._createTournament(tournament)
        this.$q.notify({
          message: 'Tournament was created',
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
