<template>
  <article class="overflow-auto full-height" id="knowledge-main">
    <n-knowledge-header />
    <div class="knowledge q-mt-lg">
      <div class="knowledge__container">
        <div class="knowledge__in-video"
              :class="{'knowledge__in-video--active': !!knowledgeId}">
          <n-in-video v-if="knowledgeData"
            isPublic
            @back="$emit('back')"
            :data="knowledgeData"
          />
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '@/services/api'

export default {
  components: {
    'n-knowledge-header': () => import('@/components/knowledge/header'),
    'n-in-video': () => import('@/components/knowledge/in-video')
  },

  props: {
    knowledgeId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    knowledge: {}
  }),

  computed: {
    ...mapGetters({
      knowledgeTimes: 'knowledgeTime/knowledgeTimes'
    }),

    knowledgeData () {
      const knowledgeTime = this.knowledge
      return knowledgeTime && {
        ...knowledgeTime,
        _id: knowledgeTime.knowledgeTimeId,
        isNew: this.$date().diff(knowledgeTime.knowledgeTimeCreatedAt, 'days') < 7,
        isDone: Boolean(knowledgeTime.isCompleted),
        time: Math.floor(knowledgeTime.videoDurationSeconds / 60),
        video: knowledgeTime.videoUrl
      }
    }
  },

  methods: {
    fetchKnowledgeData: async function () {
      const response = await api.getKnowledge(this.knowledgeId)
      if (response.status === 200) {
        this.knowledge = response.data.knowledgeTime
      }
    }
  },

  async created () {
    await this.fetchKnowledgeData()
    this.$emit('loaded', 'Knowledge')
  }
}
</script>

<style lang="scss" scoped>
.knowledge {
  padding: 10px 45px 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &__container {
    width: 1100px;
    max-width: 90%;
    margin: 0 auto;
  }

  &__in-video{
    max-height: 0;
    overflow: hidden;
    transition: all .3s ease-in-out;
    margin-bottom: 50px;
    @media (max-width: $breakpoint-xs-max) {
      margin-bottom: 40px;
    }
    &--active{
      max-height: 800px;
    }
  }
  @media (max-width: $breakpoint-md-max) {
    padding: 10px 20px 30px 20px;
    &__container{
      max-width: 100%;
    }
  }
}
</style>
