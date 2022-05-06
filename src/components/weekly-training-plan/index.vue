<template>
  <div class="training-plan__week"
       :class="{'training-plan__week--day-view': dayView}">
    <c-building-loader v-if="isBuildingLoader"
                       :username="computedUserDisplayName"
                       :info="spinnerInfo"/>
    <transition-group name="list-complete" tag="div" class="full-height">
      <div v-if="!isBuildingLoader && ready"
        key="week"
        class="training-plan__list training-plan__customized-scroll"
        ref="weekContainer"
        v-touch-pan.mouse="handlePan"
      >
        <div
          v-for="(day, dayIdx) in week"
          v-show="true || $q.screen.gt.xs || dayIdx === dayToShow"
          class="training-plan__clmn"
          :class="{
            'training-plan__clmn--daily-view': dayView && (day.tournamentPrep === 'PREP' || day.tournamentPrep === 'EVENT' || isFirstDayAndStartHereVisible(day.dayNumber)),
            'training-plan__clmn--active': isCurrentDay(day.dayNumber),
            'training-plan__clmn--start-here': isFirstDayAndStartHereVisible(day.dayNumber),
            'training-plan__clmn--highlight': day.tournamentPrep,
            'training-plan__clmn--highlight--green': day.tournamentPrep === 'PREP',
            'training-plan__clmn--highlight--pink': day.tournamentPrep === 'EVENT'
          }"
          :ref="`weekday-${isCurrentDay(day.dayNumber) || day.dayNumber}`"
          :key="'day-' + day.dayNumber"
          @touchstart="stopIfChosen"
          @mousedown="stopIfChosen"
        >
          <div
            v-if="isFirstDayAndStartHereVisible(day.dayNumber)"
            class="training-plan__start-here-badge"
          >
            START HERE
          </div>
          <div
            v-else-if="day.tournamentPrep === 'PREP'"
            class="training-plan__day-badge"
          >
            PREP DAY
          </div>
          <div
            v-else-if="day.tournamentPrep === 'EVENT'"
            class="training-plan__day-badge"
          >
            TOURNAMENT DAY
          </div>

          <c-day-header
            :dayLabel="day.dayLabel"
            :dayDateString="day.dayDateString.format('DD/MM')"
            :isCurrentDay="isCurrentDay(day.dayNumber)"
            :isFirstDay="dayIdx === 0"
            :isLastDay="false"
            :totalTime="day.totalTime"
            @prevDay="goPrevDay"
            @nextDay="goNextDay"
            @addTime="showChangeTimeModal('newTimeSection', { dayNumber: day.dayNumber })"
            @mark-all-as-done="handleMarkActivitiesAsDone(day)"
          />
          <div
            class="training-plan__time-sections-list training-plan__customized-scroll"
            :class="{
              'training-plan__time-sections-list--reset-height': day.dayNumber === 1,
              'training-plan__time-sections-list--list-view' : dayView
            }"
            v-detect-scrollbar
          >
            <draggable v-for="(section, idx) in day.timeSections"
              :value="section.items"
              class="training-plan__list-drag q-pb-lg"
              draggable=".drag-item"
              :handle="$q.screen.lt.sm ? '.handle' : ''"
              v-bind="dragOptions"
              @choose="chosen = true"
              @unchoose="chosen = false"
              @change="onItemMove($event, { dayNumber: day.dayNumber, timeSectionIdx: idx })"
              @start="drag = true"
              @end="drag = false; checkMove()"
              :key="`day-${day.dayNumber}-${idx}-dd`"
              style="min-height: 30px"
            >
              <c-time-section
                slot="header"
                :key="`day-${day.dayNumber}-${idx}-time-section`"
                :start="section.start"
                :end="section.end"
                @add="showAddNewRoutineModal(day.dayNumber, idx, section)"
                @change-time="showChangeTimeModal('editTimeSection', { dayNumber: day.dayNumber, timeSectionIdx: idx }, section.start)"/>
              <template v-for="(item, position) in section.items">
                <c-routine v-if="item.type === 'routine'"
                  class="drag-item q-mb-md"
                  style="order: 1"
                  data-intercom-target="Training Plan's Activity card"
                  :key="item.id"
                  :data="item"
                 :minimized="dayView"
                  @pick-another-routine-selected="pickAnotherRoutineSelected({
                    ...$event,
                    oldIndex: position,
                    dayInfo: { dayNumber: day.dayNumber, timeSectionIdx: idx }
                  })"
                  @click="clickOnRoutine($event, item, position, day.dayNumber, idx, day.tournamentPrep, day.tournamentPrepObject)"
                  @mark-activity-as-done="checkAndResetStartHereState(day.dayNumber)"
                  :isCurrentDay="isCurrentDay(day.dayNumber)"
                >
                  <c-icon
                    icon="arrowsDrag"
                    slot="handle"
                    class="handle touch-only"
                    :key="item.id + '-handle'" />
                </c-routine>
                <c-routine v-else-if="item.type === 'shared_event'"
                  class="q-mb-md"
                  :shared="true"
                  style="order: 1"
                  :key="item.id"
                  :participants="item.participants && item.participants.filter(el => el.isGoing)"
                  :isGoing="item.isUserGoing"
                  :data="{
                    ...item.trainingRoutine,
                    friendGroupEventId: item.id,
                    discordEventUrl: item.discordEventUrl,
                    startHour: item.startHour,
                    endHour: item.endHour,
                    totalTime: item.trainingRoutine.duration
                  }"
                  :minimized="dayView"
                  @click="clickOnRoutine($event, item, position, day.dayNumber, idx, day.tournamentPrep, day.tournamentPrepObject, true)"
                  @going="$emit('subscribed-to-fg-event', {
                    discordEventUrl: item.discordEventUrl
                  })"
                  :isCurrentDay="isCurrentDay(day.dayNumber)"
                  :isFinished="isFinished(day.dayDateString, item)"
                >
                  <c-icon
                    icon="arrowsDrag"
                    slot="handle"
                    class="handle touch-only"
                    :key="item.id + '-handle'" />
                </c-routine>
                <c-tournament v-else-if="item.type === 'tournament'"
                  class="no-drag q-mb-md"
                  style="order: 1"
                  :key="item.id"
                  :data="item"
                  :isCurrentDay="isCurrentDay(day.dayNumber)"
                />
              </template>
              <c-day-footer
                slot="footer"
                v-if="section.items.length === 0"
                :isEmpty="section.items.length === 0"
                :isCurrentDay="isCurrentDay(day.dayNumber)"
                @click="showAddNewRoutineModal(day.dayNumber, idx, section)"
              />
            </draggable>
            <draggable v-if="!day.timeSections || !day.timeSections.length"
              :value="[]"
              class="training-plan__list-drag q-mb-xl"
              draggable=".drag-item"
              v-bind="dragOptions"
              @change="onItemMoveToEmptyDay($event, { dayNumber: day.dayNumber })"
              :key="`day-${day.dayNumber}-empty-dd`"
              style="min-height: 30px"
            >
              <c-day-footer
                slot="footer"
                isEmpty
                :isCurrentDay="isCurrentDay(day.dayNumber)"
                @click="showAddNewRoutineModal(day.dayNumber)"
              />
            </draggable>
          </div>
        </div>

        <div
          v-if="true || $q.screen.gt.xs || dayToShow === week.length"
          class="training-plan__clmn q-px-md"
          :class="{
            'training-plan__clmn__extra--active': isExtraDayActiveInternal()
          }"
          style="opacity: 1;flex: 0 0 400px"
          :style="{ 'flex-basis': $q.screen.lt.sm ? '100%' : '400px' }"
          tabindex="0"
          ref="generateNewTpBlock">
          <c-day-header
            class="lt-sm"
            dayLabel="Good job!"
            dayDateString=""
            :isFirstDay="false"
            :isLastDay="true"
            @prevDay="goPrevDay"
            @nextDay="goNextDay"
          />
          <c-next-seven-days
            :ref="`weekday-next-7-days`"
            :class="{'training-plan__clmn--disable': !showGenerateTP}"
            :enable="showGenerateTP"
          />
        </div>
      </div>
      <div v-else
        key="fake-week"
        class="training-plan__fake"
        :class="{'training-plan__fake--active': isBuildingLoader || !ready}"
      >
        <div
          class="training-plan__fake-clmn"
          :class="{'training-plan__fake-clmn--active': isCurrentDay(i)}"
          v-for="i in 7"
          :key="`fake-day-${i}`"
        >
          <div class="training-plan__fake-header"></div>
          <div class="training-plan__fake-time-section"></div>
          <div class="training-plan__fake-activity">
            <div></div>
            <div></div>
          </div>
          <div class="training-plan__fake-divider"></div>
          <div class="training-plan__fake-activity">
            <div></div>
            <div></div>
          </div>
          <div class="training-plan__fake-activity">
            <div></div>
            <div></div>
          </div>
          <div class="training-plan__fake-activity">
            <div></div>
            <div></div>
          </div>
          <div class="training-plan__fake-divider"></div>
        </div>
      </div>
    </transition-group>

    <n-pick-another-routine
      v-if="isAddNewRoutineDialogVisible"
      :available-routines="alternativeRoutines"
      @close="closeAddNewRoutineDialog"
      @select="addNewRoutine"
    />
    <!--      New Time section-->
    <n-time-modal @close="timeModal = null"
                  @add="addNewTimeSection"
                  :visible="isTimeModal('newTimeSection')">
      <div class="text-h3">
        Add a new time section
      </div>
      <div class="opacity-5">
        A new time section will be added to your<br/>
        selected day. If the time crosses other<br/>
        sections, it will merge with them
      </div>
    </n-time-modal>
    <!--      New Time slot for activity-->
    <n-time-modal @close="timeModal = null"
                  :visible="isTimeModal('newTimeSlot')">
      <div class="text-h3">
        Select a new time slot for this activity
      </div>
      <div class="opacity-5">
        It may adjust your other activities if the time<br/>
        frame is repeated.
      </div>
    </n-time-modal>
    <!--      Edit section time-->
    <n-time-modal @close="timeModal = null"
                  @add="changeTimeSection"
                  confirmText="Save"
                  :defaultTime="timeModal && timeModal.defaultTime"
                  :visible="isTimeModal('editTimeSection')">
      <div class="text-h3">
        Edit section time
      </div>
      <div class="opacity-5" style="font-size: small;">
        If the selected time crosses other <br/>
        sections, it will merge with them. <br/>
        If you want to change the day,<br/>
        drag the activities to the desired day.
      </div>
    </n-time-modal>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters, mapState, mapActions } from 'vuex'
