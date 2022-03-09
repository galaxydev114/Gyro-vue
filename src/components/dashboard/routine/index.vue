<template>
  <q-card tag="div"
          bordered
          @click.stop="doClick"
          @mouseleave="showDropdown = false"
          v-if="data.title"
          class="routine"
          :class="[
            `routine--${routineCategoryNormalized}`,
            {'routine--done': isCurrentRoutineDone},
            {'routine--is-current-day': isCurrentDay},
            {'routine--is-minimised': minimized},
            {'routine--drag': true},
         ]">

    <div class="routine__done" v-if="isCurrentRoutineDone">
      <c-icon icon="check"
              width="8px" />
    </div>

    <q-card-section :class="{'q-pr-none': minimized}">
      <div class="text-subtitle2 text-uppercase text-gray d-flex items-center justify-between cat-name"
           :class="{
              'opacity-5': isCurrentRoutineDone
      }">
        <routine-category
          :category="data.skill"
          size="20px"
          class="text-weight-regular" />
        <div class="q-ml-auto">
          <slot name="handle" />
        </div>
        <div class="flex" v-if="!minimized">
          <div class="q-ml-md">
            <c-icon v-if="isTagsContainTrackable" icon="progressGreen" width="16px" />
            <div v-else>
              <!-- <c-icon icon="progress" width="16px" class="opacity-25" />
              <q-tooltip anchor="top left"
                        self="bottom middle"
                        max-width="240px"
                        content-style="background-color: #382B4B; font-size: 14px"
                        :offset="[10, 10]">
                Tracking coming soon
              </q-tooltip> -->
            </div>
          </div>
          <div v-if="isExclusive" class="q-ml-md">
            <img src="@/assets/logo-sm.svg" width="16px" />
            <q-tooltip anchor="top left"
                       self="bottom middle"
                       max-width="240px"
                       content-style="background-color: #382B4B; font-size: 14px"
                       :offset="[10, 10]">
              Exclusive
            </q-tooltip>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="routine__center text-left q-py-none">
      <div :class="isCurrentDay ? 'text-h3 text-green' : 'text-h5 text-gray'">
        {{ data.title }}
      </div>
      <div class="flex items-center opacity-7 q-mt-sm">
        <div class="q-mr-md" v-if="isTagsContainFNCS">
          FNCS Training
          <c-icon icon="trophy" style="height: 14px;vertical-align: baseline;"/>
        </div>
        <div class="q-mr-md" v-else-if="isTagsContainCurrentSeason">
          {{seasonTitle}}
        </div>
        <div class="text-left text-weight-regular" v-if="minimized">
          {{ data.totalTime }} MINUTES
        </div>
      </div>
    </q-card-section>
    <q-card-section class="routine__footer items-center text-subtitle2 d-flex">
      <div class="text-left opacity-7 text-weight-regular" v-if="!minimized">
        {{ data.totalTime }} MINUTES
      </div>
      <div class="flex" v-if="minimized">
        <div class="q-mr-md">
          <c-icon v-if="isTagsContainTrackable" icon="progressGreen" width="16px" />
          <div v-else>
            <!-- <c-icon icon="progress" width="16px" class="opacity-25" /> -->
            <!-- <q-tooltip anchor="top left"
                       self="bottom middle"
                       max-width="240px"
                       content-style="background-color: #382B4B; font-size: 14px"
                       :offset="[10, 10]">
              Tracking coming soon
            </q-tooltip> -->
          </div>
        </div>
        <div v-if="isExclusive" class="q-mr-md">
          <img src="@/assets/logo-sm.svg" width="16px" />
        </div>
      </div>
      <div class="text-right q-ml-auto flex items-center no-wrap">
        <div class="q-mr-md" @click.stop="pickAnotherRoutineClicked">
          <c-icon icon="change" />
          <q-tooltip
            v-if="$q.screen.gt.xs"
            anchor="top middle"
            self="bottom middle"
            max-width="240px"
            content-style="background-color: #382B4B; font-size: 14px"
            :offset="[10, 10]"
          >
            Pick another activity
          </q-tooltip>
        </div>
        <div class="q-mr-md"  @click.stop="markCurrentRoutineAsDone(); showDropdown = false" v-if="!isCurrentRoutineDone">
          <c-icon icon="checkRound" />
          <q-tooltip
            v-if="$q.screen.gt.xs"
            anchor="top middle"
            self="bottom middle"
            max-width="240px"
            content-style="background-color: #382B4B; font-size: 14px"
            :offset="[10, 10]"
          >
            Mark as done
          </q-tooltip>
        </div>
        <div class="routine__drop">
          <div class="routine__drop-btn"
               v-outside-click="() => (showDropdown = false)"
               @click.stop="showOptions">
            <span></span>
            <span></span>
            <span></span>
            <q-tooltip
              v-if="$q.screen.gt.xs"
              anchor="top middle"
              self="bottom middle"
              max-width="240px"
              content-style="background-color: #382B4B; font-size: 14px"
              :offset="[10, 10]"
            >
              More options
            </q-tooltip>
          </div>
          <div class="routine__drop-content" v-if="showDropdown">
            <div @click.stop="trackOptionClick('Delete routine'); showModal = 'delete'">Delete</div>
          </div>
        </div>
      </div>
    </q-card-section>

    <n-routine-delete
      :visible="showModal === 'delete'"
      :spinner="deleteInProgress"
      @close="showModal = null"
      @delete="deleteRoutineFromTrainingPlan"
    />
    <n-pick-routine-modal
      v-if="showModal === 'routine'"
      :available-routines="alternativeRoutines"
      @select="pickAnotherRoutineSelected"
      @close="showModal = null"
    />

    <div class="routine__loader" v-if="loading">
      <q-circular-progress
        indeterminate
        size="30px"
        color="dark-pink"
        track-color="mid-tone">
      </q-circular-progress>
    </div>
  </q-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { sendSegmentEvent } from '@/services/segment'
