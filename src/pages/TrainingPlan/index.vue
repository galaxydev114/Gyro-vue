<template>
  <article class="full-height">
    <div class="fit dashboard-content">
      <c-season-7-ntf v-if="showSeason7Ntf" @update="updateSeason7Ntf" @hide="hideSeason7Ntf"/>
      <div class="row gt-sm q-mb-sm q-pl-md">
        <div class="col-6 row">
          <div class="q-mr-md text-h2 text-weight-bold">
            Weekly Training PLAN
          </div>
        </div>
        <div class="col-6 text-right flex items-center justify-end">
          <div class="btn-group q-ml-auto q-mr-lg" v-if="$q.screen.width > 1064">
            <c-btn
              class="btn-group__item"
              :flat="!dayView"
              noWidth
              size="sm"
              @click="updateDayView(true)"
            >
              List
            </c-btn>
            <c-btn
              class="btn-group__item"
              :flat="dayView"
              noWidth
              size="sm"
              @click="updateDayView(false)"
            >
              Board
            </c-btn>
          </div>
          <n-training-preferences @saving="preferenceSaving"/>
        </div>
      </div>

      <n-training-plan-tags :nextTournament="nextTournament" :list="tagList"/>

      <c-weekly-plan
        :isBuildingLoader="isBuildingLoader"
        :startDate="startDate ? startDate : 'null'"
        :week="week"
        :dayView="dayView"
        :ready="isPageReady"
        @selected-routine="selectRoutine"
        @add-new-routine="addNewRoutine"
        @add-time-section="tryAddTimeSection"
        @change-time-section="tryChangeTimeSection"
        @move="moveActivityWithinSection"
        @loaded="weeklyLoaded"
        @add="markActivityToAdd"
        @remove="markActivityToRemove"
        @commit-move="moveActivityAcrossSections"
      />

      <c-confirm-merge-modal
        :visible="!!showConfirmMergeTimeSections"
        @confirm="confirmMerge"
        @cancel="cancelMerge"
      />
      <c-congrats-all :visible="showCongratsAllModal"
                      @close="showCongratsAllModal = false"/>

      <c-modal-phase
        v-if="phaseModal"
        :visible="!!phaseModal"
        :title="phaseModal.title"
        :description="phaseModal.description"
        :video-url="phaseModal.videoUrl"
        @close="closePhaseModal"
        @play-video="trackClickOnPhaseModalVideo"
        @finish-watch-video="trackAction('Tournaments: Tournament video modal: watched entire video')"
      >
        <div class="row justify-around q-mt-md q-col-gutter-md">
        <c-btn class="col-xs-12 col-sm-6" style="max-width: 60%;"
          outline
          :bold="false"
          @click="trackAction('Tournaments: Tournament video modal: click add more tournaments'); $router.push({ name: 'Tournaments' })"
        >
          Add more tournaments
        </c-btn>
        <c-btn class="col-xs-12 col-sm-6" style="max-width: 60%;"
          :bold="false"
          @click="trackAction('Tournaments: Tournament video modal: click start training'); closePhaseModal()"
        >
          Start training
        </c-btn>
        </div>
      </c-modal-phase>
      <modal-tournaments-preparations-removed
        :tournaments="rescheduledTournaments" :visible="showTournamentRemovedModal"
        @close="trackAction('Tournaments: Rescheduled modal: close'); confirmRemoveTournaments(false)"
        @confirm="trackAction('Tournaments: Rescheduled modal: click add new'); confirmRemoveTournaments(true)"
      />
    </div>
  </article>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import minBy from 'lodash/minBy'
import dayjs from 'dayjs'
import * as api from '@/services/api'
import paymentMixin from '@/mixins/payment.mixin'
import { segmentIdentify } from '@/services/segment'
import { getActivityTypeFromCategory } from '@/util/routineHelpers'

