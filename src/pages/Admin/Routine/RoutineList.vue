<template>
  <article>
    <vue-good-table
      ref="routinesTable"
      :columns="columns"
      :rows="routines"
      :pagination-options="paginationOptions"
      :select-options="{ enabled: true }"
      :searchOptions="{
        enabled: true,
        skipDiacritics: true,
        placeholder: 'Type to search' }"
      @on-search="showGraph = false"
    >

      <template slot="table-row" slot-scope="props">
        <div v-if="props.column.field === 'actions'">
          <router-link :to="{
            name: 'RoutineEdit',
            params: { routineId: props.row.id }
          }">
            <q-icon name="create" size="24px"/>
          </router-link>
          <router-link v-if="isAdmin" :to="{
            name: 'RoutineEdit',
            params: { routineId: props.row.id},
            query: { duplicate: true }
          }">
            <q-icon name="content_copy" size="24px"/>
          </router-link>
          <q-icon v-if="isAdmin" style="cursor:pointer"  @click="deleteCurrentRoutine(props.row.id)" name="delete" size="24px"/>
          <q-icon v-if="isValidMuxSource(props.row.videoUrl)"
            name="video_library" size="24px"
            title="Upgrade video to Mux"
            style="cursor:pointer"
            @click="() => upgradeToMux('routine', props.row).then(fetchAllRoutines)"/>
          <q-icon v-else-if="isMux(props.row.videoUrl)"
            name="video_library" size="24px"
            title="Video is already MUX 😀"
            color="green" />
          <q-icon v-if="props.row.secVideoUrl && isValidMuxSource(props.row.secVideoUrl)"
            name="video_library" size="24px"
            title="Upgrade 2nd video to Mux"
            style="cursor:pointer"
            @click="() => upgradeToMux('routine', props.row, 'secVideoUrl').then(fetchAllRoutines)"/>
          <q-icon v-else-if="props.row.secVideoUrl && isMux(props.row.videoUrl)"
            name="video_library" size="24px"
            title="2nd video is already MUX 😀"
            color="green" />
        </div>
      </template>

    </vue-good-table>
    <q-btn @click="showGraph = true">Create Graph</q-btn>
    <div id="chart" v-if="showGraph">
      Weights Chart (20 Max)
      <apexchart height="350" :options="chartOptions" :series="computedWeightRoutinesSeries"></apexchart>
      Performance Chart (20 Max)
      <apexchart height="450" :options="statsChartOptions" :series="computedStatsRoutinesSeries"></apexchart>
    </div>
  </article>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
import { VueGoodTable } from 'vue-good-table'
import upgradeToMuxMixin from '@/mixins/upgradeToMux.mixin'

