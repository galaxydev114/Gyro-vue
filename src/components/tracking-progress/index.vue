<template>
  <div class="tracking-progress"
       :class="{'tracking-progress--minimized': minimized}">
    <div class="tracking-progress__toggle"
         ref="toggle"
         :class="{'tracking-progress__toggle--anim': animation}"
         @click="toggle()">
      <div class="tracking-progress__toggle-item"
           :class="{'active': active}">
        <c-icon :icon="active ? 'graph' : 'play'"
                :width="active ? '12px' : '8px'"
                class="icon"></c-icon>
      </div>
    </div>
    <div class="tracking-progress__modal"
         :class="{'tracking-progress__modal--active': active}">
      <div class="tracking-progress__modal-wrapper column no-wrap">
        <q-resize-observer @resize="resizeHandler"/>
        <div class="tracking-progress__modal-header col col-shrink">
          <div class="row justify-between items-center">
            <div v-if="$q.screen.gt.sm">
              <div class="text-h2 text-uppercase">
                SESSION PROGRESS
              </div>
              <div class="text-subtitle text-gray opacity-75 q-mb-lg" >
                Here you can check your weekly progress on this session
              </div>
              </div>
            </div>

          <div class="q-mb-sm q-mb-sm-lg row" v-if="$q.screen.width >= 360" style="justify-content: space-between;">
            <div class="row">
              <div class="column">
                <div class="text-dark-pink text-h5 text-uppercase font-rift">
                  current score
                </div>
                <div class="text-h4 text-center q-mt-sm">
                  {{localSubmittedScore || '-'}}
                </div>
              </div>
              <div class="column q-ml-sm q-sm-ml-md">
                <div class="text-green text-h5 text-uppercase font-rift">
                  today avg score
                </div>
                <div class="text-h4 text-center q-mt-sm">
                  {{todayScore || '-'}}
                </div>
              </div>
              <div class="column q-ml-sm q-sm--ml-md">
                <div class="text-soft-tone text-h5 text-uppercase font-rift">
                  today's attempts
                </div>
                <div class="text-h4 text-center q-mt-sm">
                  {{dailyAttemptsCompleted}} / {{dailyAttemptsRequested}}
                </div>
              </div>
              <div class="column q-ml-sm q-sm--ml-md">
                <div class="text-soft-tone text-h5 text-uppercase font-rift">
                  times completed
                </div>
                <div class="text-h4 text-center q-mt-sm">
                  {{allTimeAttemptsCompleted}}
                </div>
              </div>
            </div>
            <c-btn v-if="showEditScore && $q.screen.gt.sm"
                   class="q-mb-lg"
                   outline
                   :bold="false"
                   @click="$emit('edit-score-request')"
                   widthAuto
                   noWidth
                   size="xs">Edit score</c-btn>
          </div>
        </div>
        <div class="tracking-progress__modal-content col relative-position"
             @mouseenter="hasScoresData && $emit('graph-hover')">
          <c-timeline-chart
            v-if="hasScoresData"
            :externalTooltipHandler="handleTooltipUpdate"
            :chartStyle="'height: 100%;'"
            :data="chartData"
            :yLabelHandler="data.isScoreTime ? getValueText : null"
            :reverse="data.isScoreInversed"
            class="tracking-progress__modal-chart"
          />
          <c-empty style="height: 100%; min-height: unset;"
                   :defaultIcon="false"
                   v-else>
            <div class="q-mx-auto q-mt-sm-lg" v-if="$q.screen.gt.sm">
              <img src="@/assets/trainingPlan/icons/progress-pink.svg">
            </div>
            <div class="text-subtitle text-weight-bold text-center opacity-5 q-mt-sm-md q-mb-sm q-mb-sm-lg">
              It seems like you haven't submited any scores<br>on this session.
            </div>
            <div class="q-mb-sm-xl">
              <c-btn @click="$emit('submit')" :size="$q.screen.gt.sm ? 'md' : 'xxs'" noWidth>
                submit score
              </c-btn>
            </div>
          </c-empty>

          <div class="chart-tooltip" ref="tooltip">
            <div class="d-flex justify-between q-col-gutter-x-md q-mb-xs">
              <div v-bind:key="data.dataTitle" v-for="data in tooltipData" class="d-flex col column">
                <div class="text-h4 text-no-wrap" :style="`color: ${data.color};`">{{data.dataTitle}}</div>
              </div>
            </div>
            <div class="text-weight-bold opacity-75">{{tooltipTitle}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { durationStrFromSec } from '@/util/time'

export default {
  props: {
    data: {
      type: Object
    },
    initialActive: {
      type: Boolean
    },
    submittedScore: {
      type: Number
    },
    showEditScore: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'c-empty': () => import('@/components/progress/_empty'),
    'c-timeline-chart': () => import('components/common/timeline-chart-v2.vue')
  },
  data () {
    return {
      active: this.initialActive,
      animation: false,
      minimized: false,
      tooltipTitle: '',
      tooltipData: []
    }
  },
  methods: {
    toggle () {
      this.active = !this.active
      this.$emit('toggle-graph', this.active)
    },
    resizeHandler () {
      this.minimized = this.$q.screen.height < 800 && this.$q.screen.width > 960
    },
    handleTooltipUpdate (context) {
      const tooltipEl = this.$refs.tooltip
      const { chart, tooltip } = context

      // Hide if no tooltip
      if (tooltip.opacity === 0) {
        if (tooltipEl) {
          tooltipEl.style.opacity = 0
        }
        return
      }
      let tooltipData = []
      // Set Text
      if (tooltip.body) {
        tooltipData = tooltip.body.map((el, index) => {
          return {
            color: tooltip.labelColors[index].borderColor,
            dataTitle: this.data.isScoreTime ? durationStrFromSec(tooltip.dataPoints[index].raw.y) : el.lines[0]
          }
        })
      }
      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas
      // Change to data binding. Introduced cause of re-rendering during WIP
      if (tooltipEl) {
        tooltipEl.style.left = positionX + Math.max(30, Math.min(tooltip.caretX - tooltipEl.offsetWidth / 2, chart.canvas.offsetWidth - tooltipEl.offsetWidth)) + 'px'
        tooltipEl.style.top = positionY + tooltip._eventPosition.y + 'px'
        tooltipEl.style.opacity = 1
      }

      this.tooltipTitle = this.$date(tooltip.title[0]).format('MMMM DD') +
        (tooltip.beforeBody.length ? `, ${tooltip.beforeBody} games played` : '')
      this.tooltipData = tooltipData
    },
    getValueText (value) {
      return durationStrFromSec(value)
    }
  },
  computed: {
    hasScoresData () {
      return this.data?.scores?.length
    },
    chartData () {
      const scores = this.data?.scores.slice() || []

      const sortedScores = scores.sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return 1
        return -1
      })
      const initialScore = this.data.isScoreInversed ? Math.max(...scores.map(e => e.score)) : 0
      const date = this.$dayjs(sortedScores[0].date)
        .subtract(1, 'day')
        .format('MM/DD/YYYY')
      sortedScores.unshift({
        date,
        score: initialScore
      })

      const labelsArray = sortedScores.map(el => el.date)
      return {
        labels: labelsArray,
        charts: [
          {
            title: '',
            values: sortedScores.map(el => ({
              x: el.date,
              y: el.score
            })),
            color: '#2CAD6D',
            fillColor: '#2CAD6D',
            isGradient: true
          }
        ]
      }
    },
    allTimeAttemptsCompleted () {
      return this.data?.allTimeAttemptsCompleted
    },
    dailyAttemptsCompleted () {
      return this.data?.dailyAttemptsCompleted
    },
    dailyAttemptsRequested () {
      return this.data?.sessionCounter
    },
    localSubmittedScore () {
      return this.data.isScoreTime ? durationStrFromSec(this.submittedScore) : this.submittedScore?.toFixed(2)
    },
    todayScore () {
      return this.data.isScoreTime ? durationStrFromSec(this.data?.todayScore) : this.data?.todayScore?.toFixed(2)
    }
  },
  watch: {
    active () {
      this.animation = true
      setTimeout(() => {
        this.animation = false
      }, 500)
    },
    initialActive: {
      immediate: true,
      handler (value) {
        this.active = value
      }
    },
    submittedScore: {
      handler (value) {
        this.active = true
      }
    }
  },
  mounted () {
    // Move toggle btn to session bottom
    if (this.$q.screen.width < 576) {
      const parent = document.querySelector('.tracking-progress-toggle-container')
      if (!parent) {
        return
      }
      const btn = this.$refs.toggle
      btn.style.top = '15px'
      btn.style.right = '50%'
      btn.style.margin = '0 -30px 0 0'
      parent.innerHTML = ''
      parent.appendChild(btn)
    }
  },
  beforeDestroy () {
    const parent = document.querySelector('.tracking-progress-toggle-container')
    if (parent) {
      parent.innerHTML = ''
    }
  }
}
</script>

