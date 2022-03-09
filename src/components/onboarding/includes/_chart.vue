<template>
  <div id="chart"
       class="chart"
       :class="{'chart--show': readyToShow}"
       ref="chart" style="width: 100%; max-width: 100%">
    <apexchart type="area"
               ref="apexchart"
               height="440"
               width="100%"
               class="apexchart-container"
               :options="chartOptions"
               :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

const NOVOS = 'NOVOS'

export default {
  props: {
    userNick: {
      type: String,
      default: ''
    },
    userScore: {
      type: Number,
      default: 320
    },
    nextScore: {
      type: Number,
      default: 460
    },
    topPlayer: {
      type: Object,
      default: () => ({ nick: 'top player', score: 800 })
    }
  },
  components: {
    apexchart: VueApexCharts
  },
  data () {
    return {
      readyToShow: false,
      windowWidth: window.innerWidth,
      chartInnerWidth: null,
      series: [{
        type: 'area',
        data: [0, 0, 0]
      }],
      chartOptions: {
        chart: {
          type: 'area',
          height: '400px',
          width: '100%',
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        tooltip: {
          enabled: false
        },
        colors: ['#DD2678', '#fff'],
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          labels: {
            formatter: (index) => {
              switch (index) {
                case 1:
                  return 'Beginner'
                case 2:
                  return 'Average'
                case 3:
                  return 'Pro'
              }
            },
            show: true,
            style: {
              cssClass: 'chart__categories-text'
            }
          },
          axisBorder: {
            show: false
          }
        },
        yaxis: {
          opposite: true,
          show: false,
          axisBorder: {
            show: false
          }
        },
        grid: {
          show: true,
          borderColor: '#433558',
          strokeDashArray: 5,
          opacity: 0.5,
          position: 'back',
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        annotations: {
          position: 'front',
          ...this.getAnnotations()
        }
      }
    }
  },
  watch: {
    windowWidth (newWidth, oldWidth) {
      this.chartInnerWidth = this.$refs.chart?.querySelector('.apexcharts-inner').getBBox().width
      this.updateAnnotations()
    }
  },

  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
      this.chartInnerWidth = this.$refs.chart?.querySelector('.apexcharts-inner').getBBox().width
      this.updateAnnotations()
    })
    setTimeout(() => {
      this.readyToShow = true
    }, 300)
    setTimeout(() => {
      this.$refs.apexchart && this.$refs.apexchart.updateSeries([{
        data: [0, 20, 0]
      }])
    }, 600)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    onResize () {
      this.windowWidth = window.innerWidth
    },
    updateAnnotations () {
      this.chartOptions = this.getChartOptions()
    },
    getChartIconSvg (nick, style) {
      const found = nick.match(/[^a-zA-Z]*(?<initial>[a-zA-Z])/)
      const initial = found?.groups.initial.toUpperCase() || 'A'
      return `data:image/svg+xml;utf8,
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1"
          x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"
          xml:space="preserve" height="100px" width="100px"
        >
          <style>
            .small {
              font: bold 60px sans-serif;
              fill: white;
              dominant-baseline: middle;
              text-anchor: middle;
            }
          </style>
          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="${style.color}"/>
              <stop offset="100%" stop-color="${style.color2 || '#7C277E'}"/>
            </linearGradient>
          </defs>
          <g>
            <circle cx="50" cy="50" r="45" fill="url(#grad)" stroke="${style.color}" stroke-width="10" />
            ${nick === NOVOS
            ? `<svg width="50" height="50" x="24" y="20" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.0199336 12.8232L0 0.346574C0 0.154033 0.179402 0 0.378738 0H0.677741C0.877076 0 1.01661 0.134779 1.17608 0.288812L8.8505 7.0945V7.39358V3.52557C8.8505 3.33302 9.00997 3.15974 9.22924 3.15974H11.6213C11.8206 3.15974 12 3.33302 12 3.52557V13.035C12 13.2661 11.8206 13.3816 11.6213 13.3816H11.4219C11.2226 13.3816 11.0831 13.3238 10.9236 13.1698L3.1495 6.52438V12.8232C3.1495 13.0158 2.99003 13.1891 2.77076 13.1891H0.398671C0.199336 13.1891 0.0199336 13.0158 0.0199336 12.8232Z" fill="white"/>
              </svg>`
            : `<text x="50%" y="52.5%" class="small">${initial}</text>`
            }
          </g>
        </svg>`.replaceAll('#', '%23')
    },

    getChartOptions () {
      return {
        chart: {
          type: 'area',
          height: '400px',
          width: '100%',
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        tooltip: {
          enabled: false
        },
        colors: ['#DD2678', '#fff'],
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          labels: {
            formatter: (index) => {
              switch (index) {
                case 1:
                  return 'Beginner'
                case 2:
                  return 'Average'
                case 3:
                  return 'Pro'
              }
            },
            show: true,
            style: {
              cssClass: 'chart__categories-text'
            }
          },
          axisBorder: {
            show: false
          }
        },
        yaxis: {
          opposite: true,
          show: false,
          axisBorder: {
            show: false
          }
        },
        grid: {
          show: true,
          borderColor: '#433558',
          strokeDashArray: 5,
          opacity: 0.5,
          position: 'back',
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        annotations: {
          position: 'front',
          ...this.getAnnotations()
        }
      }
    },

    getYPAdding (x) {
      const lowerBound = 0, upperBound = this.chartInnerWidth

      const normalY = (x, mean, stdDev) => Math.exp((-0.5) * Math.pow((x - mean) / stdDev, 2))

      const getMean = (lowerBound, upperBound) => (upperBound + lowerBound) / 2

      // distance between mean and each bound of a 95% confidence interval
      // is 2 stdDeviation, so distance between the bounds is 4
      const divider = this.$q.screen.xs ? 3 : 4 // up icon/line on chart for mobile devices
      const getStdDeviation = (lowerBound, upperBound) => (upperBound - lowerBound) / divider

      const mean = getMean(lowerBound, upperBound)
      const stdDev = getStdDeviation(lowerBound, upperBound)

      return 350 - (normalY(x, mean, stdDev) * 350)
    },

    getAnnotations () {
      const iconSize = 32
      const iconAnotLineWidth = 2

      const data = [
        { nick: this.userNick, score: this.userScore, style: { color: '#2CAD6D', color2: 'green' } },
        { nick: NOVOS, score: this.nextScore, style: { color: '#DD2678' } },
        { ...this.topPlayer, style: { color: '#594FE3' } }
      ]
      const xaxis = data.map(({ nick, score: pos, style: { color } }) => {
        pos = pos / 1200 * this.chartInnerWidth
        return ({
          opacity: 1,
          x: pos - iconAnotLineWidth,
          x2: pos + iconAnotLineWidth,
          offsetY: this.getYPAdding(pos),
          fillColor: color,
          borderColor: '#231538',
          strokeDashArray: 0
        })
      })
      const images = data.map(({ nick, score: pos, style }) => {
        pos = pos / 1200 * this.chartInnerWidth
        return ({
          path: this.getChartIconSvg(nick, style),
          width: iconSize,
          height: iconSize,
          y: -iconSize + this.getYPAdding(pos),
          x: pos - iconSize / 2,
          appendTo: '.apexcharts-grid'
        })
      })

      return { xaxis, images }
    }
  }
}
</script>

<style lang="scss">
.chart {
  max-height: 510px;
  opacity: 0;
  transition: all .6s ease-in-out;
  &--show{
    opacity: 1;
  }
  &__categories-text {
    color: #DFDAE7;
    fill: #DFDAE7;
    font-family: Roboto, sans-serif !important;
    font-style: normal;
    font-weight: bold;
    font-size: 0.9vw;
    line-height: 120%;
    text-align: center;
    &:last-child {
      text-anchor: end;
    }
    &:first-child {
      text-anchor: start;
    }
  }
}
.graph_header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  &__right {
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
  }
}

</style>
