<template>
  <div v-if="startScoreAnimation">
    <div class="skill-score">
      <div class="skill-score__speedometer">
        <div style="margin-bottom: auto">
          <div class="text-h4">
            NOVOS Skill Score
          </div>
          <div class="q-pb-lg">
            Our score is a sum of your statistics
          </div>
        </div>
        <speedometer :score="score" :hideInfo="hideInfo" :showProjection="showProjection" @ended="showNext = true" :animated="false"/>
      </div>
      <div class="skill-score__comparison">
        <slot>
          <div class="text-h4 q-pb-lg">
            Training comparisson
          </div>
          <div class="q-mt-lg relative-position radar-container">
            <RadarChart ref="chartRef"
                        :chartData="chartJSChartData"
                        :options="options"
                        class="relative-position"
                        style="z-index: 20" />
          </div>
        </slot>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none justify-end"  v-if="showAction">
      <div class="col-6 q-px-lg-none q-pl-sm text-right">
        <q-btn unelevated
          class="q-px-md btn-join-fg"
          :class="{'full-width': $q.screen.lt.sm, 'btn-next': ($q.screen.gt.xs && $q.screen.lt.md) || $q.screen.gt.lg }"
          color="dark-pink"
          :disable="!showNext"
          @click="nextClicked">
          Next
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
import { RadarChart } from 'vue-chart-3'
import { mapGetters } from 'vuex'

