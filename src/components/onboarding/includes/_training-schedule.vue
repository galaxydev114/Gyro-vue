<template>
  <div class="week-schedule-select">
    <div v-show="!mouseClick && mouseIn && !isHovering && fakeEventStyle && $q.screen.gt.sm"
         class="vuecal__event vuecal__event--fake"
         :style="fakeEventStyle">
      <div class="vuecal__event-delete" />
    </div>
    <div class="relative-position full-height">
      <vue-cal
        id="vuecal"
        ref="vuecal"
        :small="$q.screen.lt.sm"
        hide-view-selector
        hide-title-bar
        :disable-views="['years', 'year', 'month', 'day']"
        :editable-events="{ title: false, drag: $q.screen.gt.sm, resize: $q.screen.gt.sm, delete: $q.screen.gt.sm, create: $q.screen.gt.sm }"
        :time-cell-height="45"
        :events="computedEventsData"
        :snap-to-time="60"
        :twelve-hour="true"
        :on-event-create="eventCreation"
        @mousemove.native="updateDummy"
        @mousedown.native="mouseClick = true"
        @mouseup.native="mouseClick = false"
        @mouseleave.native="mouseIn = false"
        @mouseenter.native="mouseIn = true"
        @event-mouse-enter="isHovering = true"
        @event-mouse-leave="isHovering = false"
        @event-drag-create="eventAction('event-drag-create', $event)"
        @event-create="isHovering = true"
        @event-drop="eventAction('event-drop', $event)"
        @event-duration-change="eventAction('event-duration-change', $event)"
        @cell-dblclick="eventAction('event-dblClick-create', $event)"
        @event-delete="eventAction('event-delete', $event)"
        @ready="onReady($event)">
      </vue-cal>
      <div class="lt-sm absolute" style="top: 0; left: 0; right: 0; bottom: 0;z-index: 999; pointer-events: none;"></div>
    </div>
    <div class="full-width q-mt-lg q-mt-md-xl text-center justify-center" v-if="!hideNext">
      <q-btn unelevated
             class="q-btn-main"
             :class="{'full-width': $q.screen.lt.sm}"
             color="dark-pink"
             @click="clickNext">
        Next
      </q-btn>
    </div>

    <n-modal :visible="showExplainer" @close="showExplainer = false" size="lg" v-if="!hideNext">
      <div class="time-slot-explainer text-center q-pa-lg">
        <div class="text-subtitle1 font-rift text-pink">
          your schedule is ready!
        </div>

        <div class="text-h3 font-roboto q-my-md" v-if="$q.screen.gt.xs" style="text-transform: unset">
          We created a training schedule<br/>
          based on your choices. Edit it if you want.
        </div>

        <template v-else>
          <div class="text-h3 font-roboto q-my-md" style="text-transform: unset">
            We made a suggested<br/>
            training schedule based on<br/>
            your choices.
          </div>
          <div class="text-center">
            You can change it at any time from the<br />
            training board.
          </div>
        </template>

        <div class="row q-gutter-md q-mt-lg" v-if="$q.screen.gt.xs">
          <div class="col q-mx-md">
            <q-img src="@/assets/gifs/add-time-slot.gif" />
            <div class="q-mt-sm text-gray">
              Double click on an empty time frame to add a new playing time slot
            </div>
          </div>
          <div class="col q-mx-md">
            <q-img src="@/assets/gifs/change-time-slot.gif" />
            <div class="q-mt-sm text-gray">
              You can edit playing time slots by moving the  edges up and down
            </div>
          </div>
        </div>
        <div class="full-width text-center q-mt-xl">
          <c-btn class="q-mx-auto" style="width: 150px" @click="showExplainer = false">
            Got It
          </c-btn>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/drag-and-drop.js'
import { debounce } from 'quasar'
import { sendSegmentEvent } from '@/services/segment'

