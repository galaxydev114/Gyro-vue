<template>
  <div @mouseenter="trackAction('Tracking: Progress page: hover over chart', {
          technique: title
        })">
    <div class="flex items-center justify-between q-mb-lg">
      <div class="no-margin text-h4">
        {{ title }}
      </div>
      <!-- <c-btn outline @click="$emit('history')">
        History
      </c-btn> -->
    </div>

    <div class="block-border">
      <div class="full-width text-h5 opacity-75 q-mb-lg flex items-center">
        {{ subtitle }}
        <c-explainer v-if="explainer">
          {{ explainer }}
        </c-explainer>
      </div>
      <c-empty v-if="notTrackableState"
               :noBorder="true"
               :loading="!isPageReady">
        <div class="text-subtitle text-weight-bold text-center opacity-5 q-mt-md q-mb-lg">
          This category is not yet available to be tracked. <br>Novos team is working on it and should be <br>available soon.
        </div>
      </c-empty>
      <c-empty v-else-if="!isPageReady || isEmpty"
               :noBorder="true"
               :loading="!isPageReady">
        <div class="text-subtitle text-weight-bold text-center opacity-5 q-mt-md q-mb-lg">
          It seems like you haven't done any trackable <br>activities on this category.
        </div>
        <div class="q-mt-md q-mb-xl">
          <c-btn @click="$emit('go')">
            Go to training board
          </c-btn>
        </div>
      </c-empty>
      <template v-else>
        <div class="relative-position">
          <c-timeline-chart-tracking
            :labels="chartLabels"
            :data="chartData"
            :chartStyle="chartStyle"
            :externalTooltipHandler="handleTooltipUpdate"
          />
          <div class="arena-placement-tooltip" ref="tooltip">
            <h5>{{tooltipTitle}}</h5>
            <div>
              <div class="q-mt-xs" :key="data.dataTitle" v-for="data in tooltipData">
                <span class="text-no-wrap text-weight-bold" :style="`color: ${data.color};`">{{data.dataTitle}}: {{data.dataValue}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="q-mt-lg">
          <div>
            <span class="text-subtitle font-rift text-weight-bold q-mr-sm">SESSIONS</span>
            <small class="opacity-75">(CLICK TO TOGGLE ON/OFF)</small>
          </div>
          <div class="flex full-width q-mt-sm">
            <div
              class="q-mx-sm flex items-center"
              role="button"
              tabindex="0"
              :style="[exclude.has(chart.title) ? {opacity: 0.5} : '']"
              v-for="chart in trackingSessions"
              v-bind:key="chart.title"
              @click="filterOut(chart.title)"
            >
              <div :style="`border-color: ${chart.color}; background-color: ${chart.color}80`" class="circle q-mr-xs"></div>
              <div>{{chart.title}}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    'c-timeline-chart-tracking': () => import('components/common/timeline-chart-tracking'),
    'c-empty': () => import('@/components/progress/_empty'),
    'c-explainer': () => import('@/components/progress/_explainer')
  },
  props: {
    notTrackableState: {
      type: Boolean,
      default: false
    },
    isPageReady: {
      type: Boolean,
      default: () => false
    },
    data: {
      type: [Array, Object],
      default: () => ([])
    },
    timeView: {
      type: String,
      default: () => 'week'
    },
    chartStyle: {
      type: String,
      default: ''
    },
    dashed: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    explainer: {
      type: String
    }
  },
  data: () => ({
    tooltipTitle: '',
    tooltipData: [],
    exclude: new Set()
  }),
  computed: {
    isEmpty () {
      return !this.data || this.data.length === 0
    },
    trackingSessions () {
      return this.data.map(el => ({
        title: el.title,
        color: el.color
      }))
    },
    chartLabels () {
      const dates = this.data
        .flatMap(data => data.values.map(value => value.x))
        .sort((a, b) => (new Date(a.x) >= new Date(b.x)) ? -1 : 1)
      return Array.from(new Set(dates))
    },
    chartData () {
      return this.data.filter(el => !this.exclude.has(el.title))
    }
  },
  methods: {
    handleTooltipUpdate ({
      chart,
      tooltip
    }) {
      const tooltipEl = this.$refs.tooltip

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
          const [title, value = '0'] = el.lines[0].split(':')
          return {
            color: tooltip.labelColors[index].borderColor,
            dataTitle: title,
            dataValue: value.trim()
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

      this.tooltipTitle = this.$date(tooltip.title[0]).format('MMMM DD')
      this.tooltipData = tooltipData
    },
    getLabelText (index) {
      return this.$date(this.chartData.labels[index]).utc().format('MMM D')
    },
    getValueText (value) {
      return value
    },
    filterOut (title) {
      if (this.exclude.has(title)) {
        this.exclude.delete(title)
        this.trackAction('Tracking: Progress page: enable graph', {
          sessionName: title
        })
      } else {
        this.exclude.add(title)
        this.trackAction('Tracking: Progress page: disable graph', {
          sessionName: title
        })
      }
      this.exclude = new Set(this.exclude)
    }
  }
}
</script>

<style lang="scss">
.arena-placement-tooltip {
  opacity: 0;
  background: #382B4B;
  border: 1.5px solid #433558;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.202551);
  border-radius: 6px;
  position: absolute;
  padding: 10px;
  min-width: 250px;
  pointer-events: none;
  transition: all 0.25s ease-out;
  z-index: 2;

  h5 {
    margin-top: 0;
    margin-bottom: 4px;
  }
}
.circle {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid red;
}
.block-border{
  border: 2px solid #433558;
  border-radius: 10px;
  padding: 35px
}
</style>