import paymentMixin from '@/mixins/payment.mixin'
import draggable from 'vuedraggable'

export default {
  props: {
    startDate: {
      type: String,
      required: true
    },
    week: {
      type: Array,
      required: true
    },
    isBuildingLoader: {
      type: Boolean,
      default: false
    },
    dayView: {
      type: Boolean,
      default: false
    },
    ready: {
      type: Boolean,
      default: false
    }
  },
  components: {
    draggable,
    'c-routine': () => import('@/components/dashboard/routine'),
    'c-tournament': () => import('@/components/dashboard/tournament'),
    'c-time-section': () => import('@/components/weekly-training-plan/time-section'),
    'c-day-header': () => import('components/weekly-training-plan/day-header'),
    'c-day-footer': () => import('components/weekly-training-plan/day-footer'),
    'c-next-seven-days': () => import('@/components/common/next-seven-days'),
    'n-time-modal': () => import('@/components/weekly-training-plan/_time-modal'),
    'c-building-loader': () => import('@/components/common/training-plan-loader'),
    'n-pick-another-routine': () =>
      import('components/training-routine/pick-another-routine')
  },
  mixins: [paymentMixin],
  data () {
    return {
      drag: false,
      chosen: false,
      dayToShow: 0,
      isAddNewRoutineDialogVisible: false,
      newRoutines: [],
      triggeredModalFromDay: null,
      activityToAdd: null,
      activityToMove: null,
      gif: require('assets/gifs/training-plan.gif'),
      timeModal: null,
      isStartHereSectionUntouched: true
    }
  },
  computed: {
    ...mapGetters({
      computedUserDisplayName: 'user/currentUserComputedName',
      alternativeRoutines: 'trainingRoutine/getAlternativeRoutines',
      getRoutineDuration: 'trainingRoutine/getRoutineDuration',
      isAdmin: 'user/isAdmin',
      getTrainingPlansByDayId: 'trainingPlan/getTrainingPlansByDayId',
      arenaKD: 'user/arenaKD',
      publicKD: 'user/publicKD',
      arenaPlacement: 'user/arenaPlacement',
      publicPlacement: 'user/publicPlacement',
      powerRank: 'user/powerRank'
    }),

    ...mapState({
      trainingPlansAmount: state => state.user.trainingPlansAmount
    }),

    nextWeek () {
      if (this.isExtraDayActiveInternal()) {
        return {
          dayLabel: this.$date().format('dddd'),
          dayDateString: this.$date().format('DD/MM')
        }
      } else {
        return {
          dayLabel: this.$date(this.startDate).add(1, 'week').format('dddd'),
          dayDateString: this.$date(this.startDate).add(7, 'day').format('DD/MM')
        }
      }
    },

    dragOptions () {
      return {
        animation: 200,
        group: 'rountine',
        disabled: false,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        ghostClass: 'ghost',
        dragClass: 'sortable-drag'
      }
    },

    currentDayNumber () {
      return this.$date().isoWeekday()
    },

    showGenerateTP () {
      return this.isAdmin || (this.$date().diff(this.$date(this.startDate), 'days') >= 6)
    },

    isStartHereVisible () {
      const firstActivity = (this.week[0] && this.week[0].timeSections[0] && this.week[0].timeSections[0].items[0]) || {}
      const dateFormatPattern = 'YYYY-MM-DD'

      return dayjs(this.startDate).format(dateFormatPattern) === dayjs().format(dateFormatPattern) &&
        this.trainingPlansAmount === 1 &&
        this.isStartHereSectionUntouched &&
        // firstActivity.title === 'Introduction to NOVOS' &&
        !firstActivity.isCompleted
    },

    spinnerInfo () {
      return [
        {
          type: 'Number',
          value: Math.max(this.arenaKD, this.publicKD),
          label: 'KD'
        },
        {
          type: 'Number',
          value: Math.min(this.arenaPlacement, this.publicPlacement),
          label: 'Placement'
        },
        {
          type: 'Number',
          value: this.powerRank,
          label: 'PR'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      createNewUserRoutine: 'trainingRoutine/createNewUserRoutine',
      fetchAlternativeRoutines: 'trainingRoutine/fetchAlternativeRoutines',
      markActivitiesAsDone: 'trainingRoutine/markActivitiesAsDone'
    }),

    isFirstDayAndStartHereVisible (dayNumber) {
      return dayNumber === 1 && this.isStartHereVisible
    },

    addNewTimeSection (time) {
      const dayInfo = this.timeModal.dayInfo
      this.$emit('add-time-section', { ...dayInfo, start: time })
      this.timeModal = null
      if (this.activityToAdd) {
        // NOTE: This is a hack to get the newly added section without asking parent page
        // We trust that activityToAdd is only non-null when adding to an empty day
        this.triggeredModalFromDay.section = { start: time }
        this.triggeredModalFromDay.timeSectionIdx = 0
        this.trackAction('TP: Add new time section: adding to empty day', { date: new Date(), ...dayInfo, start: time })
        return this.addNewRoutine(this.activityToAdd)
      } else if (this.activityToMove) {
        // We were moving to empty day, now we can commit the move
        this.$emit('add', this.activityToMove, { ...dayInfo, timeSectionIdx: 0 })
        this.activityToMove = null
        this.$emit('commit-move')
        this.makeActiveDay(dayInfo.dayNumber)
        this.trackAction('TP: Add new time section: moving to empty day', { date: new Date(), ...dayInfo, start: time })
      } else {
        this.trackAction('TP: Add new time section: from menu', { date: new Date(), ...dayInfo, start: time })
      }
    },
    changeTimeSection (time) {
      this.$emit('change-time-section', { ...this.timeModal.dayInfo, start: time })
      this.timeModal = null
      this.trackAction('TP: Edit time section time', { date: new Date(), start: time })
    },

    showChangeTimeModal (type, dayInfo, defaultTime) {
      if (!this.checkPremiumActionRestriction(type)) {
        return
      }
      this.timeModal = {
        type, dayInfo, defaultTime
      }
    },
    isTimeModal (type) {
      return this.timeModal?.type === type
    },

    handlePan ({ evt, ...info }) {
      if (info.mouse) {
        this.$refs.weekContainer.scrollLeft -= info.delta.x
      }
    },
    stopIfChosen (evt) {
      if (this.chosen) {
        evt.stopPropagation()
      }
    },

    onItemMove ({ added, moved, removed }, dayInfo) {
      this.checkAndResetStartHereState(dayInfo.dayNumber)
      if (!this.checkPremiumActionRestriction('itemWasMoved')) {
        return
      }
      if (removed) {
        this.$emit('remove', removed, dayInfo)
      }

      if (added) {
        this.$emit('add', added, dayInfo)
        this.makeActiveDay(dayInfo.dayNumber)
      }

      if (moved) {
        this.$emit('move', moved, dayInfo)
        this.makeActiveDay(dayInfo.dayNumber)
      }
    },

    checkMove () {
      // check that we aren't moving to an empty day, if we are, we need to
      // create time section before commiting the move
      if (!this.activityToMove) {
        this.$emit('commit-move')
      }
    },

    onItemMoveToEmptyDay ({ added }, dayInfo) {
      if (!this.checkPremiumActionRestriction('itemWasMoved')) {
        return
      }
      if (added) {
        this.showChangeTimeModal('newTimeSection', dayInfo)
        this.activityToMove = added
      }
    },

    isCurrentDay (offset) {
      if ((this.$date(this.startDate).startOf('day').diff(this.$date().startOf('day'), 'days') > 6) || (this.$date(this.startDate).startOf('day').diff(this.$date().startOf('day'), 'days') < -6)) return false
      return (this.currentDayNumber === this.$date(this.startDate).add(offset - 1, 'days').isoWeekday())
    },

    isFinished (selDate, item) {
      const [hour, minute] = item.startHour.split(':')
      const eventDate = dayjs(selDate).set('hour', hour).set('minute', minute).add(item.duration, 'minute')
      return this.$date().diff(eventDate, 'hour') > 1
    },

    isExtraDayActiveInternal () {
      return this.isExtraDayActive(this.startDate)
    },

    showAddNewRoutineModal (dayNumber, timeSectionIdx, section) {
      if (!this.checkPremiumActionRestriction('showAddNewRoutineModal')) {
        return
      }
      this.isAddNewRoutineDialogVisible = true
      this.triggeredModalFromDay = { dayNumber, timeSectionIdx, section }

      if (section) {
        this.trackAction('TP: Click Training plan add new routine into section', { date: new Date(), sectionStart: section.start })
      } else {
        this.trackAction('TP: Click Training plan add new routine', { date: new Date() })
      }
    },

    closeAddNewRoutineDialog () {
      this.isAddNewRoutineDialogVisible = false
    },

    async addNewRoutine (routine) {
      const { dayNumber, section } = this.triggeredModalFromDay

      if (!section) {
        // this day was empty, let's ask them to give us the time of new section
        this.showChangeTimeModal('newTimeSection', { dayNumber })
        this.activityToAdd = routine
        this.isAddNewRoutineDialogVisible = false
        return
      }
      this.activityToAdd = null

      this.trackAction('TP: Click Training routine options', { date: new Date() })

      const userTrainingRoutine = await this.createNewUserRoutine(routine)
      if (userTrainingRoutine) {
        const trainingPlanRoutine = {
          duration: this.getRoutineDuration(userTrainingRoutine.id),
          startHour: section.start,
          activityInstanceId: userTrainingRoutine.id
        }

        this.$emit('add-new-routine', {
          trainingPlanRoutine,
          ...this.triggeredModalFromDay
        })

        this.isAddNewRoutineDialogVisible = false
      }
    },

    async pickAnotherRoutineSelected ({ dayInfo, oldIndex, routine, oldRoutine }) {
      const userTrainingRoutine = await this.createNewUserRoutine(routine)
      if (!userTrainingRoutine) return

      const dayRoutine = {
        duration: this.getRoutineDuration(userTrainingRoutine.id),
        startHour: oldRoutine.startHour,
        activityInstanceId: userTrainingRoutine.id
      }

      this.$emit('remove', { oldIndex }, dayInfo)
      this.$emit('add', { element: dayRoutine, newIndex: oldIndex }, dayInfo)
      this.$emit('commit-move')
    },

    clickOnRoutine (routineId, routine, position, dayNumber, timeSectionIdx, dayType, tournamentObject, isShared) {
      this.trackAction('TP: Click Training Routine', {
        'user-routine': routine,
        date: new Date()
      })

      if (!this.isAllowedToUsePlatform) {
        return this.setPayWallMethod('OnClick OnRoutine')
      } else {
        this.$emit('selected-routine', {
          routineId, routine, position, dayNumber, timeSectionIdx, dayType, tournamentObject, isShared
        })
      }
    },

    focusOnGenerateTrainingPlan () {
      const track = this.$route.query.track
      if (!track) {
        return
      }

      if (track === 'generate-new-tp-reminder') {
        this.$refs.generateNewTpBlock.focus()
      }
    },
    handleMarkActivitiesAsDone ({ dayNumber }) {
      const activitiesPerMarkedDay = this.getTrainingPlansByDayId(dayNumber)
      const activitiesIds = activitiesPerMarkedDay.map(activity => activity.activityInstanceId)

      this.markActivitiesAsDone(activitiesIds)
      this.trackAction('TP: Click mark all as done', { date: new Date(), dayNumber })
    },

    goPrevDay () {
      this.dayToShow = Math.max(this.dayToShow - 1, 0)
    },
    goNextDay () {
      this.dayToShow = Math.min(this.dayToShow + 1, this.week.length)
    },
    makeActiveDay (dayNumber) {
      if (this.$q.screen.gt.xs) {
        return
      }

      this.scrollToDay(dayNumber)
      // TODO: maybe support dayToShow for arrow-based navigation?? Note that
      // we'll need to be able to update dayToShow based on scroll position as
      // well, otherwise it'll scroll to the wrong place if user scrolls away
      // first, then taps arrows - we didn't know they changed the day

      // this.dayToShow = this.week.indexOf(day => day.dayNumber === dayNumber)
    },
    scrollToDay (dayNumber) {
      const el = this.$refs[`weekday-${dayNumber}`] || this.$refs['weekday-true'] || [this.$refs['weekday-next-7-days']?.$el]
      const ct = this.$refs.weekContainer
      const min = this.$q.screen.lt.sm ? 10 : 20 // amount of left margin
      if (ct && el && el[0]) {
        ct.scroll({
          left: el[0].offsetLeft - min,
          behavior: 'smooth'
        })
      }
    },
    checkAndResetStartHereState (dayNumber) {
      if (this.isStartHereSectionUntouched && dayNumber === 1) {
        this.isStartHereSectionUntouched = false
      }
    }
  },
  watch: {
    isBuildingLoader: {
      handler: function (value) {
        if (this.week?.length && !this.isBuildingLoader) {
          this.fetchAlternativeRoutines({})
          setTimeout(() => {
            this.scrollToDay(-1)
            const today = this.week.findIndex(day => this.isCurrentDay(day.dayNumber))
            this.dayToShow = today || 0

            this.focusOnGenerateTrainingPlan()
          }, 1500)
        }
        this.$emit('loaded')
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.training-plan {
  $root: &;
  &__week {
    position: relative;
    margin: 0;
    padding: 10px 20px 0 10px;
    max-height: var(--app-height);
    flex-grow: 1;
    overflow: hidden;

    &__iphone {
      height: calc(var(--app-height) - 120px);
    }
    @media (max-width: $breakpoint-sm-max) {
      padding: 0 20px;
      height: calc(var(--app-height) - 50px);
    }
    @media (min-width: $breakpoint-sm-min) {
      &:after {
        content: "";
        position: absolute;
        top: 0;
        right: 0px;
        bottom: 10px;
        width: 50px;
        background: linear-gradient(270deg, $dark 0%, rgba(124, 39, 126, 0) 100%);
      }
    }

    &--day-view{
      padding: 0 0 20px 0;
      &:after{
        content: "";
        position: absolute;
        top: unset;
        left: 0;
        right: 0;
        bottom: 20px;
        height: 50px;
        width: 100%;
        z-index: 9;
        background: linear-gradient(0deg, $dark 0%, rgba(124, 39, 126, 0) 100%);
      }
      #{$root}__list{
        flex-wrap: wrap;
        margin: 0 -15px 0 0 ;
        padding: 0 15px;
        &-drag{
          max-height: unset;
        }
      }
      #{$root}__clmn{
        width: 100%;
        flex: 0 0 100%!important;
        margin: 0 0 15px;
        height: auto;
        max-height: unset;
      }
      #{$root}__time-sections-list{
        overflow: unset!important;
      }
      #{$root}__customized-scroll{
        cursor: unset;
      }
      /deep/ .training-plan__header{
        position: sticky;
        top: 0;
        z-index: 10;
        border-radius: 0 0 6px 6px;
      }
    }
  }
  &__list {
    margin: -10px -20px -10px -20px;
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    padding: 22px 0 0px;
    height: 100%;
    align-items: flex-start;

    /deep/ * {
      user-select: none;
    }

    .ghost {
      opacity: 0.5;
    }

    // Makes horizontal scroll invisible
    // Firefox
    scrollbar-width: none;
    // Safari & Chrome
    &::-webkit-scrollbar {
      display: none;
    }

    @media (max-width: $breakpoint-xs-max) {
      align-items: flex-start;
    }
  }
  &__list-drag {
    display: flex;
    flex-direction: column;
    height: auto;
    max-height: 100%;

    & .no-drag {
      cursor: not-allowed;
    }

    @media (max-width: $breakpoint-xs-max) {
      height: auto;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  &__customized-scroll {
    cursor: grab;
  }
  &__clmn {
    display: flex;
    flex-direction: column;
    flex: 0 0 300px;
    margin: 5px 5px 0;
    padding: 8px;
    height: auto;
    max-height: calc(100% - 30px);

    &--active {
      flex: 0 0 450px;
    }

    &__extra--active {
      opacity: 1;
    }

    &--disable {
      opacity: .3 !important;
      pointer-events: none;
    }

    &--daily-view {
      margin-top:20px !important;

      @media (max-width: $breakpoint-sm-max) {
        margin-top:20px !important;
      }
    }
    &--start-here {
      border: 2px solid $pink;
      position: relative;
      border-radius: 6px;

      @media (max-width: $breakpoint-sm-max) {
        border: none;
        padding: 0 15px;
        position: initial;
        border-radius: initial;
      }
    }

    &--highlight {
      $parent: &;
      border: 2px solid;
      position: relative;
      border-radius: 6px;

      &--green {
        border-color: $green;
        background-color: rgba($green, 0.05);
        #{$root}__day-badge {
          background-color: $green;
        }
      }
      &--pink {
        border-color: $pink;
        background-color: rgba($pink, 0.05);
        #{$root}__day-badge {
          background-color: $pink;
        }
      }
      @media (max-width: $breakpoint-xs-max) {
        padding: 0 15px;
      }
    }

    @media (max-width: $breakpoint-xs-max) {
      opacity: 1;
      flex-basis: calc(100% - 20px);
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  &__start-here-badge {
    position: absolute;
    top: -22px;
    width: 89px;
    height: 21px;
    right: 6px;
    border-radius: 6px 6px 0 0;
    background-color: $pink;
    color: #FFF;
    font-size: 12px;
    text-align: center;
    line-height: 22px;

    @media (max-width: $breakpoint-sm-max) {
      display: none;
    }
  }

  &__tournament-badge {
    position: absolute;
    top: -18px;
    height: 21px;
    left: -2px;
    border-radius: 6px 6px 0 0;
    background-color: $green;
    color: #FFF;
    font-size: 12px;
    text-align: center;
    line-height: 22px;
    padding-right: 10px;
    padding-left: 10px;

    @media (max-width: $breakpoint-sm-max) {
      display: none;
    }
  }

  &__day-badge {
    position: absolute;
    top: -22px;
    height: 21px;
    right: 6px;
    padding: 0 8px;
    border-radius: 6px 6px 0 0;
    color: #FFF;
    font-size: 12px;
    text-align: center;
    line-height: 22px;

    @media (max-width: $breakpoint-xs-max) {
      top: -1px;
      border-radius: 0 0 6px 6px;
    }
  }

  &__time-sections-list{
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 200px;
    margin: 25px -5px 0 -15px;
    padding: 0 5px 50px 15px;
    box-sizing: border-box;
    max-height: calc( 100% - 60px );
    &::-webkit-scrollbar {
      width: 3px;
      background-color: #f9f9fd;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $soft-tone;
    }
    &::-webkit-scrollbar-track {
      background-color: $dark-sec;
    }

    &--list-view {
      padding: 0 10px 0 15px;
    }

    &--reset-height {
      min-height: initial;
      height: initial;
    }

    @media (max-width: $breakpoint-xs-max) {
      min-height: unset;
      height: calc(100% - 80px);
      overflow-y: auto;
    }
  }
  &__fake {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    margin: 0 0 0 -20px;
    opacity: 0;
    transform: translateY(60px);
    transition: all .5s ease-in-out;
    &--active{
      opacity: 0.8;
      transform: translateY(0);
    }

    &-clmn {
      display: flex;
      flex: 0 0 300px;
      flex-direction: column;
      padding: 0 10px;
      transition: all .2s ease-in-out;
      &--active{
        flex: 0 0 450px;
      }
    }

    &-header {
      height: 40px;
      border-radius: 6px;
      background: $mid-tone;
    }

    &-time-section {
      width: 30%;
      height: 30px;
      border-radius: 6px;
      background: $mid-tone;
      margin: 15px 0;
    }

    &-activity {
      padding: 20px;
      margin-bottom: 15px;
      background: $dark-one;
      display: flex;
      flex-direction: column;
      border-radius: 6px;
      position: relative;

      div:nth-child(1) {
        background: $mid-tone;
        width: 40%;
        margin-bottom: 10px;
        height: 30px;
        border-radius: 6px;
      }

      div:nth-child(2) {
        background: $mid-tone;
        width: 90%;
        height: 30px;
        border-radius: 6px;
      }

      &:after{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, .05) 50%,
            rgba(255, 255, 255, 0) 60%
        );
        background-size: 200% 100%;
        background-position-x: 180%;
        animation: 1s loading ease-in-out infinite;
      }
    }

    &-divider {
      width: 100%;
      margin: 10px 0 25px;
      height: 2px;
      background: $mid-tone;
    }
  }
}

//.no-touch{
//  .training-plan__customized-scroll{
    //overflow-y: hidden;
    //&:hover{
    //  overflow-y: auto;
    //}
  //}
//}

.list-complete-enter, .list-complete-leave-to
  /* .list-complete-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateY(60px);
}
.list-complete-leave-active {
  position: absolute;
}

@keyframes loading {
  to {
    background-position-x: -20%;
  }
}
</style>