export default {
  props: {
    eventsData: {
      type: Array,
      default: () => []
    },
    hideNext: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VueCal,
    'n-modal': () => import('@/components/dashboard/modal')
  },
  data () {
    return {
      internalEventsData: [],
      isHovering: false,
      mouseIn: false,
      fakeEventStyle: null,
      showExplainer: false,
      mouseClick: false,
      deleteEventFunction: null,
      selectedEvent: null
    }
  },

  created () {
    this.trackAction('Get Initial Time Slots', this.eventsData)
  },

  mounted () {
    setTimeout(() => {
      this.showExplainer = true
    }, 300)
  },

  computed: {
    computedEventsData () {
      return this.eventsData.map((event) => {
        const startTime = this.$date()
          .startOf('isoWeek')
          .add(event.startDay - 1, 'days')
          .format('YYYY-MM-DD') + ' ' + event.startHour // HH:mm
        const endTime = this.$date(startTime)
          .add(event.length, 'hours')
          .format('YYYY-MM-DD HH:mm')
        return {
          start: startTime,
          end: endTime,
          title: 'Fortnite time'
        }
      })
    },
    computedOutEventsData () {
      return this.internalEventsData.map((event) => {
        const startMoment = this.$date(event.start)
        const endMoment = this.$date(event.end)
        return {
          startDay: startMoment.isoWeekday(),
          startHour: startMoment.format('HH:mm'),
          length: endMoment.diff(startMoment, 'hours', true),
          title: 'Fortnite time'
        }
      })
    }
  },

  methods: {
    eventCreation (event, deleteEventFunction) {
      event.title = 'Fortnite time'
      this.selectedEvent = event
      this.deleteEventFunction = deleteEventFunction
      return event
    },
    updateDummy (e) {
      debounce(async (e) => {
        if (!this.fakeEventStyle) {
          this.fakeEventStyle = {}
        }

        const target = document.elementFromPoint(e.clientX, e.clientY)
        if (!target?.classList.contains('vuecal__cell-content')) {
          return
        }

        const targetHome = document.getElementsByClassName('week-schedule-select')[0]
        const homebbox = targetHome.getBoundingClientRect()
        const bbox = target.getBoundingClientRect()

        Vue.set(this.fakeEventStyle, 'width', `${bbox.width}px`)
        Vue.set(this.fakeEventStyle, 'left', `${bbox.left - homebbox.left + 24}px`)
        Vue.set(this.fakeEventStyle, 'top', `${e.clientY - (this.hideNext ? 50 : 0)}px`)
      }, 50)(e)
    },
    clickNext () {
      this.$emit('next', this.computedOutEventsData)
    },

    eventAction (type, event) {
      if (this.$q.screen.lt.sm) {
        return
      }
      let m
      let h
      let minutes
      let hours
      switch (type) {
        case 'event-create':
          this.internalEventsData.push(event)
          this.isHovering = false
          break

        case 'event-delete':
          this.internalEventsData = this.internalEventsData.filter(el => el._eid !== event._eid)
          this.isHovering = false

          this.trackAction('Remove Time Slot', {
            day: new Date(event.start).toUTCString().split(',')[0],
            startHour: new Date(event.start).getUTCHours(),
            endHour: new Date(event.end).getUTCHours(),
            timeZoneOffset: `${new Date(event.start).getTimezoneOffset() / 60} hours`
          })

          break

        case 'event-drop': {
          const oldEvent = event.originalEvent
          const newEvent = event.event

          this.trackAction('Edit Time Slot', {
            before: {
              day: new Date(oldEvent.start).toUTCString().split(',')[0],
              startHour: new Date(oldEvent.start).getUTCHours(),
              endHour: new Date(oldEvent.end).getUTCHours(),
              timeZoneOffset: `${new Date(oldEvent.start).getTimezoneOffset() / 60} hours`
            },
            after: {
              day: new Date(newEvent.start).toUTCString().split(',')[0],
              startHour: new Date(newEvent.start).getUTCHours(),
              endHour: new Date(newEvent.end).getUTCHours(),
              timeZoneOffset: `${new Date(newEvent.start).getTimezoneOffset() / 60} hours`
            }
          })

          this.internalEventsData = this.internalEventsData.map(el => {
            return el._eid === event.event._eid ? event.event : el
          })
          break
        }

        case 'event-drag-create': {
          const { start, end } = event
          const eventDiff = this.$date(end).diff(this.$date(start), 'minutes', true)
          if (eventDiff === 0) {
            this.deleteEventFunction()
            return false
          }
          this.trackAction('Create Time Slot', {
            day: new Date(start).toUTCString().split(',')[0],
            startHour: new Date(start).getUTCHours(),
            endHour: new Date(end).getUTCHours(),
            timeZoneOffset: `${new Date(start).getTimezoneOffset() / 60} hours`
          })
          this.internalEventsData.push(event)
          return event
        }

        case 'event-duration-change': {
          const oldEvent = event.originalEvent
          const newEvent = event.event

          this.trackAction('Edit Time Slot', {
            before: {
              day: new Date(oldEvent.start).toUTCString().split(',')[0],
              startHour: new Date(oldEvent.start).getUTCHours(),
              endHour: new Date(oldEvent.end).getUTCHours(),
              timeZoneOffset: `${new Date(oldEvent.start).getTimezoneOffset() / 60} hours`
            },
            after: {
              day: new Date(newEvent.start).toUTCString().split(',')[0],
              startHour: new Date(newEvent.start).getUTCHours(),
              endHour: new Date(newEvent.end).getUTCHours(),
              timeZoneOffset: `${new Date(newEvent.start).getTimezoneOffset() / 60} hours`
            }
          })

          this.internalEventsData = this.internalEventsData.map(el => {
            return el._eid === event.event._eid ? event.event : el
          })
          break
        }

        case 'event-dblClick-create': {
          minutes = event.getMinutes()
          hours = event.getHours()

          m = (parseInt((minutes + 15) / 30) * 30) % 60
          h = minutes > 46 ? (hours === 23 ? 0 : ++hours) : hours
          event.setHours(h, m, 0)

          const tempEvent = this.$refs.vuecal.createEvent(event, 90, { title: 'Fortnite time' })

          const endDate = new Date(event)
          endDate.setUTCHours(event.getUTCHours() + 1)

          this.trackAction('Create Time Slot', {
            day: new Date(event).toUTCString().split(',')[0],
            startHour: new Date(event).getUTCHours(),
            endHour: endDate.getUTCHours(),
            timeZoneOffset: `${new Date(event).getTimezoneOffset() / 60} hours`
          })
          this.internalEventsData.push(tempEvent)
          break
        }
      }

      this.$emit('change', this.computedOutEventsData)
    },

    onReady (readyEvent) {
      this.internalEventsData = readyEvent.events
      this.scrollToFirstEventTime()
    },

    scrollToFirstEventTime () {
      const calendar = document.querySelector('#vuecal .vuecal__bg')
      const earliestEvent = this.internalEventsData?.reduce((a, b) => {
        return a.start < b.start ? a.start : b.start
      }, {})
      const targetHour = this.$date(earliestEvent).hour() - 1
      calendar.scrollTo({ top: targetHour * 45, behavior: 'smooth' })
    },

    trackAction (event, opts = {}) {
      sendSegmentEvent(event, opts)
    }
  }
}
</script>

