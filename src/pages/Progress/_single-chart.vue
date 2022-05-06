<template>
  <div class="col-grow">
    <div v-if="this.title" class="d-flex q-mb-lg">
      <h4 class="no-margin">{{ this.title }}</h4>
      <c-explainer>{{ this.description }}</c-explainer>
    </div>
    <c-empty v-if="showEmptyState && (!isPageReady || !data)" :loading="!isPageReady" />
    <div v-else class="relative-position">
      <c-timeline-chart
      :chartStyle="chartStyle"
      :data="chartData"
      :min="dataMin"
      :max="dataMax"
      :view="timeView"
      :externalTooltipHandler="handleTooltipUpdate"
      :xMaxTicks="xMaxTicks"
      :xLabelHandler="getLabelText"
      :yLabelHandler="yLabelFormat"
      :yLabelInside="yLabelInside"
      :dashed="dashed"
    />
    <div class="arena-placement-tooltip" ref="tooltip">
      <h5>{{tooltipTitle}}</h5>
      <div class="d-flex justify-between q-col-gutter-x-md">
        <div v-bind:key="data.dataTitle" v-for="data in tooltipData" class="d-flex col column">
          <p class="text-uppercase text-no-wrap" :style="`color: ${data.color};`">{{data.dataTitle}}</p>
          <p>{{data.dataValue}}</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    'c-timeline-chart': () => import('components/common/timeline-chart-v2.vue'),
    'c-empty': () => import('@/components/progress/_empty'),
    'c-explainer': () => import('@/components/progress/_explainer')
  },
  props: {
    isPageReady: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ''
    },
    description: {
      type: String,
      default: () => ''
    },
    data: {
      type: Object,
      default: () => ({})
    },
    dataMin: {
      type: Number
    },
    dataMax: {
      type: Number
    },
    chartTitle: {
      type: String,
      default: ''
    },
    xMaxTicks: {
      type: Number,
      default: null
    },
    yLabelFormat: {
      type: Function,
      default: x => x
    },
    yLabelInside: {
      type: Boolean,
      default: false
    },
    formatTooltipY: {
      type: Boolean,
      default: false
    },
    xLabelFormat: {
      type: Function
    },
    timeView: {
      type: String,
      default: () => 'week'
    },
    chartStyle: {
      type: String,
      default: ''
    },
    showEmptyState: {
      type: Boolean,
      default: true
    },
    dashed: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    tooltipTitle: '',
    tooltipData: []
  }),
  computed: {
    chartData () {
      const labelsArray = this.data.userData.map(el => el.x)
      return {
        labels: labelsArray,
        charts: [
          {
            title: this.chartTitle,
            values: this.data.userData,
            color: '#DD2678'
          }
        ],
        generateTooltipInfo: {
          beforeBody: (tooltipItems) => {
            return tooltipItems[0].raw.matchesPlayed
          },
          label: (tooltipItem) => {
            return [tooltipItem.dataset.label, tooltipItem.formattedValue]
          }
        }
      }
    }
  },
  methods: {
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
            dataTitle: el.lines[0],
            dataValue: this.formatTooltipY ? this.yLabelFormat(el.lines[1]) : el.lines[1]
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
    getLabelText (index) {
      return this.xLabelFormat?.(this.chartData.labels[index]) ||
        this.$date(this.chartData.labels[index]).format('MMM D')
    }
  }
}
</script>

<style lang="scss" >
.arena-placement-tooltip {
  opacity: 0;
  background: #382B4B;
  border: 1.5px solid #433558;
  box-shadow: 0px 16px 32px rgba(0, 0, 0, 0.202551);
  border-radius: 6px;
  position: absolute;
  padding: 10px;
  min-width: 250px;
  pointer-events: none;
  transition: all 0.25s ease-out;
  h5 {
    margin-top: 0px;
    margin-bottom: 4px;
  }
  p {
    margin: 0px;
  }
}
</style>
