<template>
  <div class="training-preferences">
    <div style="float: right;display: flex;align-items: center;">
      <c-btn
        outline
        :disabled="isExtraDayActive()"
        @click="openUserPreferencesModal"
      >
        edit preferences
      </c-btn>
      <c-icon icon="question" class="q-ml-sm" v-if="isExtraDayActive()">
        <q-tooltip anchor="top middle"
                    self="bottom middle"
                    max-width="240px"
                    content-style="background-color: #382B4B; font-size: 14px"
                    :offset="[10, 10]"
                    @show="$emit('tooltip-hover')">
          Your current training plan dates are in the past. Generate a new one to change preferences
        </q-tooltip>
      </c-icon>
    </div>
    <n-modal :visible="shouldShowEditPreferencesModal"
             v-if="shouldShowEditPreferencesModal"
             size="lg"
             show-close
             @close="hideModal('closeModal')">
      <div class="training-preferences__modal text-left q-pa-lg">
        <div class="text-h2">
          edit training preferences
        </div>
        <div class="text-gray q-mt-sm q-mb-lg text-weight-regular opacity-5" style="font-size: 16px">
          Here you can see your current training preferences.<br/>
          Your training plan will be updated with any changes you make.
        </div>
        <div class="training-preferences__scroll-area" ref="scrollArea">
          <div >
            <div class="text-h4 font-roboto" style="text-transform: none">
              Which Skills do you want <span class="text-pink">improve</span> the most?
            </div>
            <div class="text-gray text-weight-regular q-mt-sm" style="font-size: 16px">
              <span class="text-pink">Drag and drop</span> the cards to order the most important skills for you.
            </div>
            <skills-priority v-model="skillsPriorityArray"
                             :showAction="false"
                             :small="true"
                             style="width: 100%"/>
            <div class="divider"></div>
          </div>
          <div >
            <div class="text-h4 font-roboto" style="text-transform: none">
              Select which <span class="text-pink">techniques</span> you would like to improove
            </div>
            <div class="text-gray text-weight-regular q-mt-sm" style="font-size: 16px">
              We will select training routines based on your choices
            </div>
            <techniques-select v-model="userTechniquesArray"
                               minimized
                               :showAction="false"
                               :skillsPriority="skillsPriorityArray"/>
            <div class="opacity-5">
              You can choose techniques only from your top 2 skills chosen
            </div>
            <div class="divider"></div>
          </div>
          <div>
            <div class="text-h4">
              When would you like to train?
            </div>
            <div class="q-mt-sm flex" style="justify-content: center;">
              <c-btn flat
                     dense
                     textColor="dark-pink"
                     @click="toggleTimeSchedule">
                {{ timeSchedule ? 'Hide time-schedule' : 'Show time-schedule' }}
              </c-btn>
            </div>
            <div class="block time-schedule-block"
                 :class="{'time-schedule-block--active': timeSchedule}"
                 ref="timeScheduleBlock">
              <training-schedule
                ref='trainingSchedule'
                hide-next
                style="height: 100%; margin-top: 0"
                key="training-schedule"
                :eventsData="preferenceScheduleTrainingPlan"
                @next="newComputedEvents"
              />
            </div>
            <div class="divider"></div>
          </div>
          <div >
            <div class="kovaak q-mt-xl">
              <div class="text-h4">
                Should we include KovaaK's 2.0 activities?
              </div>
              <div style="font-size: 16px">
                KovaaK's 2.0 is a training program developed by kovaak team.
              </div>
              <div class="q-mt-sm q-mb-lg" style="margin-left: -20px">
                <q-toggle
                  size="xl"
                  v-model="kovaak"
                  checked-icon="check"
                  color="green"
                  label="Include KovaaK's activities"
                  unchecked-icon="clear"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="text-right row justify-end">
          <c-btn outline @click="showCancelModal">
            cancel
          </c-btn>
          <c-btn class="q-ml-md" @click="showConfirmModal">
            save changes
          </c-btn>
        </div>
      </div>
    </n-modal>

    <n-modal :visible="shouldShowConfirmCancelCongratsModal">