<style lang="scss">
.week-schedule-select{
  height: calc( var(--app-height) - 300px );
  margin-top: 30px;
  @media all and (max-width: $breakpoint-sm-max) {
    height: calc( var(--app-height) - 370px );
  }
  .vuecal{
    $vuecal: &;
    cursor: pointer;
    box-shadow: none;
    &__time-column{
      width: 60px;
      z-index: 99;
      .vuecal__time-cell{
        display: flex;
        flex-direction: column;
        text-align: left;
        color: $grey;
        font-size: 12px;
      }
      .vuecal__time-cell-line{
        &:before{
          border-color: $soft-tone;
          left: 60px;
        }
      }
    }
    &__cell{
      padding: 0 3px;
      &:before{
        display: none;
      }
      &--today,
      &--selected{
        background: unset;
        z-index: unset;
      }
      &:nth-child(odd){
        background: rgba(41, 32, 68, .6);
      }
      &-content{
        z-index: 999;
      }
    }
    &__no-event{
      display: none;
    }
    &__weekdays-headings{
      border: none;
    }
    &__event-resize-handle{
      background: rgba(0, 0, 0, .2);
    }
    &__event{
      border: 2px solid $green;
      background: rgba(44, 173, 109, .4);
      border-radius: 8px;
      padding: 0 5px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      font-weight: bold;
      text-align: left;
      color: $grey;
      transition: all .3s ease;
      position: relative;
      .vuecal__event-delete {
        transform: translateY(0) rotate(45deg) !important;
        background: none;
        position: absolute;
        bottom: 7px;
        top: unset;
        left: unset;
        right: 6px;
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        border-radius: 100%;
        text-indent: 100%;
        white-space: nowrap;
        overflow: hidden;
        font-size: 1px;
        color: transparent;
        opacity: .7;
        &:before {
          content: "";
          position: absolute;
          background-color: #DFDAD7;
          width: 10px;
          height: 2px;
          top: 50%;
          left: 50%;
          transform: translateY(-50%) translateX(-50%);
        }
        &:after {
          content: "";
          position: absolute;
          background-color: #DFDAD7;
          width: 2px;
          height: 10px;
          top: 50%;
          left: 50%;
          transform: translateY(-50%) translateX(-50%);
        }
        &:hover{
          opacity: 1;
        }
      }
      &:hover{
        padding-bottom: 15px;
        .vuecal__event-delete{
          bottom: 17px;
        }
      }

      &--fake {
        position: absolute;
        z-index: 999;
        height: 45px;
        border-color: #a590a8ad;
        background: #7a6a8681;
        pointer-events: none;
        transition: none;
        .vuecal__event-delete{
          margin: auto;
          position: relative;
          transform: initial !important;
          bottom: 0px;
          right: 0px;
        }
      }
    }
    .weekday-label{
      span{
        display: none;
        &.full{
          display: block;
          font-weight: bold;
        }
        @media all and (max-width: $breakpoint-xs-max) {
          &.full{
            display: none;
          }
          &.small{
            display: block;
          }
        }
      }
    }
    @media all and (max-width: $breakpoint-xs-max) {
      &__event-time,
      &__event-title{
        display: none;
      }
    }
  }

}
.time-slot-explainer{
  width: 100%;
  .q-img{
    border-radius: 6px;
    border: 1px solid $soft-tone;
  }
}
</style>
