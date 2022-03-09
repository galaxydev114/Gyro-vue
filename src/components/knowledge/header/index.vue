<template>
  <div class="knowledge-header">
    <div class="knowledge-header__container">
      <div class="row">
        <div class="col-12 col-sm-8">
          <div class="column">
            <div class="col gt-xs">
              <div class="row">
                <routine-category category="knowledge" xsmall />
                <div v-if="duration"
                     class="flex no-wrap items-center q-ml-lg">
                  <c-icon icon="timer" />
                  <div class="text-h5 q-ml-sm">
                    {{duration}} min
                  </div>
                </div>
              </div>
            </div>
            <div class="col q-mt-sm-lg q-mb-md d-flex items-center relative-position">
              <div class="text-h1">
                {{activity.title || 'Knowledge Time'}}
              </div>
              <router-link v-if="isInRoutine" :to="{name: 'TrainingPlan'}" class="q-ml-sm-lg back-icon">
                <c-icon icon="goBack" style="cursor: pointer" width="35px" />
              </router-link>
            </div>
            <div class="col">
              <div class="text-h4 text-weight-regular">
                <span v-if="isInRoutine">
                  {{'Take notes, be an active listener and don\'t extend the activity time.' ||activity.subtitle}}
                </span>
                <span v-else>
                  Take notes and be an active listener
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-4" v-if="isInRoutine">
          <div class="column">
            <div class="flex justify-end q-mb-md q-mt-lg q-mt-sm-none">
              <n-timer
                :seconds="durationInSeconds"
                @time-expire="markAsComplete(true)"
              />
            </div>
            <div class="col text-right">
              <div>
                <c-btn
                  class="q-ml-auto inline-block complete-btn"
                  :bold="false"
                  :disabled="isActivityCompleted"
                  @click="markAsComplete"
                >
                  Mark as complete
                </c-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    'n-timer': () => import('@/components/common/timer/squareHorizontalTimer'),
    'routine-category': () => import('@/components/common/activity-category')
  },
  computed: {
    ...mapGetters({
      getActivity: 'trainingRoutine/trainingRoutine',
      isActivityDone: 'trainingRoutine/isRoutineDone'
    }),

    isInRoutine () {
      return !!this.$route.params.id
    },

    activity () {
      return this.getActivity(this.$route.params.id)
    },

    isActivityCompleted () {
      return this.isActivityDone(this.$route.params.id)
    },

    duration () {
      return this.activity.sessions?.reduce((duration, session) =>
        duration + session.duration, 0
      )
    },

    durationInSeconds () {
      return this.duration * 60
    }
  },
  methods: {
    ...mapActions({
      markActivityAsDone: 'trainingRoutine/markRoutineAsDone'
    }),

    markAsComplete (isTriggeredAutomatically = false) {
      this.markActivityAsDone({ routineId: this.$route.params.id })

      isTriggeredAutomatically
        ? this.trackAction('Knowledge time: timer trigger "mark as complete"', { activity: this.activity })
        : this.trackAction('Knowledge time: click "mark as complete"', { activity: this.activity })

      this.$emit('activity-complete')
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge-header{
  background: $soft-tone;
  display: flex;
  justify-content: center;
  padding: 45px;
  &__container{
    width: 1100px;
    max-width: 90%;
  }
  @media (max-width: $breakpoint-md-max) {
    padding: 30px 20px;
    &__container{
      max-width: 100%;
    }
  }
  @media (max-width: $breakpoint-xs-max) {
    .complete-btn{
      width: 100%;
    }
    .back-icon{
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .text-h1{
      font-size: 36px;
      text-align: center;
      width: 100%;
    }
    .text-h4{
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
