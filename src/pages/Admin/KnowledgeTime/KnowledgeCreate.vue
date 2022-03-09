<template>
  <base-knowledge @submit="createKnowledgeTime"/>
</template>

<script>
import { mapActions } from 'vuex'
import BaseKnowledgeEdit from './BaseKnowledgeEdit'

export default {
  components: {
    'base-knowledge': BaseKnowledgeEdit
  },

  methods: {
    ...mapActions('knowledgeTime', {
      _createKnowledgeTime: 'createKnowledgeTime'
    }),

    async createKnowledgeTime (knowledgeTime) {
      try {
        await this._createKnowledgeTime(knowledgeTime)
        this.$q.notify({
          message: 'KnowledgeTime video was created',
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
