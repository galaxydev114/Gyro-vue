<template>
  <div>
    <h3>Routines Dashboard</h3>
    <div style="display:flex; width:100%;flex-flow: wrap;">
      <q-card>
        <q-card-section>
          <h5 style="text-align:center;">Routines updated more <br> than 2 weeks ago</h5>
          <q-knob
          disable
          v-model="computedRoutineShouldUpdate"
          show-value
          size="190px"
          :min="0"
          :max="100"
          :thickness="0.32"
          color="grey-3"
          track-color="primary"
          class="text-green q-ma-md"
        />
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <h5 style="text-align:center;">Routines Skills</h5>
          <apexchart type="donut" width="380" :options="computedRoutineType.chartOptions" :series="computedRoutineType.series" :key="componentKey "></apexchart>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <h5 style="text-align:center;">Routines Tags</h5>
          <apexchart type="donut" width="500" :options="computedRoutineTags.chartOptions" :series="computedRoutineTags.series" :key="componentKey "></apexchart>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    apexchart: VueApexCharts
  },

  data () {
    return {
      componentKey: 0
    }
  },

  computed: {
    ...mapGetters('user', {
      isAdmin: 'isAdmin'
    }),
    ...mapState('trainingRoutine', {
      routines: state => Object.values(state.routines)
    }),
    computedRoutineType () {
      if (this.routines.length === 0) return { series: [], chartOptions: {} }
      const mappedRoutines = this.routines?.reduce((res, routine) => {
        if (res[routine.skill]) {
          res[routine.skill] += 1
        } else {
          res[routine.skill] = 1
        }
        return res
      }, {})
      const mappedRoutinesArray = Object.keys(mappedRoutines).map((key) => { return { key, value: mappedRoutines[key] } }).sort((a, b) => b.value - a.value)
      const _series = mappedRoutinesArray.map((item) => item.value)
      const _labels = mappedRoutinesArray.map((item) => item.key)
      return {
        series: _series,
        chartOptions: {
          chart: {
            width: 380,
            type: 'donut'
          },
          plotOptions: {
            pie: {
              expandOnClick: false,
              donut: {
                labels: {
                  show: true,
                  total: {
                    color: 'white',
                    show: true,
                    showAlways: true
                  }
                }
              }
            }
          },
          legend: {
            labels: {
              colors: 'white'
            }
          },
          labels: _labels,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      }
    },
    computedRoutineTags () {
      if (this.routines.length === 0) return { series: [], chartOptions: {} }
      const mappedRoutines = this.routines?.reduce((res, routine) => {
        if (routine.tags.length > 0) {
          routine.tags.forEach(el => {
            if (res[el]) {
              res[el] += 1
            } else {
              res[el] = 1
            }
          })
        }
        return res
      }, {})
      const mappedRoutinesArray = Object.keys(mappedRoutines).map((key) => { return { key, value: mappedRoutines[key] } }).sort((a, b) => b.value - a.value)
      const _series = mappedRoutinesArray.map((item) => item.value)
      const _labels = mappedRoutinesArray.map((item) => item.key)
      return {
        series: _series,
        chartOptions: {
          chart: {
            width: 380,
            type: 'donut'
          },
          plotOptions: {
            pie: {
              expandOnClick: false,
              donut: {
                labels: {
                  show: true,
                  total: {
                    color: 'white',
                    show: true,
                    showAlways: true
                  }
                }
              }
            }
          },
          legend: {
            labels: {
              colors: 'white'
            }
          },
          labels: _labels,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      }
    },
    computedRoutineShouldUpdate () {
      return this.routines.filter((routine) => {
        return this.$date().diff(this.$date(routine.lastUpdated), 'days') > 14
      }).length
    }
  },

  async created () {
    await this.fetchAllRoutines()
    this.componentKey += 1
  },

  methods: {
    ...mapActions('trainingRoutine', {
      fetchAllRoutines: 'fetchAllRoutines'
    })
  }
}
</script>

<style>

</style>