<!--      confirm-->
      <div class="training-preferences__modal-next q-pa-lg text-center"
           v-if="showModal === 'confirm'">
        <div class="text-h3 text-pink">
          Confirm changes!
        </div>
        <div class="q-mt-md q-mb-lg text-gray">
          Your training board will be updated with your<br />
          new preferences and some or all your<br/>
          current activities will be replaced.
        </div>
        <div class="row justify-center">
          <c-btn outline @click="showModalByType('main'); trackAction('TP: Confirm changes: cancel')">
            cancel
          </c-btn>
          <c-btn class="q-ml-md" @click="onSave">
            save changes
          </c-btn>
        </div>
      </div>
<!--      Cancel-->
      <div class="training-preferences__modal-next q-pa-lg text-center"
           v-if="showModal === 'cancel'">
        <div class="text-h3 text-pink">
          Attention!
        </div>
        <div class="q-mt-md q-mb-lg text-gray">
          Changes will not be saved.
        </div>
        <div class="row justify-center">
          <c-btn outline @click="showModalByType('main'); trackAction('TP: Cancel changes: cancel')">
            cancel
          </c-btn>
          <c-btn class="q-ml-md" @click="hideModal('confirm cancel changes')">
            confirm
          </c-btn>
        </div>
      </div>
<!--      congrats-->
      <div class="training-preferences__modal-next q-pa-lg text-center"
           v-if="showModal === 'congrats'">
        <div class="text-center congrats-all-header">
          <c-icon icon="done" width="160px" />
          <div class="text-dark-pink font-rift text-h5 text-weight-bold text-uppercase" style="margin-top: -40px">
            new training generated!
          </div>
        </div>
        <div class="text-h3 q-mt-lg q-mb-xl font-roboto" style="text-transform: unset">
          Your training plan is updated with your new preferences!
        </div>

        <div class="d-flex items-center justify-between q-mt-xl">
          <c-btn class="full-width" @click="hideModal('lets go')">
            let's go
          </c-btn>
        </div>
      </div>
    </n-modal>

    <page-loader v-if="showPageLoader" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import paymentMixin from '@/mixins/payment.mixin'
import { sendSegmentEvent } from '@/services/segment'
import generateTrainingForDay from '@/mixins/generateTrainingForDay.mixing'

