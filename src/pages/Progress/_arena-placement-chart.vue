<template>
  <div>
    <div class="d-flex q-mb-lg">
      <h4 class="no-margin">Placement</h4>
       <c-explainer>
         {{"This graph shows how good you are in surviving in arena within certain placements"}}
       </c-explainer>
    </div>
    <c-empty v-if="!isPageReady || !data" :loading="!isPageReady" />
    <div v-else class="relative-position">
      <c-timeline-chart stacked
      :data="chartData"
      :view="timeView"
      :externalTooltipHandler="handleTooltipUpdate"
      :xLabelHandler="getLabelText"
      :yLabelHandler="getValueText"
      :chartStyle="chartStyle"
      :dashed="dashed"
      :min="0"
    />
    <div class="flex full-width justify-center q-mt-md">
      <div v-for="chart in chartData.charts" v-bind:key="chart.title" class="q-mx-sm flex items-center">
        <div :style="`border-color: ${chart.color}; background-color: ${chart.fillColor}`" class="circle q-mr-xs"></div>
        <div>{{chart.title}}</div>
      </div>
    </div>
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

const palette = [
  {
    line: '#E7A957',
    bg: 'rgba(231, 169, 87, 0.3)'
  },
  {
    line: '#6533D1',
    bg: 'rgba(101, 51, 209, 0.3)'
  },
  {
    line: '#4FD1E3',
    bg: 'rgba(79, 209, 227, 0.3)'
  },
  {
    line: '#DD2678',
    bg: 'rgba(221, 38, 120, 0.3)'
  }
]

// style="{position: 'absolute', top: tooltipPos?.y, left: tooltipPos?.x}"
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
    data: {
      type: Object,
      default: () => ({})
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
            title: '1st',
            values: this.data.userData,
            key: 'placement1',
            color: palette[0].line,
            fillColor: palette[0].bg
          },
          {
            title: 'Top 10%',
            values: this.data.userData,
            key: 'placement2',
            color: palette[1].line,
            fillColor: palette[1].bg
          },
          {
            title: 'Top 25%',
            values: this.data.userData,
            key: 'placement3',
            color: palette[2].line,
            fillColor: palette[2].bg
          },
          {
            title: 'Rest',
            values: this.data.userData,
            key: 'rest',
            color: palette[3].line,
            fillColor: palette[3].bg
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
            dataValue: (el.lines[1] * 100).toFixed(1) + '%'
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
      return this.$date(this.chartData.labels[index]).format('MMM D')
    },
    getValueText (value) {
      return value * 100 + '%'
    }
  }
}
</script>

<style lang="scss">
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
.circle {
  height: 16px;
  width: 16px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid red;
}
</style>
