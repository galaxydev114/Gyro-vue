<template>
  <q-layout view="hHh lpR fFf">

    <q-drawer
      v-if="$q.screen.gt.sm"
      :value="$q.screen.gt.sm"
      :width="leftBarWidth"
      :content-style="{'background': 'none', 'position': 'relative'}">
      <left-bar
        :preparingList="computedPreperingArray"
        :currentStep="currentStep"
        :emailAddress="emailAddress"
        :userName="userName"
        @not-me="$emit('start-over'); trackAction('Click Start Over', { page: currentStep })"/>
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
        <div class="col text-center" v-if="computedPreperingArray[currentStep - 1]" :key="currentStep">
          <div class="text-h1" v-html="computedPreperingArray[currentStep - 1].title" ref="title">
          </div>
          <div class="text-h4 text-weight-regular q-mt-sm" ref="description"
            v-html="computedPreperingArray[currentStep - 1].description">
          </div>
        </div>
        <!--        Step 1-->
        <template v-if="isScoreStep()">
          <score-graph key="score-graph"
                       @next="goNext();
                              trackAction('Skill Score: Click Next')"/>
        </template>
        <!--        Step 2 test -->
        <goal-setup key="goal"
                    v-if="isCurrentStep('goal')"
                    @toggle="replaceTitle"
                    @next="goalSetupNextStep"/>
        <!--        Step 2-->
        <skills-priority key="skills-priority" v-model="skillsPriority"
                         @next="skillsPriorityNextStep"
                         @draggedEvent="draggedEvent"
                         v-show="isCurrentStep('priority')"/>
        <!--        Step 3-->
        <techniques-select v-model="userTechniquesArray"
                           :skillsPriority="skillsPriority"
                           @next="techniquesNextStep"
                           v-if="isCurrentStep('techniques')"/>
        <!--        Step 4-->
        <koovak-usage v-if="isCurrentStep('kovaak')" @next="toolsNextStep"/>
        <!--        Step 5-->
        <availability key="availability" v-model="availabilityOptions"
                      @next="availabilityNextStep"
                      v-show="isCurrentStep('availability')"/>
        <!--        Step 6-->
        <training-schedule key="training-schedule"
                           :eventsData="computedEvents"
                           @next="trainingScheduleNextStep"
                           v-if="isCurrentStep('timeSlots')"/>
        <!--        Explainer modals-->
        <explainers :step="computedPreperingArray[currentStep - 1]"
                    v-if="computedPreperingArray[currentStep - 1] && computedPreperingArray[currentStep - 1].explainer"
                    @hide="() => {
                    if (isCurrentExplainerSkillScore) {
                      startScoreAnimation = true
                      trackAction('Skill Score: Click Got It on Explainer')
                      trackAction('See Skill Score', { score: currentUserScore })
                    }
                  }"/>

        <ready-modal :visible="showReadyModal"
                     @close="trackAction('Manage expectations: are you ready modal: Click not ready'); showReadyModal = false"
                     @next="goToTrainingPlan" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import generateTrainingForDay from '@/mixins/generateTrainingForDay.mixing'

