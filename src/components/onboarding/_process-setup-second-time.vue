<template>
  <q-layout view="lHh Lpr lFf">

    <q-drawer
      v-if="$q.screen.gt.sm"
      :value="$q.screen.gt.sm"
      :width="leftBarWidth"
      :content-style="{'background': 'none'}">
      <left-bar
        :preparingList="computedPreperingArray"
        :currentStep="currentStep"
        :userName="userName"
        :emailAddress="emailAddress"
        :showAgainBtn="false"/>
    </q-drawer>

    <q-page-container>
      <div class="col q-pa-md border-bottom flex items-center lt-md">
        <div class="mobile-step text-h4 q-mr-md bg-soft-tone flex items-center justify-center border">
          {{ currentStep }}
        </div>
        <div class="text-subtitle1 text-weight-bold">
          {{ computedPreperingArray.find(el => el.step === currentStep).label }}
        </div>
      </div>
      <div ref="content" class="onboarding__rightbar q-pa-md q-py-lg q-py-lg-xl q-px-lg-lg relative-position"
           :class="{'onboarding__rightbar--not-rendered': firstInit}">
        <div class="col text-center" v-if="computedPreperingArray[currentStep - 1]">
          <div class="text-h1" v-html="computedPreperingArray[currentStep - 1].title">
          </div>
          <div class="text-h4 text-weight-regular q-mt-sm">
            {{ computedPreperingArray[currentStep - 1].description }}
          </div>
        </div>
        <skills-priority key="skills-priority"
                         v-model="skillsPriorityArray"
                         @next="skillsPriorityNext"
                         @draggedEvent="draggedEvent"
                         v-show="isCurrentStep(1)"/>
        <techniques-select v-model="userTechniquesArray"
                           :skillsPriority="skillsPriorityArray"
                           v-if="isCurrentStep(2)"
                           @next="techniquesNextStep"/>
        <koovak-usage v-if="isCurrentStep(3)"
                      @next="toolsNextStep"/>
        <availability key="availability"
                      v-model="availabilityOptions"
                      @next="availabilityNext"
                      v-show="isCurrentStep(4)"/>
        <training-schedule key="training-schedule"
                           :eventsData="computedEvents"
                           @next="trainingScheduleNext"
                           v-if="isCurrentStep(5)"/>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import { sendSegmentEvent } from '@/services/segment'
import generateTrainingForDay from '@/mixins/generateTrainingForDay.mixing'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

