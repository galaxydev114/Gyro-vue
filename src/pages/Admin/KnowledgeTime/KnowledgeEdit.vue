<template>
  <base-knowledge
    v-if="computedKnowledgeTime"
    :initialKnowledgeTime="computedKnowledgeTime"
    :isDuplicate="isDuplicate"
    @submit="submitKnowledgeTime"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseKnowledgeEdit from './BaseKnowledgeEdit'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {
    'base-knowledge': BaseKnowledgeEdit
  },

  created () {
    this.fetchAllKnowledgeTimes()
  },
  computed: {
    ...mapGetters('knowledgeTime', {
      knowledgeTimes: 'knowledgeTimes'
    }),

    knowledgeTimeId () {
      return this.$route.params.knowledgeTimeId
    },

    computedKnowledgeTime () {
      return cloneDeep(this.knowledgeTime)
    },

    knowledgeTime () {
      return this.knowledgeTimes[this.knowledgeTimeId]
    },

    isDuplicate () {
      return this.$route.query.duplicate
    }
  },

  methods: {
    ...mapActions({
      updateKnowledgeTime: 'knowledgeTime/updateKnowledgeTime',
      _createKnowledgeTime: 'knowledgeTime/createKnowledgeTime',
      fetchAllKnowledgeTimes: 'knowledgeTime/fetchAllKnowledges'
    }),

    async submitKnowledgeTime (knowledgeTime) {
      if (this.isDuplicate) {
        await this.createKnowledgeTime(knowledgeTime)
      } else {
        await this.updateKnowledgeTimeSubmit(knowledgeTime)
      }
    },
    async createKnowledgeTime (knowledgeTime) {
      try {
        await this._createKnowledgeTime(knowledgeTime)
        this.$q.notify({
          message: 'KnowledgeTime was created',
          color: 'positive'
        })
      } catch (err) {
        this.$q.notify({
          message: err.message,
          color: 'negative'
        })
      }
    },
    async updateKnowledgeTimeSubmit (knowledgeTime) {
      try {
        await this.updateKnowledgeTime({
          id: this.knowledgeTime.id,
          ...knowledgeTime
        })

        this.$q.notify({
          message: 'KnowledgeTime was updated',
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