export default {
  components: {
    'c-congrats-all': () => import('@/components/dashboard/modal/modal-congrats-all'),
    'c-weekly-plan': () => import('@/components/weekly-training-plan'),
    'n-training-preferences': () => import('@/components/training-preferences'),
    'c-confirm-merge-modal': () => import('@/components/weekly-training-plan/modal-confirm-merge'),
    'c-modal-phase': () => import('@/components/dashboard/modal/modal-intro-video'),
    'n-training-plan-tags': () => import('@/components/training-plan-tags'),
    'c-season-7-ntf': () => import('@/components/notifications/season-7'),
    'modal-tournaments-preparations-removed': () => import('@/components/tournaments/modal/modal-tournaments-preparations-removed')
  },
  mixins: [paymentMixin],
  filters: {
    score: value => {
      if (!value) return '--'
      return value.toString()
    }
  },
  data () {
    return {
      isPageReady: false,
      drag: false,
      suppressOnLoadModals: false,
      showCongratsAllModal: false,
      phaseModal: null,
      showConfirmMergeTimeSections: '',
      activityToMove: null,
      activityToRemove: null,
      activityToAdd: null,
      sectionsToMove: null,
      isBuildingLoader: false,
      dayView: false,
      isHideSeason7Ntf: true,
      showTournamentRemovedModal: false
    }
  },
  async created () {
    this.isHideSeason7Ntf = localStorage.getItem('isHideSeason7Ntf')
    this.updateDayView(localStorage.getItem('dayViewStatus') ? localStorage.getItem('dayViewStatus') === 'true' : !this.experimentIsFirstBoardViewExperiment, true)

    if ('generate' in this.$route.query) {
      this.isBuildingLoader = true
      await this.generateUserTrainingPlan()
        .finally(() => {
          this.isBuildingLoader = false
        })
    }

    if (this.$route.query.onboarding) {
      try {
        this.isPageReady = true
        this.isBuildingLoader = true

        if (this.$route.query.onboarding === 'first') {
          await this.finishOnboarding(this.currentUser.id)
          this.trackLastLoggedIn()
        }

        await this.generateUserTrainingPlan()

        setTimeout(() => {
          this.isBuildingLoader = false
          if (this.$route.query.onboarding === 'repeat') {
            this.$emit('loadedAfterRepeatOnboarding')
          }
          this.$router.replace('/training-plan')
        }, 3000)
      } catch (err) {
        this.isBuildingLoader = false
        await this.$router.replace('/onboarding-repeat')
      }
    } else {
      try {
        await this.getUserCurrentTrainingPlan()
      } catch (err) {
        await this.generateUserTrainingPlan()
        await this.getUserCurrentTrainingPlan()
      }
      await this.getTournaments()
      await this.getUserTournaments({ userId: this.currentUser.id })
      this.isPageReady = true
      await this.getCurrentUserScore()
      this.trackLastLoggedIn()
    }
    this.$emit('loaded', 'TrainingPlan')
  },

  mounted () {
    if (!this.$route.query.onboarding) {
      setTimeout(() => {
        this.onLoadWeek()
      }, 200)
    }
    this.getUserActivitiesStats(this.user.id)

    const { tournamentEventId, tournamentEventWindowId } = this.$route.query
    if (tournamentEventId && tournamentEventWindowId) {
      const tournament = this.$store.state.tournaments.tournaments
        .find(t => t.eventId === tournamentEventId && t.eventWindowId === tournamentEventWindowId)

      this.phaseModal = {
        title: tournament ? tournament.title : '',
        description: 'Watch this video to learn more about tournament format and acquire valuable information',
        videoUrl: tournament ? tournament.introductionVideoUrl : ''
      }
    }
  },

  computed: {
    ...mapGetters('trainingPlan', {
      trainingPlanFocus: 'focus',
      trainingDay1: 'trainingDay1',
      trainingDay2: 'trainingDay2',
      trainingDay3: 'trainingDay3',
      trainingDay4: 'trainingDay4',
      trainingDay5: 'trainingDay5',
      trainingDay6: 'trainingDay6',
      trainingDay7: 'trainingDay7',
      timeSectionsByDay: 'timeSectionsByDay',
      dailyRoutinesCounter: 'dailyRoutinesCounter',
      trainingPlanOffsetDay: 'trainingPlanOffsetDay'
    }),
    ...mapGetters({
      allActivitiesCount: 'user/userActivitiesCount',
      getTechniquesArray: 'user/techniquesArray',
      getToolsArray: 'user/toolsArray',
      currentUser: 'user/currentUser',
      getTrainingRoutine: 'trainingRoutine/trainingRoutine',
      currentUserScore: 'user/currentUserScore',
      showFinishedAllDailyRoutineModal: 'trainingPlan/showFinishedAllDailyRoutineModal',
      showPaywall: 'payments/showPaywall',
      experimentIsFirstBoardViewExperiment: 'experiments/experimentIsFirstBoardViewExperiment'
    }),

    ...mapState({
      startDate: state => state.trainingPlan.startDate,
      trainingPlanUpdatedAt: state => state.trainingPlan.updatedAt,
      user: state => state.user.currentUser,
      userTournaments: state => state.tournaments.userTournaments,
      trainingPlansAmount: state => state.user.trainingPlansAmount
    }),

    shouldShowQuestanereModal () {
      return false
      // TODO: soon we'll add anopther questaniere for the same conditions
      // const res = this.$route.query.routineCompleted === 'true' &&
      //       this.trainingPlansAmount === 1 &&
      //       this.allActivitiesCount === 1
      // if (res) {
      //   this.trackAction('TP: show quastinaere')
      // }
      // return res
    },

    counter () {
      return this.dailyRoutinesCounter(this.trainingPlanOffsetDay)
    },

    week () {
      if (this.isBuildingLoader) return []
      const data = []
      // TODO: get this from server, stored in TP? We have Schedule object also
      const eventDayNumbersObject = this.tournaments.map(t => { return { eventDayNumber: t.dayNumber - 1, t } })
      const prepDayNumbers = eventDayNumbersObject.map(dObj => { return { eventDayNumber: dObj.eventDayNumber - 1, t: dObj.t } })
      for (let day = 0; day < 7; day++) {
        const dailyTournament = eventDayNumbersObject.filter(dayNumberObject => dayNumberObject.eventDayNumber === day)[0]
        const dailyPrep = prepDayNumbers.filter(dayNumberObject => dayNumberObject.eventDayNumber === day)[0]
        data.push({
          dayNumber: day + 1,
          dayLabel: dayjs(this.startDate).add(day, 'day').format('dddd'),
          dayDateString: dayjs(this.startDate).add(day, 'day'),
          timeSections: (this.timeSectionsByDay[day + 1] || []).map(timeSection => ({
            ...timeSection,
            items: timeSection.items.map((activity) => {
              return {
                ...activity,
                dateStart: this.$date(activity.startHour, 'HH:mm').day(day + 1),
                totalTime: this.getTrainingRoutine(activity.id)?.sessions
                  ?.reduce((duration, session) => duration + session.duration, 0) || 0
              }
            })
          })),
          tournamentPrep: dailyTournament ? 'EVENT'
            : dailyPrep ? 'PREP'
              : undefined,
          tournamentPrepObject: dailyTournament ? dailyTournament.t
            : dailyPrep ? dailyPrep.t
              : undefined
        })
      }

      // Insert tournaments into the day
      for (const tournament of this.tournaments) {
        const dayIndex = tournament.dayNumber - 1
        if (!(dayIndex in data)) continue
        if (data[dayIndex].timeSections.length === 0) {
          data[dayIndex].timeSections[0] = {
            start: this.$date(tournament.startAt).format('HH:mm'),
            end: this.$date(tournament.endAt).format('HH.mm'),
            items: [{ type: 'tournament', ...tournament }]
          }
        } else {
          data[dayIndex].timeSections[0].items.push({ type: 'tournament', ...tournament })
        }
      }

      return data
    },

    allDone () {
      if (this.counter) {
        return this.counter.count === this.counter?.count - this.counter?.left
      }
      return false
    },
    showSeason7Ntf () {
      return !this.isHideSeason7Ntf && this.trainingPlanUpdatedAt && new Date(this.trainingPlanUpdatedAt) < new Date('2021-06-10T22:00:00.000Z')
    },
    dayPast () {
      let current = this.$date().startOf('day')
      current = current.add(this.allDone ? 1 : 0, 'day')
      const start = this.$date(this.startDate).startOf('day')

      return current.diff(start, 'day')
    },
    tournaments () {
      return this.userTournaments.map(tournament => {
        const dayNumber = this.$date(tournament.startAt).diff(this.$date(this.startDate).startOf('day'), 'days') + 1
        return { ...tournament, dayNumber }
      })
    },
    rescheduledTournaments () {
      return this.tournaments
        .filter(tournament => tournament.rescheduled)
        .map(tournament => ({
          ...tournament,
          date: tournament.startAt,
          location: tournament.regions,
          image: tournament.thumbnail
        }))
    },
    nextTournament () {
      const now = Date.now()
      return minBy(this.tournaments.filter(t => (this.$date(t.startAt) > this.$date(now))), tournament => this.$date(tournament.startAt))
    },
    tagList () {
      return this.trainingPlanFocus ? this.trainingPlanFocus.map(el => ({ category: el.category, label: `${el.category.toUpperCase()} - ${el.technique.toUpperCase()}` })) : []
    }
  },
  methods: {
    ...mapMutations('trainingPlan', {
      setSelectedRoutine: 'setSelectedRoutine',
      addRoutineToAnotherDay: 'addRoutineToAnotherDay'
    }),

    ...mapActions({
      finishOnboarding: 'user/finishOnboarding',
      getUserCurrentTrainingPlan: 'trainingPlan/fetchUserCurrentTrainingPlan',
      addTimeSection: 'trainingPlan/addTimeSection',
      changeTimeSection: 'trainingPlan/changeTimeSection',
      updateActivitiesInTimeSection: 'trainingPlan/updateActivitiesInTimeSection',
      adjustRoutineWithinDay: 'trainingPlan/adjustRoutineWithinDay',
      moveActivity: 'trainingPlan/moveActivity',
      updateTrainingPlan: 'trainingPlan/updateTrainingPlan',
      getCurrentUserScore: 'user/getCurrentUserScore',
      generateUserTrainingPlan: 'trainingPlan/generateTrainingPlan',
      regenerateTrainingPlan: 'trainingPlan/regenerateTrainingPlan',
      getUserActivitiesStats: 'user/getUserActivitiesStats',
      getTournaments: 'tournaments/getTournaments',
      getUserTournaments: 'tournaments/getUserTournaments'
    }),
    updateDayView (dayViewStatus, isLoad) {
      localStorage.setItem('dayViewStatus', !!dayViewStatus)
      this.dayView = !!dayViewStatus
      if (isLoad) {
        segmentIdentify(this.currentUser.id, { userTPView: dayViewStatus ? 'List' : 'Board' })
        this.trackAction('TP: loadDayView', { status: !!dayViewStatus })
      } else {
        this.trackAction('TP: updateDayView', { status: !!dayViewStatus })
      }
    },
    updateSeason7Ntf () {
      this.trackAction('TP: confirm updateSeason7Ntf')
      this.isPageReady = false
      this.regenerateTrainingPlan()
        .then(() => {
          setTimeout(() => {
            this.isPageReady = true
          }, 1000)
          this.hideSeason7Ntf()
        })
    },
    hideSeason7Ntf () {
      this.trackAction('TP: hide Season7Ntf')
      this.isHideSeason7Ntf = true
      localStorage.setItem('isHideSeason7Ntf', true)
    },

    selectRoutine ({ routineId, routine, position, dayNumber, timeSectionIdx, dayType, tournamentObject }) {
      this.setSelectedRoutine({
        dayNumber,
        timeSectionIdx,
        position,
        startHour: routine.startHour
      })

      const activityType = getActivityTypeFromCategory(routine.skill)
      if (activityType === 'knowledgetime') {
        this.$router.push({ name: 'Knowledge', params: { id: routineId } })
      } else if (activityType === 'gamesenseworkshop') {
        this.$router.push({ name: 'WorkshopTrainingPlanAll', query: { userTrainingActivityId: routineId } })
      } else {
        this.$router.push({ name: 'RoutineDetailsNew', query: { userTrainingActivityId: routineId }, params: { id: routine.trainingRoutineId } })
      }
      this.trackAction('TP: Click Training Activity', {
        'user-activity': routine,
        type: activityType,
        dayType: dayType || 'None',
        tournamentObject,
        date: new Date()
      })
    },

    // ====== TIME SECTIONS + MANAGE ACTIVITIES LOGIC ========

    wouldSectionsMerge ({ addDayNumber, addTimeSectionIdx, addedDuration }) {
      const thisSectionEnd = this.timeSectionsByDay[addDayNumber][addTimeSectionIdx].end ||
        this.timeSectionsByDay[addDayNumber][addTimeSectionIdx].start // for empty time sections
      const nextSectionStart = this.timeSectionsByDay[addDayNumber][addTimeSectionIdx + 1]?.start
      return nextSectionStart && !this.$dayjs.timeOfDay(nextSectionStart)
        .isAfter(this.$dayjs.timeOfDay(thisSectionEnd).add(addedDuration, 'minutes'))
    },
    confirmMerge () {
      this.trackAction('TP: Confirm merge sections', { reason: this.showConfirmMergeTimeSections })
      switch (this.showConfirmMergeTimeSections) {
        case 'move-activity':
          this.confirmMoveActivityAcrossSections()
          break
        case 'add-activity':
          this.confirmAddActivity()
          break
        case 'move-section':
          this.confirmChangeTimeSection()
          break
      }
      this.showConfirmMergeTimeSections = ''
    },
    cancelMerge () {
      this.trackAction('TP: Cancel merge sections', { reason: this.showConfirmMergeTimeSections })
      this.showConfirmMergeTimeSections = ''
      this.activityToMove = null
      this.activityToAdd = null
    },

    async tryAddTimeSection (data) {
      const didAdd = await this.addTimeSection(data)
      if (!didAdd) {
        this.$q.notify({
          color: 'pink',
          message: 'You cannot add a time section that overlaps with another time section'
        })
      }
    },

    async tryChangeTimeSection (data) {
      const result = await this.changeTimeSection({ ...data, checkMerge: true })
      if (!result?.wouldSectionsMerge) {
        return
      }

      // if (this.timeSectionsByDay[data.dayNumber][data.timeSectionIdx].items.length === 0) {
      //   // TODO: special case, we are moving empty section, just show error message
      //   // and quit instead of opening merge modal
      // }

      // we need to merge in the sections
      this.sectionsToMove = { ...data, overlappingSections: result.overlappingSections }
      this.showConfirmMergeTimeSections = 'move-section'
    },
    confirmChangeTimeSection () {
      const { dayNumber, overlappingSections } = this.sectionsToMove
      // format of overlappingSections: Array<[timeSectionIdx, timeSection]>
      const sectionsToMove = overlappingSections.sort((a, b) => {
        const compStartTime = this.$dayjs.timeOfDay(a[1].start).valueOf() - this.$dayjs.timeOfDay(b[1].start).valueOf()
        return compStartTime !== 0 ? compStartTime : a[0] - b[0] // sort by start time then original index
      })

      const startTimeOfFirstChangedSection = sectionsToMove[0][1].start
      let currentOffset = 0
      for (const [timeSectionIdx, timeSection] of sectionsToMove) {
        this.changeTimeSection({
          dayNumber,
          timeSectionIdx,
          start: startTimeOfFirstChangedSection,
          offset: currentOffset
        })
        currentOffset += timeSection.items.length
      }
      this.sectionsToMove = null
    },

    async moveActivityWithinSection ({ newIndex, oldIndex, element }, { dayNumber, timeSectionIdx }) {
      const sectionStart = this.timeSectionsByDay[dayNumber][timeSectionIdx].start

      await this.adjustRoutineWithinDay({
        dayNumber,
        timeSectionIdx,
        activity: element,
        oldIndex,
        newIndex,
        sectionStart: sectionStart
      })

      this.trackAction('TP: Modify Training routine hour', {
        from: dayjs(this.startDate).add(dayNumber, 'day'),
        to: dayjs(this.startDate).add(dayNumber, 'day'),
        userRoutineObject: element
      })
    },

    markActivityToAdd ({ newIndex, element }, { dayNumber, timeSectionIdx }) {
      if (newIndex === undefined) {
        this.activityToAdd = null
        return
      }
      this.activityToAdd = {
        dayNumber,
        timeSectionIdx,
        newIndex,
        activity: element
      }
    },
    markActivityToRemove ({ oldIndex }, { dayNumber, timeSectionIdx }) {
      if (oldIndex === undefined) {
        this.activityToRemove = null
        return
      }
      this.activityToRemove = {
        dayNumber,
        timeSectionIdx,
        oldIndex
      }
    },

    moveActivityAcrossSections () {
      if (this.activityToAdd === null || this.activityToRemove === null) {
        this.activityToAdd = null
        this.activityToRemove = null
        return
      }

      const {
        dayNumber: addDayNumber,
        timeSectionIdx: addTimeSectionIdx,
        newIndex,
        activity
      } = this.activityToAdd
      const {
        dayNumber: rmDayNumber,
        timeSectionIdx: rmTimeSectionIdx,
        oldIndex
      } = this.activityToRemove

      this.activityToRemove = null
      this.activityToAdd = null

      const activityToMove = { addDayNumber, addTimeSectionIdx, newIndex, rmDayNumber, rmTimeSectionIdx, oldIndex, activity }

      if (this.wouldSectionsMerge({ addDayNumber, addTimeSectionIdx, addedDuration: activity.duration })) {
        this.activityToMove = activityToMove
        this.showConfirmMergeTimeSections = 'move-activity'
      } else {
        return this.commitMoveActivityAcrossSections(activityToMove)
      }
    },
    confirmMoveActivityAcrossSections () {
      this.commitMoveActivityAcrossSections(this.activityToMove)
      this.activityToMove = null
    },
    async commitMoveActivityAcrossSections (activityToMove) {
      const { addDayNumber, addTimeSectionIdx, rmDayNumber, activity } = activityToMove

      this.moveActivity(activityToMove)

      if (this.wouldSectionsMerge({ addDayNumber, addTimeSectionIdx, addedDuration: activity.duration })) {
        this.changeTimeSection({
          dayNumber: addDayNumber,
          timeSectionIdx: addTimeSectionIdx + 1,
          start: this.timeSectionsByDay[addDayNumber][addTimeSectionIdx].start,
          offset: this.timeSectionsByDay[addDayNumber][addTimeSectionIdx].items.length
        })
      }

      this.updateActivitiesInTimeSection({ dayNumber: addDayNumber, timeSection: this.timeSectionsByDay[addDayNumber][addTimeSectionIdx] })

      const dayKey1 = rmDayNumber
      const dayKey2 = addDayNumber

      await this.updateTrainingPlan([dayKey1, dayKey2])

      this.trackAction('TP: Modify Training routine day', {
        from: dayjs(this.startDate).add(rmDayNumber, 'day'),
        to: dayjs(this.startDate).add(addDayNumber, 'day'),
        userRoutineObject: activity
      })
    },

    addNewRoutine ({ trainingPlanRoutine, dayNumber, timeSectionIdx }) {
      if (this.wouldSectionsMerge({ addDayNumber: dayNumber, addTimeSectionIdx: timeSectionIdx, addedDuration: trainingPlanRoutine.duration })) {
        this.showConfirmMergeTimeSections = 'add-activity'
        this.activityToAdd = { trainingPlanRoutine, dayNumber, timeSectionIdx }
      } else {
        this.commitAddActivity({ trainingPlanRoutine, dayNumber, timeSectionIdx })
      }
    },
    confirmAddActivity () {
      this.commitAddActivity(this.activityToAdd)
      this.activityToAdd = null
    },
    async commitAddActivity (activityToAdd) {
      const { trainingPlanRoutine, dayNumber, timeSectionIdx } = activityToAdd
      const startHour = this.timeSectionsByDay[dayNumber][timeSectionIdx].start
      const index = this.timeSectionsByDay[dayNumber][timeSectionIdx].items.length
      this.addRoutineToAnotherDay({
        day: dayNumber,
        routine: {
          ...trainingPlanRoutine,
          startHour,
          index
        },
        to: index
      })
      this.updateActivitiesInTimeSection({ dayNumber, timeSection: this.timeSectionsByDay[dayNumber][timeSectionIdx] })

      await this.updateTrainingPlan([dayNumber])
    },

    // ====== END TIME SECTIONS + MANAGE ACTIVITIES LOGIC ========

    controlAllDailyRoutinesCompletedModal () {
      if (this.counter?.count && ((this.showFinishedAllDailyRoutineModal && !this.suppressOnLoadModals))) {
        this.trackAction('All Daily Routines Completed: user completed', {
          user: this.user
        })
        this.showCongratsAllModal = true
      }
    },

    preferenceSaving (val) {
      this.isBuildingLoader = val
    },

    trackLastLoggedIn () {
      if (!this.user) { return }

      const utcOffset = (new Date().getTimezoneOffset()) * -1
      const lastLoggedIn = new Date().toISOString()

      api.trackLastLoggedIn(this.user.id, { utcOffset, lastLoggedIn })
    },

    onLoadWeek () {
      this.controlAllDailyRoutinesCompletedModal()
    },

    weeklyLoaded () {
      // TODO: add here modals you want to show after the weekly TP loaded
    },

    closePhaseModal () {
      this.phaseModal = null
    },

    trackClickOnPhaseModalVideo () {
      if (!this.phaseModal) {
        return
      }

      this.trackAction('Tournaments: Tournament video modal: click play')
    },

    async confirmRemoveTournaments (redirect) {
      this.showTournamentRemovedModal = false
      await api.deleteRescheduledUserTournaments(this.currentUser.id)
      if (redirect) {
        this.regenerateTrainingPlan()
        this.$router.push({ name: 'Tournaments' })
      } else {
        this.isBuildingLoader = true
        await this.regenerateTrainingPlan()
        await this.getUserTournaments({ userId: this.currentUser.id })
        this.isBuildingLoader = false
      }
    }
  },
  watch: {
    week (value) {
      if (value) {
        this.controlAllDailyRoutinesCompletedModal()
      }
    },
    rescheduledTournaments (value) {
      const filteredTournaments = value.filter((tournament) => this.$date(tournament.endAt).isAfter(new Date()))
      if (filteredTournaments.length > 0) {
        this.trackAction('Tournaments: Rescheduled modal: Show', { tournaments: filteredTournaments })
        this.showTournamentRemovedModal = true
      }
    },
    showCongratsAllModal (value) {
      if (value) {
        this.$confetti.start()
      } else {
        this.$confetti.stop()
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.suppressOnLoadModals = from.path === '/onboarding'
    })
  }
}
</script>

