<template>
  <LineChart
    ref="chartRefTracking"
    :style="chartStyle"
    :chartData="chartJSChartData"
    :options="options"
  />
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { CrosshairPlugin } from 'chartjs-plugin-crosshair'
import { LineChart } from 'vue-chart-3'
import { maxBy, findIndex } from 'lodash'

Chart.register(CrosshairPlugin, ...registerables)

export default {
  name: 'TimelineTrackingChart',
  components: { LineChart },
  props: {
    labels: {
      type: Array,
      default: () => [],
      required: true
    },
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    externalTooltipHandler: {
      type: Function,
      default: null
    },
    chartStyle: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    chartCtx: null,
    chartInstance: null,
    chartJSChartData: null
  }),
  mounted () {
    if (this.$refs.chartRefTracking) {
      this.chartInstance = this.$refs.chartRefTracking.chartInstance
      this.chartCtx = this.$refs.chartRefTracking.chartInstance.ctx
    }

    this.calculateChartData()
  },
  computed: {
    yAxisScales () {
      const scales = {}
      const maxArr = this.data?.map((el, id) => ({ id, max: Number(maxBy(el.values, v => v.y)?.y) }))
        .sort((el1, el2) => el2.max - el1.max)
      for (const [index, chart] of this.data?.entries()) {
        const key = chart.yAxisID
        const valuePosition = findIndex(maxArr, { id: index })
        scales[key] = {
          reverse: chart.isScoreInversed,
          display: true,
          beginAtZero: true,
          grace: valuePosition === -1 ? 0 : maxArr[valuePosition].max * valuePosition,
          type: 'linear',
          ticks: {
            display: false,
            maxTicksLimit: this.$q.screen.lt.sm ? 3 : 5,
            padding: 10
          },
          grid: {
            borderColor: 'rgba(255, 255, 255, 0.15)',
            display: true,
            drawBorder: false,
            drawOnChartArea: key === 'y0',
            borderDash: [4],
            drawTicks: false,
            color: (context) => context.index === 0
              ? 'rgba(0, 0, 0, 0)'
              : 'rgba(255, 255, 255, 0.15)'
          }
        }
      }

      return scales
    },

    options () {
      return {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
          mode: 'nearest',
          intersect: false,
          hover: {
            intersect: false
          }
        },
        plugins: {
          tooltip: {
            enabled: !this.externalTooltipHandler,
            external: this.externalTooltipHandler
          },
          legend: {
            display: false
          },
          crosshair: {
            line: {
              color: '#FFF', // crosshair line color
              width: 1,
              dashPattern: [6, 4] // crosshair line width
            },
            zoom: {
              enabled: false
            },
            sync: {
              enabled: false
            },
            snap: {
              enabled: true
            }
          }
        },
        overrides: {
          line: {
            spanGaps: true
          }
        },
        scales: {
          x: {
            type: 'category',
            ticks: {
              maxTicksLimit: this.$q.screen.lt.sm ? 6 : 10,
              maxRotation: 0,
              padding: 10,
              color: 'rgba(223, 218, 231, 0.3)',
              callback: (value) => {
                return this.$date(this.labels[value]).format('MMM D')
              }
            },
            grid: {
              borderColor: 'rgba(255, 255, 255, 0.15)',
              drawBorder: true,
              display: false,
              tickLength: 0
            }
          },
          ...this.yAxisScales
        },
        elements: {
          line: {
            borderDash: []
          }
        }
      }
    }
  },

  methods: {
    /**
     * @return {CanvasGradient | undefined}
     */
    getFillColor (color) {
      if (!this.chartCtx) return

      const x0 = this.chartInstance.width / 2,
        y0 = 0,
        x1 = this.chartInstance.width / 2,
        y1 = this.chartInstance.height

      const gradient = this.chartCtx.createLinearGradient(x0, y0, x1, y1)
      gradient.addColorStop(0, `${color}80`)
      gradient.addColorStop(1, '#00000000')

      return gradient
    },

    calculateChartData () {
      const labels = this.labels.filter(Boolean) || []

      this.chartJSChartData = {
        labels,
        datasets: this.data.map((el, idx) => {
          return {
            label: el.title,
            data: el.values,
            isScoreTime: el.isScoreTime,
            borderColor: el.color,
            borderWidth: el.borderWidth || 2,
            fill: {
              target: idx === 0 ? 'origin' : idx - 1,
              above: this.getFillColor(el.color)
            },
            segment: {
              borderDash: () => el.isPredicted ? [6, 4] : []
            },
            yAxisID: el.yAxisID
          }
        })
      }
    }
  },

  watch: {
    data: {
      immediate: true,
      handler () {
        this.calculateChartData()
      }
    }
  }
}

</script>
