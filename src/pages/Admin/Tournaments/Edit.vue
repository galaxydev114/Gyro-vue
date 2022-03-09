<template>
  <base-tournament-edit
    v-if="computedTournament"
    :initialTournament="computedTournament"
    :isDuplicate="isDuplicate"
    @submit="submitTournament"
  />
</template>

<script>
import { mapActions, mapState } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {
    'base-tournament-edit': () => import('./BaseEdit')
  },

  computed: {
    ...mapState('tournaments', {
      allTournaments: 'tournaments'
    }),

    tournamentId () {
      return this.$route.params.id
    },

    isDuplicate () {
      return this.$route.query.duplicate
    },

    computedTournament () {
      return cloneDeep(this.tournament)
    },
    tournament () {
      return this.allTournaments.find(tournament =>
        tournament.eventId + tournament.eventWindowId === this.tournamentId
      )
    }
  },
  created () {
    this.fetchAllTournaments()
  },
  methods: {
    ...mapActions('tournaments', {
      _updateTournament: 'updateTournament',
      _createTournament: 'createTournament',
      fetchAllTournaments: 'getTournamentsAdminList'
    }),

    async submitTournament (tournament) {
      if (this.isDuplicate) {
        await this.createTournament(tournament)
      } else {
        await this.updateTournament(tournament)
      }
    },
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
    },
    async updateTournament (tournament) {
      try {
        await this._updateTournament(tournament)
        this.$q.notify({
          message: 'Tournament was updated',
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