<style lang="scss">
.dashboard-content{
  padding: 30px 30px 0 10px;
  display: flex;
  flex-direction: column;
  @media (max-width: $breakpoint-sm-max) {
    padding: 0;
  }
}
.title-img-bg {
  position: absolute;
  top: -50px;
}
.modal-congrats {
  padding: 30px;
}

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
  position: absolute;
  top: 0;
  width: 100%;
}
.slide-enter {
  transform: translate(100%, 0);
  position: absolute;
  opacity: 0;
}
.slide-leave-to {
  transform: translate(-100%, 0);
  position: absolute;
  opacity: 0;
}
.text-opacity {
  opacity: 0.3;
}
.text-uppercase {
  text-transform: uppercase;
}
.text-size-small {
  font-size: 10px;
}
.phase-header {
  @media (max-width: $breakpoint-sm-max) {
    border-bottom: 1px solid $soft-tone;
    margin: 0;
    padding: 10px;
  }
}
.color-gray-violet {
  color: $gray-violet;
}
</style>

<style lang="scss" scoped>
.q-header{
  border-bottom: 1px solid;
}
.week-progress{
  display: flex;
  flex-direction: row;
  align-items: center;
  &__day{
    width: 7px;
    height: 28px;
    border-radius: 3px;
    margin-right: 3px;
    border: 2px solid $soft-tone;
    &--done{
      border-color: $green;
      background: rgba(44, 173, 109, 0.4);
    }
  }
}

.btn-group {
  display: inline-flex;
  flex-direction: row;
  border: 1px solid $soft-tone;
  border-radius: 6px;
  padding: 4px 2px;
  width: auto;
  .btn-group__item{
    margin: 0 2px;
    height: 40px;
    /deep/ .q-btn{
      height: 100%;
      line-height: 14px;
      @media (max-width: $breakpoint-sm-max) {
        &__wrapper{
          padding: 12px 15px;
        }
      }
    }
  }
}
</style>
