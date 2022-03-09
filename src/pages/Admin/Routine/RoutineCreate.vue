<template>
  <base-routine @submit="createRoutine"/>
</template>

<script>
import { mapActions } from 'vuex'
import BaseRoutineEdit from './BaseRoutineEdit'

export default {
  components: {
    'base-routine': BaseRoutineEdit
  },

  methods: {
    ...mapActions('trainingRoutine', {
      _createRoutine: 'createRoutine'
    }),

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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