export default {
  props: {
    score: {
      type: Number,
      default: 1350
    },
    showProjection: {
      type: Boolean,
      default: false
    },
    showAction: {
      type: Boolean,
      default: true
    },
    startScoreAnimation: {
      type: Boolean,
      default: true
    },
    hideInfo: {
      type: Boolean,
      default: false
    }
  },
  components: {
    RadarChart,
    speedometer: () => import('@/components/speedometer')
  },
  data () {
    return {
      showNext: false,
      tooltipData: []
    }
  },
  methods: {
    nextClicked () {
      // TODo: implement next action
      this.$emit('next')
    },
    labelNormalization (context) {
      const label = context.dataset.label || ''
      let parsedValue = context.parsed.r

      switch (context.label) {
        case 'power rank':
          parsedValue = parsedValue * 2500
          break
        case 'arena k/d':
        case 'pub K/D':
          parsedValue = parsedValue / 15
          break
        case 'pub plac.':
        case 'arena plac.':
          parsedValue = 101 - parsedValue
          break
        default:
          break
      }
      return label + `: ${parsedValue.toFixed(2)}`
    }
  },
  computed: {
    ...mapGetters({
      arenaKD: 'user/arenaKD',
      publicKD: 'user/publicKD',
      arenaPlacement: 'user/arenaPlacement',
      publicPlacement: 'user/publicPlacement',
      powerRank: 'user/powerRank'
    }),

    normalizedArenaKD () {
      return this.arenaKD * 15
    },
    normalizedPublicKD () {
      return this.publicKD * 15
    },
    normalizedArenaPlacement () {
      return 101 - this.arenaPlacement
    },
    normalizedPublicPlacement () {
      return 101 - this.publicPlacement
    },
    normalizedPowerRank () {
      return this.powerRank / 2500
    },

    playerPredictedArenaKD () {
      return parseFloat((Math.max(this.arenaKD * 1.2, this.arenaKD + 0.9) * 15).toFixed(2))
    },
    playerPredictedPubKD () {
      return parseFloat((Math.max(this.publicKD * 1.2, this.publicKD + 1.5) * 15).toFixed(2))
    },
    playerPredictedArenaPlacement () {
      return parseFloat((Math.max(this.arenaPlacement * 0.95, 10)).toFixed(2))
    },
    playerPredictedPublicPlacement () {
      return parseFloat((Math.max(this.publicPlacement * 1.35, 10)).toFixed(2))
    },
    playerPredictedpowerRank () {
      return parseFloat((Math.max(this.powerRank * 0.95, 1035) / 2500))
    },

    chartJSChartData () {
      const current = {
        label: 'Current',
        data: [this.normalizedPowerRank, this.normalizedArenaKD, this.normalizedArenaPlacement, this.normalizedPublicPlacement, this.normalizedPublicKD],
        borderColor: '#594FE3',
        backgroundColor: 'rgba(89, 79, 227, 0.3)',
        pointRadius: 5,
        pointBorderWidth: 2,
        pointBorderColor: '#594FE3',
        pointBackgroundColor: '#1C102C',
        pointHoverBackgroundColor: '#594FE3',
        pointHoverRadius: 6
      }
      const projection = {
        label: '1 month projection',
        data: [this.playerPredictedpowerRank, this.playerPredictedArenaKD, this.playerPredictedArenaPlacement, this.playerPredictedPublicPlacement, this.playerPredictedPubKD],
        borderColor: '#DD2678',
        backgroundColor: 'rgba(221, 38, 120, 0.3)',
        pointRadius: 5,
        pointBorderWidth: 2,
        pointBorderColor: '#DD2678',
        pointBackgroundColor: '#1C102C',
        pointHoverBackgroundColor: '#DD2678',
        pointHoverRadius: 6
      }
      const datasets = this.showProjection ? [current, projection] : [current]
      return {
        labels: ['power rank', 'arena k/d', 'arena plac.', 'pub plac.', 'pub K/D'],
        datasets
      }
    },
    options () {
      return {
        responsive: true,
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: true,
            position: 'bottom',
            align: 'start',
            labels: {
              color: '#fff',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15,
              boxHeight: 100,
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: this.labelNormalization
            },
            displayColors: false,
            backgroundColor: '#382B4B',
            padding: 12,
            borderColor: '#433558',
            borderWidth: 2,
            titleColor: '#C84461',
            titleFont: {
              size: 16,
              family: '\'rift\', sans-serif'
            }
          }
        },
        scales: {
          r: {
            suggestedMax: 100,
            grid: {
              color: '#231839',
              lineWidth: 14
            },
            angleLines: {
              display: true,
              lineWidth: 1,
              color: '#292044'
            },
            pointLabels: {
              font: {
                size: 16,
                family: "'rift', sans-serif",
                weight: 'bold'
              },
              color: 'rgba(255, 255, 255, .7)'
            },
            ticks: {
              display: false
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">

.skill-score{
  $root: &;
  margin: 30px auto 0;
  display: flex;
  align-items: stretch;
  border: 1.5px solid #382B4B;
  border-radius: 6px;
  justify-content: space-between;
  max-width: 1000px;
  overflow: hidden;
  &__speedometer{
    padding: 36px;
    width: 550px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &__comparison{
    width: 450px;
    padding: 36px;
    background: $dark-one;
    border-left: 1.5px solid #382B4B;
    flex: 1 1 450px;
    position: relative;

    .radar-container{
      width: 370px;
      height: 370px;
      display: block;
      margin: auto;
    }
  }

  @media (max-width: 1280px) {
    #{$root}__speedometer{
      width: calc( 100% - 330px);
    }
    #{$root}__comparison{
      width: 330px;
      .radar-container{
        width: 270px;
        height: 270px;
      }
    }
  }

  @media (max-width: 1024px) {
    #{$root}__speedometer,
    #{$root}__comparison{
      padding: 15px;
    }
  }

  @media (max-width: 767px) {
    flex-direction: column;
    margin: 10px;
    #{$root}__speedometer{
      width: 100%;
    }
    #{$root}__comparison{
      width: 100%;
      flex: 1 1 100%;
      border-top: 1.5px solid #382B4B;
      border-left: unset;
      .radar-container{
        width: 300px;
        height: 300px;
        display: block;
        margin: auto;
      }
    }
  }
}
</style>
