<template>
  <base-routine
    v-if="computedRoutine"
    :initialRoutine="computedRoutine"
    :isDuplicate="isDuplicate"
    @submit="submitRoutine"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseRoutineEdit from './BaseRoutineEdit'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {
    'base-routine': BaseRoutineEdit
  },

  computed: {
    ...mapGetters('trainingRoutine', {
      getRoutineById: 'getRoutine'
    }),

    routineId () {
      return this.$route.params.routineId
    },

    isDuplicate () {
      return this.$route.query.duplicate
    },

    computedRoutine () {
      return cloneDeep(this.routine)
    },
    routine () {
      return this.getRoutineById(this.routineId)
    }
  },
  created () {
    this.fetchAllSessions()
    this.fetchAllRoutines()
  },
  methods: {
    ...mapActions({
      fetchAllSessions: 'session/fetchAllSessions'
    }),
    ...mapActions('trainingRoutine', {
      _updateRoutine: 'updateRoutine',
      _createRoutine: 'createRoutine',
      fetchAllRoutines: 'fetchAllRoutines'
    }),

    async submitRoutine (routine) {
      if (this.isDuplicate) {
        await this.createRoutine(routine)
      } else {
        await this.updateRoutine(routine)
      }
    },
    async createRoutine (routine) {
      try {
        await this._createRoutine(routine)
        this.$q.notify({
          message: 'Routine was created',
          color: 'positive'
        })
      } catch (err) {
        this.$q.notify({
          message: err.message,
          color: 'negative'
        })
      }
    },
    async updateRoutine (routine) {
      try {
        await this._updateRoutine({
          id: this.routineId,
          ...routine
        })

        this.$q.notify({
          message: 'Routine was updated',
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
