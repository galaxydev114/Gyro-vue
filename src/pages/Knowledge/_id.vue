<template>
  <n-in-video v-if="knowledgeData"
              @back="$emit('back')"
              :data="knowledgeData"
              :returnPath="returnPath"
              ref="video"
              id="in-video"/>
</template>

<script>
import { scroll } from 'quasar'
import { mapGetters } from 'vuex'
const { setScrollPosition } = scroll
import notesContextMixin from '@/mixins/notesContext.mixin'

export default {
  components: {
    'n-in-video': () => import('@/components/knowledge/in-video')
  },
  mixins: [notesContextMixin],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      knowledgeTimes: 'knowledgeTime/knowledgeTimes'
    }),

    knowledgeData () {
      const knowledgeTime = this.knowledgeTimes[this.id]
      return knowledgeTime && {
        ...knowledgeTime,
        _id: knowledgeTime.knowledgeTimeId,
        isNew: this.$date().diff(knowledgeTime.knowledgeTimeCreatedAt, 'days') < 7,
        isDone: Boolean(knowledgeTime.isCompleted),
        time: Math.floor(knowledgeTime.videoDurationSeconds / 60),
        video: knowledgeTime.videoUrl
      }
    },
    id () {
      return this.$route.params.subid
    },
    returnPath () {
      return this.$route.params.id ? { name: 'Knowledge' } : { name: 'KnowledgeAll' }
    }
  },
  mounted () {
    this.trackAction('Knowledge time: visit a specific knowledge video', { ...this.knowledgeData })
  },
  watch: {
    id: {
      handler: function (value) {
        const body = document.getElementById('knowledge-main')
        if (!body) return
        setScrollPosition(body, 0, 0)
      },
      immediate: true
    },
    knowledgeData: {
      handler: function ({ title } = {}) {
        this.setNotesContext(title)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
#in-video {
  margin-bottom: 50px;
  padding-bottom: 50px;
  border-bottom: 1px solid $soft-tone;
  @media (max-width: $breakpoint-xs-max) {
    border-bottom: 4px solid $soft-tone;
    margin-bottom: 40px;
    padding-bottom: 40px;
  }
}
</style>