export default {
  props: {
    emailAddress: {
      type: String,
      default: () => 'regular'
    },
    userName: {
      type: String,
      default: () => 'regular'
    }
  },
  mixins: [
    generateTrainingForDay
  ],
  components: {
    'left-bar': () => import('./includes/_leftbar'),
    'skills-priority': () => import('./includes/_skills-priority'),
    availability: () => import('./includes/_availability'),
    'training-schedule': () => import('./includes/_training-schedule'),
    'koovak-usage': () => import('./includes/_koovak'),
    'techniques-select': () => import('./includes/_techniques-select')
  },
  data () {
    return {
      currentStep: 1,
      showBar: true,
      full: false,
      firstInit: true,
      leftBarWidth: 400,
      isUserChangedAvailabilty: false,
      clonedAvailabilityOptions: []
    }
  },
  methods: {
    ...mapActions({
      saveUserSkillPriority: 'user/saveUserSkillPriority',
      saveUserAvailabilty: 'user/saveUserAvailabilty',
      saveUserTrainingSchedule: 'user/saveUserTrainingSchedule',
      saveUserTechniques: 'user/saveUserTechniques',
      saveUserTools: 'user/saveUserTools',
      finishUserPreferences: 'user/finishUserPreferences',
      getLastUserPreferences: 'user/getLastUserPreferences'
    }),
    ...mapMutations({
      setSkillsPriorityArray: 'user/setSkillsPriorityArray',
      setTechniquesArray: 'user/setTechniquesArray',
      setHoursPlayADay: 'user/setHoursPlayADay',
      setDaysAvailableArray: 'user/setDaysAvailableArray',
      setTimeInADayArray: 'user/setTimeInADayArray',
      setScheduleTrainingPlan: 'user/setScheduleTrainingPlan',
      setToolsArray: 'user/setToolsArray'
    }),
    draggedEvent () {
      this.trackAction('Skills Priority2: item dragged')
    },
    async nextTrainingSchedule (trainingSchedule) {
      return this.saveUserTrainingSchedule({ userId: this.user.id, userTrainingSchedule: trainingSchedule })
    },
    isCurrentStep (val) {
      return this.currentStep === val
    },
    goNext () {
      if (this.$q.screen.lt.sm) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }, 100)
      }

      const finish = this.currentStep === 5

      if (finish) {
        this.finishUserPreferences({ userId: this.user.id }).then(() => {
          this.$emit('finish')
        })
      }

      this.currentStep++
    },
    trackAction (event, opts = {}) {
      sendSegmentEvent(event, opts)
    },

    async toolsNextStep (e) {
      await this.saveUserTools({ userId: this.user.id, userTools: { kovaak: e } })
      this.trackAction('Tools2: Click Next')
      this.goNext()
    },
    async techniquesNextStep () {
      await this.saveUserTechniques({ userId: this.user.id, userTechniques: this.userTechniquesArray })
      this.trackAction('Techniques2: Click Next')
      this.goNext()
    },
    async skillsPriorityNext () {
      await this.saveUserSkillPriority({ userId: this.user.id, userSkillPriority: this.skillsPriorityArray })
      const returnedObject = {}
      this.skillsPriorityArray.map((item, index) => {
        let positionName = 'error'
        switch (index) {
          case 0:
            positionName = 'first'
            break
          case 1:
            positionName = 'second'
            break
          case 2:
            positionName = 'third'
            break
          case 3:
            positionName = 'forth'
            break
          default:
            positionName = 'error'
            break
        }
        returnedObject[positionName] = item.name
      })
      this.trackAction('Skills Priority2: Click Next', returnedObject)
      this.goNext()
    },
    async availabilityNext () {
      if (!(this.getHoursPlayADay.toString() === this.clonedAvailabilityOptions.playTime) ||
       !isEqual(this.getDaysAvailableArray, this.clonedAvailabilityOptions.dayPlay) ||
       !isEqual(this.getTimeInADayArray, this.clonedAvailabilityOptions.dayTime)) {
        this.isUserChangedAvailabilty = true
      }
      await this.saveUserAvailabilty({ userId: this.user.id, userAvailabilty: this.availabilityOptions })
      this.trackAction('Availability2: Click Next', this.availabilityOptions)
      this.goNext()
    },
    async trainingScheduleNext (trainingSchedule) {
      await this.nextTrainingSchedule(trainingSchedule)
      this.trackAction('Training Slots2: Click Next', trainingSchedule)
      this.goNext()
    }
  },
  computed: {
    ...mapGetters({
      getHoursPlayADay: 'user/hoursPlayADay',
      getSkillsPriorityArray: 'user/skillsPriorityArray',
      getDaysAvailableArray: 'user/daysAvailableArray',
      getTimeInADayArray: 'user/timeInADayArray',
      getToolsArray: 'user/toolsArray',
      getTechniquesArray: 'user/techniquesArray',
      getHoursSleepingADay: 'user/hoursSleepingADay',
      getPreferenceScheduleTrainingPlan: 'user/preferenceScheduleTrainingPlan',
      currentUserScore: 'user/currentUserScore'
    }),

    ...mapState({
      user: state => state.user.currentUser
    }),

    computedEvents () {
      if (this.isUserChangedAvailabilty) {
        const eventsData = this.getDaysAvailableArray.reduce((acc, day) => {
          const trainingsArray = this.getTrainingForDay(parseInt(day), this.getHoursPlayADay, this.getTimeInADayArray)
          return acc.concat(trainingsArray)
        }, [])
        return eventsData
      }
      return this.preferenceScheduleTrainingPlan
    },
    isCurrentExplainerSkillScore () {
      return this.computedPreperingArray[this.currentStep - 1]?.explainer?.subtitle === 'Skill Score'
    },
    computedPreperingArray () {
      const onboardingStepsLeftPanelArray = [
        {
          step: 1,
          label: 'Skills priority set',
          title: 'Which skill <span class="text-pink">holds</span> you <span class="text-pink">back</span>?',
          description: 'Move the skills from the most challenging for you to the least'
        },
        {
          step: 2,
          label: 'Techniques selection',
          title: 'select which <span class="text-pink">techniques</span> you<br> would like to improve',
          description: 'We will suggest training activities based on your needs'
        },
        {
          step: 3,
          label: "KovaaK's 2.0",
          title: '',
          description: ''
        },
        {
          step: 4,
          label: 'Your availability',
          title: 'Tell us about your <span class="text-pink">availability</span>',
          description: 'Help us create a perfect schedule that fits your time'
        },
        {
          step: 5,
          label: 'Fortnite time slots',
          title: 'Suggested <span class="text-pink">time slots</span>',
          description: this.$q.screen.gt.sm ? 'Edit the blocks to make adjustments to your Fortnite time' : 'This is our suggested schedule to optimize your training. You can always change it later.'
        }
      ]
      return onboardingStepsLeftPanelArray
    },

    skillsPriorityArray: {
      get: function () {
        return this.getSkillsPriorityArray
      },
      set: function (newValue) {
        this.setSkillsPriorityArray(newValue)
      }
    },
    userTechniquesArray: {
      get: function () {
        return this.getTechniquesArray
      },
      set: function (newValue) {
        this.setTechniquesArray(newValue)
      }
    },
    toolsArray: {
      get: function () {
        return this.getToolsArray
      },
      set: function (newValue) {
        this.setToolsArray(newValue)
      }
    },
    preferenceScheduleTrainingPlan: {
      get: function () {
        return this.getPreferenceScheduleTrainingPlan ? Object.keys(this.getPreferenceScheduleTrainingPlan).map((key) => this.getPreferenceScheduleTrainingPlan[key]) : []
      },
      set: function (newValue) {
        this.setScheduleTrainingPlan(newValue)
      }
    },
    availabilityOptions: {
      get: function () {
        return {
          sleepTime: this.getHoursSleepingADay,
          playTime: this.getHoursPlayADay?.toString(),
          dayPlay: this.getDaysAvailableArray,
          dayTime: this.getTimeInADayArray
        }
      },
      set: function (newValue) {
        this.setHoursPlayADay(newValue.playTime)
        this.setDaysAvailableArray(newValue.dayPlay)
        this.setTimeInADayArray(newValue.dayTime)
      }
    }
  },
  beforeDestroy () {
    this.currentStep = 1
  },
  mounted () {
    setTimeout(() => {
      this.firstInit = false
    }, 200)
    this.getLastUserPreferences({ userId: this.user?.id }).then(() => {
      this.clonedAvailabilityOptions = cloneDeep({
        sleepTime: this.getHoursSleepingADay,
        playTime: this.getHoursPlayADay?.toString(),
        dayPlay: this.getDaysAvailableArray,
        dayTime: this.getTimeInADayArray
      })
    })
  },
  watch: {
    isCurrentExplainerSkillScore: {
      handler: function (isSkillScore) {
        if (isSkillScore) {
          this.trackAction('Skill Score: See Explainer')
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.mobile-step{
  width: 32px;
  height: 32px;
  border: 2px solid $dark-pink;
  color: $dark-pink;
  border-radius: 100%;
}
.onboarding {
  &__rightbar {
    height: var(--app-height);
    overflow-y: auto;
    width: 100%;
    background: $dark;
    transition: all .8s ease-in-out;
    position: relative;

    &--not-rendered {
      transform: translateX(100%);
    }
    @media all and (max-width: $breakpoint-sm-max) {
      min-height: calc(var(--app-height) - 130px);
      height: auto;
      .text-h1{
        font-size: 36px;
      }
      .text-h4{
        font-size: 16px;
      }
    }
  }
}
</style>