export default {
  components: {
    apexchart: VueApexCharts,
    VueGoodTable
  },
  mixins: [upgradeToMuxMixin],

  data () {
    return {
      columns: [
        {
          label: 'ID',
          field: 'id'
        },
        {
          label: 'Title',
          field: 'title'
        },
        {
          label: 'Weight',
          field: 'weight',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Approved by',
          field: 'approvedBy',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Difficulty',
          field: 'difficulty',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Category',
          field: 'skill',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Tags',
          field: 'tags',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Default sessions count',
          type: 'number',
          field: this.castSessionsListToNumber
        },
        {
          label: 'Is Published',
          field: this.castIsPublishedToString,
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Created At',
          field: 'createdAt'
        },
        {
          label: 'Last Update At',
          field: 'lastUpdated'
        },
        {
          label: 'Actions',
          field: 'actions'
        }
      ],
      paginationOptions: {
        enabled: true,
        perPage: 10
      },
      chartOptions: {
        tooltip: {
          theme: 'dark'
        },
        legend: {
          onItemClick: {
            toggleDataSeries: false
          }
        },
        chart: {
          zoom: {
            enabled: false
          },
          type: 'area',
          stacked: true,
          foreColor: 'white',
          animations: {
            enabled: false
          }
        },
        stroke: {
          curve: 'straight'
        },
        yaxis: {
          labels: {
            minWidth: 40
          }
        },
        xaxis: {
          type: 'datetime'
        }
      },
      statsChartOptions: {
        tooltip: {
          theme: 'dark',
          shared: false
        },
        legend: {
          onItemClick: {
            toggleDataSeries: false
          }
        },
        chart: {
          zoom: {
            enabled: false
          },
          type: 'line',
          foreColor: 'white',
          animations: {
            enabled: false
          }
        },
        stroke: {
          curve: 'straight'
        },
        yaxis: {
          labels: {
            minWidth: 40
          }
        },
        xaxis: {
          type: 'datetime'
        },
        markers: {
          size: 4
        }
      },
      showGraph: false
    }
  },

  computed: {
    ...mapGetters('user', {
      isAdmin: 'isAdmin'
    }),
    ...mapState('trainingRoutine', {
      routines: state => Object.values(state.routines),
      routinesWeights: state => Object.values(state.routinesWeights),
      routinesStats: state => Object.values(state.routinesStats)
    }),

    computedWeightRoutinesSeries () {
      let filteredTableRows = this.$refs.routinesTable?.selectedRowCount ? this.$refs.routinesTable?.selectedRows : this.$refs.routinesTable?.processedRows[0].children
      filteredTableRows = filteredTableRows.slice(0, 20)
      return this.routinesWeights
        .filter(routine => filteredTableRows.filter(filteredRoutine => routine.id === filteredRoutine.id).length > 0)
        .map(routineWeight => {
          const data = routineWeight.weights.map(singleWeight => ({
            x: this.$date(singleWeight.createdAt).startOf('day'),
            y: singleWeight.weight
          }))
          const lastItem = data[data.length - 1]
          const lastTime = this.$date().startOf('day')
          if (lastItem.x.isBefore(lastTime)) {
            data.push({ x: lastTime, y: lastItem.y })
          }
          return { name: routineWeight.title, data }
        })
    },
    computedStatsRoutinesSeries () {
      let filteredTableRows = this.$refs.routinesTable?.selectedRowCount ? this.$refs.routinesTable?.selectedRows : this.$refs.routinesTable?.processedRows[0].children
      filteredTableRows = filteredTableRows.slice(0, 20)
      return this.routinesStats
        .filter(routine => filteredTableRows.filter(filteredRoutine => routine.trainingRoutineId === filteredRoutine.id).length > 0)
        .map(routineStats => {
          const data = routineStats.consumedArray.map(singleStat => ({
            x: this.$date(singleStat.updatedAt).startOf('day'),
            y: parseInt(singleStat.consumed / singleStat.suggested * 100),
            z: `${singleStat.consumed} / ${singleStat.suggested}`
          }))
          const lastItem = data[data.length - 1]
          const lastTime = this.$date().startOf('day')
          if (lastItem.x.isBefore(lastTime)) {
            data.push({ x: lastTime, y: lastItem.y })
          }
          return { name: routineStats.title, data }
        })
    }
  },

  created () {
    this.fetchAllRoutines()
    this.fetchAllRoutinesWithWeightsArray()
  },

  methods: {
    ...mapActions('trainingRoutine', {
      fetchAllRoutines: 'fetchAllRoutines',
      deleteRoutine: 'deleteRoutine',
      fetchAllRoutinesWithWeightsArray: 'fetchAllRoutinesWithWeightsArray'
    }),
    async deleteCurrentRoutine (routineId) {
      if (!window.confirm('Delete?')) return
      await this.deleteRoutine(routineId)
      await this.fetchAllRoutines()
    },
    castIsPublishedToString (obj) {
      return String(obj.isPublished)
    },
    castSessionsListToNumber (obj) {
      return obj.defaultSessionIds.length || 0
    }
  }
}
</script>

<style>

</style>
