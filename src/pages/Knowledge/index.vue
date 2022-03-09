<template>
  <article class="overflow-auto full-height" id="knowledge-main" ref="knowledge-main">
    <n-knowledge-header @activity-complete="closeCongratsModal"/>

    <n-netflix-slider class="q-mt-sm q-mx-lg"
                      @click="goToVideo"
                      :slides="slides" />

    <div class="knowledge">
      <div class="knowledge__container">
        <div class="knowledge__in-video"
              :class="{'knowledge__in-video--active': subId}">
          <router-view :key="subId" @back="scrollToTheList" />
        </div>
        <n-knowledge ref="main" :videos="videos" @click="goToVideo" />
        <n-congrats-knowledge
          v-if="userKnowledgeId"
          :visible="isCongratsVisible"
          @close="isCongratsVisible = false"
          @back-to-tp="backToTrainingPlan"
        />
      </div>
    </div>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { scroll } from 'quasar'
export default {
  components: {
    'n-knowledge-header': () => import('@/components/knowledge/header'),
    'n-knowledge': () => import('@/components/knowledge'),
    'n-congrats-knowledge': () => import('@/components/dashboard/modal/modal-congrats-knowledge'),
    'n-netflix-slider': () => import('@/components/common/netflix-slider')
  },

  data: () => ({
    isCongratsVisible: false
  }),

  async created () {
    if (this.userKnowledgeId) {
      await this.fetchActivity(this.userKnowledgeId)
    }
    this.$emit('loaded', 'Knowledge')
  },

  computed: {
    ...mapGetters({
      knowledgeTimes: 'knowledgeTime/knowledgeTimes'
    }),
    userKnowledgeId () {
      return this.$route.params.id
    },
    subId () {
      return this.$route.params.subid
    },

    videos () {
      return Object.values(this.knowledgeTimes).map(knowledgeTime => {
        return {
          ...knowledgeTime,
          _id: knowledgeTime.knowledgeTimeId,
          isNew: this.$date().diff(knowledgeTime.knowledgeTimeCreatedAt, 'days') < 7,
          isDone: Boolean(knowledgeTime.isCompleted),
          time: Math.floor(knowledgeTime.videoDurationSeconds / 60),
          video: knowledgeTime.videoUrl
        }
      })
    },
    slides () {
      const slides = []
      this.videos.forEach((item) => {
        const slide = {}
        const matched = item.video.match(/youtube.com\/embed\/([^#&?]*)/)
        if (matched) {
          slide.img = `https://i.ytimg.com/vi/${matched[1]}/mqdefault.jpg`
        } else if (item.thumbnail) {
          slide.img = item.thumbnail
        } else {
          slide.img = 'https://aggbwkxwqp.cloudimg.io/img.dexerto.com/_s3_/uploads/2020/10/05004041/Fortnite-Original-Map.png?w=620'
        }

        slide.title = item.title
        slide._id = item._id
        slide.description = item.description
        slides.push(slide)
      })
      return slides
    }
  },

  methods: {
    ...mapActions({
      fetchActivity: 'trainingRoutine/fetchUserTrainingRoutineSessions'
    }),

    closeCongratsModal () {
      this.isCongratsVisible = true
    },

    backToTrainingPlan () {
      this.closeCongratsModal()
      this.$router.push('/training-plan')
    },
    scrollToTheList () {
      if (this.$q.screen.xs) {
        setTimeout(() => {
          const el = this.$refs.main?.$el
          const elTop = el?.offsetTop
          window.scrollTo({
            top: elTop + 200,
            behavior: 'smooth'
          })
        }, 200)
      }
    },
    goToVideo (item) {
      this.$router.push({
        name: this.$route.params.id ? 'InVideo' : 'InVideo2',
        params: { subid: item._id }
      })
        .catch(err => {
          if (err.name === 'NavigationDuplicated') {
            // trigger scroll again
            const body = document.getElementById('knowledge-main')
            scroll.setScrollPosition(body, 0, 200)
          } else {
            throw err
          }
        })
    }
  }
}
</script>

<style lang="scss">
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
