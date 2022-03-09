<template>
  <article class="workshop-page scroll">
    <workshop-header
      :title="title"
      :subtitle="subTitle"
      :author="author"
      :difficulty-level="difficulty"
      :routine-duration="duration"
      category="Gamesense Workshop"
      backgroundless
      @back="goBack"
    >
      <c-btn v-if="!hasStarted"
        class="q-mt-md"
        data-intercom-target="start_workshop_button"
        :bold="false"
        @click="startVideo"
      >
        Start workshop
      </c-btn>
      <c-btn v-else
        class="q-mt-md"
        :bold="false"
        @click="markComplete"
      >
        Mark as complete
      </c-btn>
    </workshop-header>

    <section class="content">
      <chekpoints-video-player
        ref="videoPlayer"
        :src="videoUrl"
        :timestamps="timestampsTransformed"
        :poster="thumbnail"
        @play="startWorkshop"
      />

      <div class="submit-replay-container">
        <div class="row">
          <div class="col-12 col-md-4 col-xl-3" v-if="computedCredits && computedCredits.length">
            <div class="credit-section" v-if="computedCredits && computedCredits.length">
              <n-credits :paddingTop="false" :credits="computedCredits" @copy="copy"/>
            </div>
          </div>
          <div class="col-12"
               :class="{ 'col-md-8 col-xl-9' : computedCredits && computedCredits.length}">
            <div class="submit-replay">
              <h3 class="no-margin">Would you like to have your gameplay as a workshop?</h3>
              <p class="text-gray q-mt-md">Submit your replay and Novos coach will analyse if your content can be turned into
                a workshop.</p>
              <c-btn
                class="q-mt-lg"
                widthAuto
                @click="submitReplay"
              >
                Submit replay
              </c-btn>
            </div>
          </div>
        </div>
      </div>

    </section>
  </article>
</template>

<script>
import { copyToClipboard } from 'quasar'
const events = {
  submitReplay: 'submit-replay',
  startWorkshop: 'start-workshop',
  markComplete: 'mark-complete',
  pickAnotherActivity: 'pick-another-activity'
}

export default {
  components: {
    'workshop-header': () => import('@/components/gamesense-workshop/header'),
    'chekpoints-video-player': () => import('@/components/checkpoints-video-player'),
    'n-credits': () => import('@/components/common/credits')
  },

  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    subTitle: {
      type: String
    },
    author: {
      type: String,
      default: 'N/A'
    },
    difficulty: {
      type: String,
      required: true,
      default: ''
    },
    timestamps: {
      type: Array,
      default: () => []
    },
    duration: {
      type: Number,
      default: null
    },
    credit: {
      type: Object,
      default: () => {}
    },
    videoUrl: {
      type: String,
      required: true
    },
    hasStarted: {
      type: Boolean,
      default: false
    },
    thumbnail: {
      type: String,
      default: () => ''
    }
  },

  computed: {
    timestampsTransformed () {
      return this.timestamps.map(timestamp => {
        const [minutes, seconds] = timestamp.pointOfTime.split(':')
        const exactSeconds = (Number(minutes) * 60) + Number(seconds)
        return {
          ...timestamp,
          pointOfTime: exactSeconds
        }
      })
    },
    computedCredits () {
      if (this.credit && Object.keys(this.credit).length > 0 && this.credit.title !== '') {
        return [{ title: this.credit.title, value: this.credit.name, code: this.credit.sac, url: this.credit.url }]
      }
      return []
    }
  },

  methods: {
    copy (text) {
      copyToClipboard(text)
        .then(() => {
          this.$emit('copied')
          this.$q.notify({
            type: 'positive',
            message: 'Copied!'
          })
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Oops! Something went wrong (('
          })
        })
    },
    pickAnotherActivity () {
      this.$emit(events.pickAnotherActivity)
    },

    startWorkshop () {
      this.$emit(events.startWorkshop)
    },
    startVideo () {
      // eslint-disable-next-line no-unused-expressions
      this.$refs.videoPlayer?.playVideo()
      this.startWorkshop()
    },
    markComplete () {
      this.$emit(events.markComplete)
    },

    submitReplay () {
      this.$emit(events.submitReplay)
    },

    goBack () {
      this.$emit('back')
    }
  }
}
</script>

<style scoped lang="scss">
.workshop-page {
  height: 100%;
  overflow: auto;
  /deep/ {
    .routine-actions{
      padding-bottom: 0;
    }
  }
}

.content {
  padding: 55px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: $breakpoint-sm-max) {
    padding: 20px 20px 60px;
  }
}

.submit-replay-container {
  width: 100%;
  margin-top: 55px;
  border-top: 2px solid $soft-tone;
  padding-top: 60px;
  @media (max-width: $breakpoint-tablet-max) {
    padding-top: 30px;
  }
  .submit-replay {
    text-align: center;
    @media (max-width: $breakpoint-tablet-max) {
      padding-left: 30px;
    }
    @media (max-width: $breakpoint-sm-max) {
      padding: 0;
    }
  }
  .credit-section {
    text-align: left;
    padding-right: 60px;
    border-right: 2px solid $soft-tone;
    @media (max-width: $breakpoint-tablet-max) {
      padding-right: 30px;
    }
    @media (max-width: $breakpoint-sm-max) {
      padding: 0 0 30px;
      border-right: none;
      border-bottom: 2px solid $soft-tone;
      text-align: center;
      margin-bottom: 30px;
    }
  }
}
</style>