export default {
  components: {
    'page-loader': () => import('@/components/common/page-loader'),
    'skills-priority': () => import('@/components/onboarding/includes/_skills-priority'),
    'techniques-select': () => import('@/components/onboarding/includes/_techniques-select'),
    'n-modal': () => import('@/components/dashboard/modal'),
    'training-schedule': () => import('@/components/onboarding/includes/_training-schedule')
  },
  mixins: [
    paymentMixin,
    generateTrainingForDay
  ],
  data () {
    return {
      showPageLoader: false,
      settingsWasChanged: false,
      timeSchedule: false,
      timeScheduleOutData: null
    }
  },
  methods: {
    ...mapActions({
      finishUserPreferences: 'user/finishUserPreferences',
      getLastUserPreferences: 'user/getLastUserPreferences',
      editUserPreferencesFlow: 'user/editUserPreferencesFlow'
    }),
    ...mapMutations({
      setSkillsPriorityArray: 'user/setSkillsPriorityArray',
      setTechniquesArray: 'user/setTechniquesArray',
      setToolsArray: 'user/setToolsArray',
      setShowPreferencesdModalString: 'common/setShowPreferencesdModalString'
    }),
    trackAction (event, opts = {}) {
      sendSegmentEvent(event, opts)
    },
    hideModal (source) {
      this.trackAction('TP: user preferences modal closed', { source })
      this.showModal = null
      this.settingsWasChanged = false
      this.timeSchedule = false
    },
    showModalByType (type) {
      this.showModal = type
    },
    async onSave () {
      this.showModal = null
      this.$emit('saving', true)
      this.trackAction('TP: save new user preferences', { updatedUserPreferences: { preferences: JSON.stringify(this.skillsPriorityArray), techniques: JSON.stringify(this.userTechniquesArray), tools: JSON.stringify({ kovaak: this.kovaak }) } })
      await this.editUserPreferencesFlow({
        userId: this.user.id,
        updatedUserPreferences: {
          preferences: JSON.stringify(this.skillsPriorityArray),
          techniques: JSON.stringify(this.userTechniquesArray),
          tools: JSON.stringify({ kovaak: this.kovaak }),
          userAvailabilty: this.availabilityOptions,
          weekCalendarPreferences: JSON.stringify(this.timeScheduleOutData)
        }
      })
        .catch(() => {
          this.$emit('saving', false)
        })
      setTimeout(() => {
        this.$emit('saving', false)
        this.showModal = 'congrats'
        this.trackAction('TP: congrats user prefernces modal aftersaving')
      }, 1000)
    },
    openUserPreferencesModal () {
      if (this.isExtraDayActive() || !this.checkPremiumActionRestriction('userPreferencesEdit')) {
      } else {
        this.showModalByType('main')
        this.trackAction('TP: open user prefernces modal')
      }
    },
    showCancelModal () {
      if (this.settingsWasChanged) {
        this.trackAction('TP: open user prefernces modal: show cancel modal')
        this.showModalByType('cancel')
      } else {
        this.hideModal('cancel button')
      }
    },
    showConfirmModal () {
      this.$refs.trainingSchedule.clickNext()
      this.trackAction('TP: open user prefernces modal: show confirm modal')
      this.showModalByType('confirm')
    },
    newComputedEvents (event) {
      this.timeScheduleOutData = event
    },
    toggleTimeSchedule () {
      this.trackAction('TP: open user prefernces modal: show/hide TimeSchedule')
      this.timeSchedule = !this.timeSchedule
      setTimeout(() => {
        const el = this.timeSchedule ? this.$refs.timeScheduleBlock : this.$refs.scrollArea
        el.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }, 300)
    }
  },
  computed: {
    showModal: {
      get: function () {
        return this.getPreferencesModalString
      },
      set: function (newValue) {
        this.setShowPreferencesdModalString(newValue)
      }
    },
    ...mapGetters({
      getSkillsPriorityArray: 'user/skillsPriorityArray',
      getTechniquesArray: 'user/techniquesArray',
      getToolsArray: 'user/toolsArray',
      getPreferencesModalString: 'common/getPreferencesModalString'
    }),

    ...mapState('user', {
      user: 'currentUser'
    }),

    ...mapGetters({
      getHoursSleepingADay: 'user/hoursSleepingADay',
      getHoursPlayADay: 'user/hoursPlayADay',
      getDaysAvailableArray: 'user/daysAvailableArray',
      getTimeInADayArray: 'user/timeInADayArray',
      getPreferenceScheduleTrainingPlan: 'user/preferenceScheduleTrainingPlan'
    }),
    preferenceScheduleTrainingPlan: {
      get: function () {
        return this.getPreferenceScheduleTrainingPlan ? Object.keys(this.getPreferenceScheduleTrainingPlan).map((key) => this.getPreferenceScheduleTrainingPlan[key]) : []
      },
      set: function (newValue) {
        this.setScheduleTrainingPlan(newValue)
      }
    },
    skillsPriorityArray: {
      get: function () {
        return this.getSkillsPriorityArray
      },
      set: function (newValue) {
        this.setSkillsPriorityArray(newValue)
      }
    },
    kovaak: {
      get: function () {
        return this.getToolsArray.kovaak
      },
      set: function (newValue) {
        this.setToolsArray({ kovaak: newValue })
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
    shouldShowEditPreferencesModal () {
      return (this.showModal === 'confirm' || this.showModal === 'cancel' || this.showModal === 'main')
    },
    shouldShowConfirmCancelCongratsModal () {
      return (this.showModal === 'confirm' || this.showModal === 'cancel' || this.showModal === 'congrats')
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
  mounted () {
    this.getLastUserPreferences({ userId: this.user?.id })
  },
  watch: {
    skillsPriorityArray () {
      if (this.shouldShowEditPreferencesModal) {
        this.settingsWasChanged = true
      }
    },
    userTechniquesArray () {
      if (this.shouldShowEditPreferencesModal) {
        this.settingsWasChanged = true
      }
    },
    kovaak () {
      if (this.shouldShowEditPreferencesModal) {
        this.settingsWasChanged = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.training-preferences{
  &__btn{
    float: right;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  &__scroll-area{
    height: calc(100% - 200px);
    padding: 0 15px 0 20px;
    margin: 0 -15px 25px -20px;
    overflow-y: auto;
  }
  &__modal{
    height: 90vh;
    .divider{
      margin: 40px 0;
      height: 2px;
      width: 100%;
      display: flex;
      background: $soft-tone;
    }

    .time-schedule-block{
      overflow: hidden;
      max-height: 0;
      height: 0;
      transition: all .3s ease-in-out;
      &--active{
        max-height: 400px;
        height: 400px;
      }
    }
  }

}
</style>