import paymentMixin from '@/mixins/payment.mixin'
import { getRoutineCategoryNormalized } from '@/util/routineHelpers'

export default {
  props: {
    isCurrentDay: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    minimized: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'n-routine-delete': () => import('@/components/dashboard/modal/modal-routine-delete'),
    'n-pick-routine-modal': () => import('@/components/training-routine/pick-another-routine'),
    'routine-category': () => import('@/components/common/activity-category')
  },
  mixins: [paymentMixin],
  data () {
    return {
      showDropdown: false,
      showModal: null,
      loading: false,
      deleteInProgress: false
    }
  },
  computed: {
    ...mapGetters('trainingRoutine', {
      alternativeRoutines: 'getAlternativeRoutines'
    }),
    ...mapState({
      seasonTitle: state => state.fortniteSeason.title
    }),
    isCurrentRoutineDone () {
      return this.data.isCompleted
    },
    routineCategoryNormalized () {
      return getRoutineCategoryNormalized(this.data.skill)
    },
    getTimeRoutine () {
      return this.$date(this.data.dateStart).format('hh:mm A')
    },
    arrowsDragWidth () {
      return this.isCurrentDay ? '20px' : '16px'
    },
    isTagsContainTrackable () {
      return this.data?.tags?.some(tag => tag.toLowerCase() === 'measure')
    },
    isTagsContainFNCS () {
      return this.data?.tags?.some(tag => tag.toLowerCase() === 'fncs training')
    },
    isTagsContainCurrentSeason () {
      return this.$store.getters['fortniteSeason/isTagsContainCurrentSeason'](this.data?.tags)
    },
    isExclusive () {
      return this.data?.isExclusive || false
    }
  },
  methods: {
    ...mapActions({
      markRoutineAsDone: 'trainingRoutine/markRoutineAsDone',
      _deleteRoutineFromTrainingPlan: 'trainingRoutine/deleteRoutineFromTrainingPlan',
      fetchAlternativeRoutines: 'trainingRoutine/fetchAlternativeRoutines'
    }),
    pickAnotherRoutineClicked () {
      if (!this.checkPremiumActionRestriction('showAddNewRoutineModal')) {
        return
      }
      this.trackAction('TP: Click Pick Another routine', this.data)
      this.fetchAlternativeRoutines({ excludeIds: [`${this.data.trainingRoutineId}`], skillBased: this.data.skill }).then(() => {
        this.showModal = 'routine'
      })
    },
    markCurrentRoutineAsDone () {
      this.loading = true
      this.markRoutineAsDone({ routineId: this.data.id }).then(() => {
        this.loading = false
      })
      this.trackOptionClick('Mark as done')
      this.$emit('mark-activity-as-done', this.data)
    },
    trackAction (event, opts = {}) {
      sendSegmentEvent(event, opts)
    },
    doClick () {
      this.$emit('click', this.data.id)
    },
    deleteRoutineFromTrainingPlan () {
      this.deleteInProgress = true
      this._deleteRoutineFromTrainingPlan({ routineId: this.data.id })
        .then(() => {
          setTimeout(() => {
            this.showModal = null
            this.deleteInProgress = false
          }, 1500)
        })
    },
    showOptions () {
      this.showDropdown = !this.showDropdown
      this.trackAction('TP: Click Training routine options', {
        'routine-id': this.data.id,
        date: new Date()
      })
    },
    trackOptionClick (type) {
      this.trackAction('TP: Click Training routine options', {
        'routine-id': this.data.id,
        option: type
      })
    },
    pickAnotherRoutineSelected (selectedRoutine) {
      this.$emit('pick-another-routine-selected', {
        oldRoutine: this.data,
        routine: selectedRoutine
      })
      this.showModal = null
    }
  }
}
</script>