export default {
  props: {
    emailAddress: {
      type: String,
      default: () => 'regular'
    },
    userName: {
      type: String,
      default: () => 'regular'
    },
    skipScore: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    generateTrainingForDay
  ],
  components: {
    explainers: () => import('./includes/_explainers'),
    'koovak-usage': () => import('./includes/_koovak'),
    'left-bar': () => import('./includes/_leftbar'),
    'score-graph': () => import('./includes/_score'),
    'skills-priority': () => import('./includes/_skills-priority'),
    availability: () => import('./includes/_availability'),
    'training-schedule': () => import('./includes/_training-schedule'),
    'techniques-select': () => import('./includes/_techniques-select'),
    'goal-setup': () => import('./includes/_goal-setup'),
    'ready-modal': () => import('./includes/_ready-modal')
  },
  data () {
    return {
      currentStep: 1,
      availabilityOptions: {},
      skillsPriority: [],
      userTechniquesArray: [],
      firstInit: true,
      leftBarWidth: 360,
      showReadyModal: false,
      startScoreAnimation: false
    }
  },
  methods: {
    ...mapActions({
      saveUserSkillPriority: 'user/saveUserSkillPriority',
      saveUserAvailabilty: 'user/saveUserAvailabilty',
      saveUserTrainingSchedule: 'user/saveUserTrainingSchedule',
      saveUserTools: 'user/saveUserTools',
      saveUserTechniques: 'user/saveUserTechniques',
      saveUserGoals: 'user/saveUserGoals',
      finishUserPreferences: 'user/finishUserPreferences',
      reloadUser: 'user/loadUser',
      getUserScore: 'user/getUserScore'
    }),
    draggedEvent () {
      this.trackAction('Skills Priority: item dragged')
    },
    async nextTrainingSchedule (trainingSchedule) {
      return this.saveUserTrainingSchedule({ userId: this.user.id, userTrainingSchedule: trainingSchedule })
    },
    isScoreStep () {
      if (this.isCurrentStep('skillScore') && this.skipScore) {
        this.goNext()
      } else {
        return this.isCurrentStep('skillScore')
      }
    },
    isCurrentStep (key) {
      return this.stepsComponentKey[this.currentStep - 1] === key
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

      const finish = this.currentStep ===
        this.computedPreperingArray[this.computedPreperingArray.length - 1].step

      if (finish) {
        return this.finishUserPreferences({ userId: this.user.id }).then(() => {
          this.$emit('finish')
        })
      }
      this.currentStep++
    },

    async toolsNextStep (e) {
      await this.saveUserTools({ userId: this.user.id, userTools: { kovaak: e } })
      this.trackAction('Tools: Click Next')
      this.goNext()
    },
    async techniquesNextStep () {
      await this.saveUserTechniques({ userId: this.user.id, userTechniques: this.userTechniquesArray })
      this.trackAction('Techniques: Click Next')
      this.goNext()
    },
    async goalSetupNextStep (goals) {
      await this.saveUserGoals({ userId: this.user.id, goals })
      this.goNext()
    },
    async skillsPriorityNextStep () {
      await this.saveUserSkillPriority({ userId: this.user.id, userSkillPriority: this.skillsPriority })
      const returnedObject = {}
      this.skillsPriority.map((item, index) => {
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
      this.trackAction('Skills Priority: Click Next', returnedObject)
      this.goNext()
    },
    async trainingScheduleNextStep (trainingSchedule) {
      await this.nextTrainingSchedule(trainingSchedule)
      this.trackAction('Training Slots: Click Next', trainingSchedule)
      this.showReadyModal = true
    },
    goToTrainingPlan () {
      this.trackAction('Manage expectations: are you ready modal: Click I\'m ready')
      this.goNext()
    },
    async availabilityNextStep () {
      await this.saveUserAvailabilty({ userId: this.user.id, userAvailabilty: this.availabilityOptions })
      this.trackAction('Availability: Click Next', this.availabilityOptions)
      this.goNext()
    },
    async onboardingOverviewNext () {
      this.trackAction('Track overview: Click next')
      this.goNext()
    },
    replaceTitle (val) {
      if (val) {
        this.$refs.title.innerHTML = val.title || this.$refs.title.innerHTML
        this.$refs.description.innerHTML = val.description || this.$refs.description.innerHTML
      }
    }
  },
  computed: {
    ...mapGetters({
      hoursPlayADay: 'user/hoursPlayADay',
      daysAvailableArray: 'user/daysAvailableArray',
      timeInADayArray: 'user/timeInADayArray',
      currentUserScore: 'user/currentUserScore'
    }),

    ...mapState({
      user: state => state.user.currentUser
    }),

    descriptionBasedOnUserScore () {
      if (this.currentUserScore > 800) {
        return 'Well done! You are the 1% percent!'
      } else if (this.currentUserScore > 700) {
        return 'You know what you are doing, but there is another level you can reach'
      } else if (this.currentUserScore > 400) {
        return 'Decent starting point. We’ve got a lot of work ahead of us!'
      } else {
        return 'Plenty of room for growth, we believe in you!'
      }
    },

    computedEvents () {
      const eventsData = this.daysAvailableArray.reduce((acc, day) => {
        const trainingsArray = this.getTrainingForDay(parseInt(day), this.hoursPlayADay, this.timeInADayArray)
        return acc.concat(trainingsArray)
      }, [])
      return eventsData
    },
    isCurrentExplainerSkillScore () {
      return this.computedPreperingArray[this.currentStep - 1]?.explainer?.subtitle === 'Skill Score'
    },
    computedPreperingArray () {
      const arr = this.onboardingStepsLeftPanelArray
      const goalStep = {
        step: 2,
        disabled: false,
        label: 'Goal selection',
        title: 'where do you want to be <span class="text-pink">next season</span>',
        description: 'Place yourself where you want to be'
      }
      return [
        arr[0],
        goalStep,
        ...arr.slice(1).map(el => {
          el.step++
          return el
        })]
    },
    onboardingStepsLeftPanelArray () {
      return [
        {
          step: 1,
          disabled: this.skipScore,
          label: 'Your skill score',
          title: 'Estimated <span class="text-pink">Skill</span> score',
          description: this.descriptionBasedOnUserScore,
          explainer: {
            subtitle: 'Skill Score',
            text: 'This is your <span class="text-pink">estimated</span> skill score.</br> We will use it to fit you with the right training activities.'
          }
        },
        {
          step: 2,
          label: 'Skills priority set',
          title: 'What is holding you back the most?',
          description: '<span class="text-pink">Drag and drop</span> the cards to order the most important skills for you'
        },
        {
          step: 3,
          label: 'Techniques selection',
          title: 'Let\'s be more specific',
          description: 'We will select training routines based on your choices'
        },
        {
          step: 4,
          label: "KovaaK's 2.0",
          title: '',
          description: ''
        },
        {
          step: 5,
          label: 'Your availability',
          title: 'Choose when you are available to <span class="text-pink">train</span>',
          description: 'Choose at least 3 days a week, but make sure you\'re being realistic!'
        },
        {
          step: 6,
          label: 'Fortnite time slots',
          title: 'Recommended Training Schedule',
          description: 'This is the schedule we recommend. You can change it to make sure it’s realistic'
        }
      ]
    },
    stepsComponentKey () {
      // arr order should be the same as steps
      const steps = [
        'skillScore',
        'goal',
        'priority',
        'techniques',
        'kovaak',
        'availability',
        'timeSlots'
      ]

      return steps
    }
  },
  beforeDestroy () {
    this.currentStep = 1
  },
  mounted () {
    setTimeout(() => {
      this.firstInit = false
      if (!this.currentUserScore) {
        this.reloadUser().then(() => {
          this.getUserScore({ userId: this.user?.id, forceCalc: true })
        })
      }
    }, 200)
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