<style lang="scss">
.tracking-progress {
  &__toggle {
    $root: &;
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 0 5px;
    height: 30px;
    border: 2px solid $soft-tone;
    background: $dark-sec;
    display: flex;
    align-items: center;
    width: 50px;
    border-radius: 15px;
    z-index: 999;

    &-item {
      width: 20px;
      height: 20px;
      border-radius: 100%;
      background: $pink;
      display: flex;
      align-items: center;
      justify-content: center;
      left: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: absolute;

      .icon {
        filter: brightness(0) invert(1);
      }

      &.active {
        background: $green;
        left: 3px
      }
    }

    &--anim{
      #{$root}-item{
        transform: scale(1.4);
      }
    }
  }

  &__modal {
    position: absolute;
    z-index: 998;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .4s ease-in-out;
    transform: scale(0);
    transform-origin: 100% 0;

    &--active {
      transform: scale(1);
    }

    &-wrapper {
      padding: 28px 42px 36px;
      background: $dark-sec;
      width: 90%;
      max-height: 95%;
      height: 600px;
      border-radius: 6px;
    }

    &-header {
      display: flex;
      flex-direction: column;
    }

    &-content{
      max-height: 100%;
    }
  }

  &--minimized{
    .tracking-progress__toggle{
      top: 15px;
      right: 15px;
    }
    .tracking-progress__modal-content{
      padding: 12px;
    }
    .tracking-progress__modal-header{
      flex-direction: row;
      display: flex;
      justify-content: space-between;
      .text-subtitle{
        font-size: 14px;
      }
      .row{
        flex-wrap: nowrap;
        white-space: nowrap;
      }
    }
  }
  .chart-tooltip {
    opacity: 0;
    background: #382B4B;
    border: 1.5px solid #433558;
    box-shadow: 0px 16px 32px rgba(0, 0, 0, 0.202551);
    border-radius: 6px;
    position: absolute;
    padding: 8px;
    min-width: 80px;
    pointer-events: none;
    transition: all 0.25s ease-out;
    display: flex;
    flex-direction: column;
    text-align: right;
    white-space: nowrap;
    font-size: 12px;
    h5 {
      margin: 0;
    }
  }

  @media (max-width: $breakpoint-tablet-max) {
    .tracking-progress__modal-wrapper{
      width: 95%;
    }
  }

  @media (max-width: $breakpoint-sm-max) {
    .tracking-progress__modal-wrapper{
      width: 95%;
      padding: 20px;
    }
  }

  @media (max-width: $breakpoint-mobile-max) {
    .tracking-progress__modal-wrapper{
      width: 100%;
      height: 100%;
      padding: 20px;
      max-height: initial;
      .text-h5{
        font-size: 12px;
      }
      .text-h4{
        font-size: 16px;
      }
    }
    .tracking-progress__modal-header{
      justify-content: flex-start
    }
    .tracking-progress__modal-content{
      width: 100%;
      height: 100%;
      max-height: unset;
      padding: 0;
      overflow-x: auto;
      .row{
        justify-content: center;
      }
    }
    @media (min-width: $breakpoint-565-max + 1) {
      // hack for tablet mode
      .tracking-progress__modal-chart{
        width: 100vw;
        max-width: unset !important;
      }
    }
  }
}
</style>