<style lang="scss">
.routine{
  $root: &;
  transition: all .3s ease-in-out;
  min-height: min-content;
  width: 100%;
  position: relative;
  display: block;
  z-index: 3;
  padding: 4px 2px 16px;
  background: $dark-one;
  border: none;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.202551);

  &__done{
    z-index: 3;
    position: absolute;
    top: 0;
    right: 0;
    width: 31px;
    height: 31px;
    text-align: center;
    background: $green;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    display: flex;
    padding: 7px;
    align-items: flex-start;
    justify-content: flex-end;
  }
  &__drop{
    z-index: 99;
    &-btn{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 24px;
      height: 24px;
      span{
        width: 5px;
        height: 5px;
        background: $dark-pink;
        border-radius: 2px;
        margin-bottom: 4px;
      }
      &:hover{
        cursor: pointer;
        span{
          background: $gray;
        }
      }
    }
    &-content{
      position: absolute;
      top: 35px;
      right: 10px;
      @media all and (max-width: $breakpoint-xs-max) {
        top: -35px;
      }
      background: $mid-tone;
      border-radius: 6px;
      z-index: 10;
      width: 200px;
      overflow: hidden;
      border: 1px solid $soft-tone;
      div{
        padding: 6px 10px;
        font-size: 14px;
        overflow: hidden;
        cursor: pointer;
        color: #fff;
        font-weight: normal;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 46px;
        &:hover{
          color: $dark-pink;
          background: $soft-tone;
        }
      }
    }
  }
  &__drag{
    position: absolute;
    top: 10px;
    right: 30px;
  }
  &__loader{
    position: absolute;
    right: 10px;
    top: 10px;
  }
  &__footer{
    max-height: 44px;
    opacity: 1;
    overflow: unset;
    padding-bottom: 0;

    @media all and (min-width: $breakpoint-sm-min) {
      position: absolute;
      top: 99%;
      transform: translateY(-30%);
      opacity: 0;
      left: -5px;
      right: -1px;
      background: inherit;
      max-height: 0;
      overflow: hidden;
      transition: max-height .2s ease-in-out;
      padding: 0 16px;
      height: 44px;
      border-left: 5px solid $soft-tone!important;
      border-top: none!important;
      border-radius: 0 0 6px 6px;
    }
  }
  .text-h3,
  .text-h5{
    font-family: 'Roboto', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif!important;
    text-transform: unset;
  }
  &:hover{
    text-decoration: none;
    background: $dark-sec;
    transform: scale(1.02);
    z-index: 5;
    #{$root}__footer{
      max-height: 44px;
      opacity: 1;
      overflow: unset;
    }
  }
  @media all and (max-width: $breakpoint-xs-max) {
    text-decoration: none;
    background: $dark-sec;
    z-index: 5;
    &--is-current-day {
      background: $dark-sec;
    }
  }
  &:last-child{
    margin-bottom: 0;
  }

  border-left: 5px solid $gray;
  &--mechanical{
    border-left-color: #6533D1;
    #{$root}__footer{
      border-left-color: #6533D1!important;
    }
  }
  &--aiming{
    border-left-color: #E7A957;
    #{$root}__footer{
      border-left-color: #E7A957!important;
    }
  }
  &--warm_up,
  &--editing{
    border-left-color: #E34F4F;
    #{$root}__footer{
      border-left-color: #E34F4F!important;
    }
  }
  &--vod_review{
    border-left-color: #594FE3;
    #{$root}__footer{
      border-left-color: #594FE3!important;
    }
  }
  &--building{
    border-left-color: #AA4FE3;
    #{$root}__footer{
      border-left-color: #AA4FE3!important;
    }
  }
  &--mixed{
    border-left-color: #DD2678;
    #{$root}__footer{
      border-left-color: #DD2678!important;
    }
  }
  &--br{
    border-left-color: #E34F96;
    #{$root}__footer{
      border-left-color: #E34F96!important;
    }
  }
  &--knowledge{
    border-left-color: #3E85C8;
    #{$root}__footer{
      border-left-color: #3E85C8!important;
    }
  }
  &--gamesense{
    border-left-color: #4FD1E3;
    #{$root}__footer{
      border-left-color: #4FD1E3!important;
    }
  }
  &--fighting{
    border-left-color: #E3734F;
    #{$root}__footer{
      border-left-color: #E3734F!important;
    }
  }
  &--stretches{
    border-left-color: #6533D1;
    #{$root}__footer{
      border-left-color: #6533D1!important;
    }
  }
  &--box_fighting{
    border-left-color: #91C426;
    #{$root}__footer{
      border-left-color: #91C426!important;
    }
  }
  &--arena{
    border-left-color: #2CAD6D;
    #{$root}__footer{
      border-left-color: #2CAD6D!important;
    }
  }
  &--rest{
    border-left-color: #3157DE;
    #{$root}__footer{
      border-left-color: #3157DE!important;
    }
  }
  &--mental{
    border-left-color: #91C426;
    #{$root}__footer{
      border-left-color: #91C426!important;
    }
  }
  &--workshop{
    border-left-color: #4FD1E3;
    #{$root}__footer{
      border-left-color: #4FD1E3!important;
    }
  }
  &--link{
    cursor: pointer;
  }
  &--drag{
    cursor: pointer;
  }
  @media all and (min-width: $breakpoint-sm-min) {
    &--is-current-day {
      background: rgba(255, 255, 255, .03);
    }
  }
  &.sortable-chosen{
    opacity: .2!important;
  }
  &--done{
    border: 2px solid $mid-tone;
    border-left: 5px solid $mid-tone;
    box-shadow: unset;
    background: $dark;
    .ribbon {
      opacity: 0.3;
    }
    &:hover{
      background: inherit;
    }
    .text-h5,
    .text-h3{
      color: #5B4F6C!important;
      text-decoration: line-through;
    }
    @media all and (min-width: $breakpoint-xs-max) {
      #{$root}__footer{
        background: $dark;
        border-bottom: 2px solid $mid-tone!important;
        border-right: 2px solid $mid-tone;
        border-left: 5px solid $mid-tone!important;
        margin-right: -1px;
      }
    }
  }
  .opacity-7{
    opacity: .7;
  }
  .ribbon{
    font-weight: 400;
  }
  &--is-minimised{
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    padding: 5px 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover{
      transform: scale(0.99);
    }
    .cat-name{
      width: 110px;
    }
    #{$root}__center{
      max-width: calc(100% - 280px);
      overflow: hidden;
      .text-h5{
        text-overflow: ellipsis;
        overflow: hidden;
        padding-right: 0;
      }
    }
    #{$root}__footer{
      margin-left: auto;
      position: relative;
      transform: unset;
      opacity: 1;
      left: unset;
      bottom: unset;
      border: none!important;
      right: unset;
      max-height: unset;
      height: auto;
      width: auto;
      background: transparent;
    }
  }
}
</style>
