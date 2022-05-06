<template>
  <LineChart ref="chartRef" :style="chartStyle" :chartData="chartJSChartData" :options="options"/>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { CrosshairPlugin } from 'chartjs-plugin-crosshair'

Chart.register(CrosshairPlugin, ...registerables)
import { LineChart } from 'vue-chart-3'

export default {
  name: 'TimelineChart',
  components: {
    LineChart
  },
  data () {
    return {
      chartInstance: null,
      chartCtx: null,
      chartJSChartData: null
    }
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    externalTooltipHandler: {
      type: Function,
      default: null
    },
    xMaxTicks: {
      type: Number,
      defaut: null
    },
    xLabelHandler: {
      type: Function,
      default: null
    },
    yLabelHandler: {
      type: Function,
      default: null
    },
    yLabelInside: {
      type: Boolean,
      default: false
    },
    stacked: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: undefined
    },
    min: {
      type: Number,
      default: undefined
    },
    chartStyle: {
      type: String,
      default: ''
    },
    dashed: {
      type: Boolean,
      default: false
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    options () {
      const config = {
        // animation: false,
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
          hover: {
            intersect: false
          }
        },
        plugins: {
          tooltip: {
            enabled: !this.externalTooltipHandler,
            callbacks: this.data.generateTooltipInfo,
            intersect: false,
            external: this.externalTooltipHandler
          },
          legend: {
            display: false
          },
          crosshair: {
            line: {
              color: '#F66', // crosshair line color
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
              maxTicksLimit: this.xMaxTicks || this.$q.screen.lt.sm ? 6 : 10,
              maxRotation: 0,
              color: 'rgba(223, 218, 231, 0.3)',
              ...(this.xLabelHandler && {
                callback: (value, index, values) => {
                  return this.xLabelHandler(index)
                }
              })
            },
            grid: {
              borderColor: 'rgba(255, 255, 255, 0.15)',
              drawBorder: true,
              display: false,
              tickLength: 0
            }
          },
          y: {
            reverse: this.reverse,
            max: this.max,
            min: this.min,
            ticks: {
              maxTicksLimit: 7,
              color: 'rgba(223, 218, 231, 0.3)',
              ...(this.yLabelInside && {
                mirror: true,
                align: 'end'
              }),
              ...(this.yLabelHandler && {
                callback: (value, index, values) => {
                  return this.yLabelHandler(value, index, values)
                }
              })
            },
            stacked: this.stacked,
            grid: {
              borderColor: 'rgba(255, 255, 255, 0.15)',
              display: true,
              drawBorder: true,
              color: function (context) {
                if (context.index === 0) {
                  return 'rgba(0, 0, 0, 0)'
                } else {
                  return 'rgba(255, 255, 255, 0.15)'
                }
              },
              borderDash: [6, 4]
            },
            position: 'left'
          }
        },
        elements: {
          point: {
            radius: 0,
            hoverRadius: 0
          },
          line: {
            borderDash: this.dashed ? [6, 4] : []
          }
        }
      }
      if (this.data.yAxisIDs?.length) {
        const { yAxisIDs } = this.data
        yAxisIDs.forEach((type, idx) => {
          config.scales[type.id] = {
            max: this.max,
            min: this.min,
            ticks: {
              maxTicksLimit: 7,
              color: type.color,
              ...(this.yLabelInside && {
                mirror: true,
                align: 'end'
              }),
              ...(this.yLabelHandler && {
                callback: (value, index, values) => {
                  return this.yLabelHandler(value, index, values)
                }
              })
            },
            stacked: this.stacked,
            grid: {
              borderColor: 'rgba(255, 255, 255, 0.15)',
              display: true,
              drawBorder: true,
              color: function (context) {
                if (context.index === 0) {
                  return 'rgba(0, 0, 0, 0)'
                } else {
                  return 'rgba(255, 255, 255, 0.15)'
                }
              },
              borderDash: [6, 4]
            },
            position: (idx % 2 === 0) ? 'left' : 'right'
          }
        })
      }

      return config
    }
  },
  methods: {
    calculateChartData () {
      this.chartJSChartData = {
        labels: this.data.labels || [],
        datasets: this.data.charts?.map((el, idx) => {
          const datasetData = el.values
          const hasUncertainVals = Boolean(datasetData.find(el => el.uncertain))
          const hasMulticolorLine = Boolean(datasetData.find(el => el.multicolorLineColor))

          const data = {
            label: el.title,
            data: datasetData,
            spanGaps: true,
            parsing: el.key ? { yAxisKey: el.key } : undefined,
            borderColor: el.color,
            borderWidth: el.borderWidth || 2,
            yAxisID: el.yAxisID ?? 'y'
          }

          if (hasMulticolorLine) {
            data.segment = {
              borderColor: (ctx) => ctx.p1.raw.multicolorLineColor
            }
          }

          if (hasUncertainVals) {
            if (!data.segment) {
              data.segment = {}
            }
            data.segment = {
              ...data.segment,
              borderDash: (ctx) => ctx.p1.raw.uncertain ? [6, 4] : []
            }
          }

          if (el.fillColor) {
            data.backgroundColor = el.fillColor
            data.fill = {
              target: idx === 0 ? (this.reverse ? 'start' : 'origin') : idx - 1
            }

            if (el.isGradient) {
              data.fill.above = el.isGradient ? this.getFillColor(el.fillColor) : ''
            }
          }

          return data
        })
      }
    },
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
    }
  },
  mounted () {
    if (this.$refs.chartRef) {
      this.chartInstance = this.$refs.chartRef.chartInstance
      this.chartCtx = this.$refs.chartRef.chartInstance.ctx
    }
    this.calculateChartData()
  },
  watch: {
    data: {
      immediate: true,
      handler (val) {
        this.calculateChartData()
      }
    }
  }
}

</script>
