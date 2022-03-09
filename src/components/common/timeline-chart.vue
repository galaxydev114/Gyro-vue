<template>
  <apexchart :height="height" :options="options" :series="series" />
</template>

<script>
import Apexchart from 'vue-apexcharts'

export default {
  components: { Apexchart },

  name: 'TimelineChart',

  props: {
    dataSeries1: {
      type: Array,
      default: () => []
    },
    dataSeries1Name: {
      type: String,
      default: 'Series 1'
    },
    dataSeries2: {
      type: Array,
      default: () => []
    },
    dataSeries2Name: {
      type: String,
      default: 'Series 2'
    },
    height: {
      type: String,
      default: '300px'
    },
    dashed: {
      type: Boolean,
      default: false
    },
    view: {
      type: String,
      default: 'week'
    },
    colors: {
      type: Array,
      default: () => ['#DD2678', '#DFDAE780']
    }
  },

  computed: {
    series () {
      return [
        {
          name: this.dataSeries1Name,
          type: 'line',
          data: this.dataSeries1
        },
        {
          name: this.dataSeries2Name,
          type: 'line',
          data: this.dataSeries2
        }
      ]
    },
    options () {
      return {
        chart: {
          type: 'line',
          zoom: { enabled: false },
          toolbar: { show: false }
        },
        tooltip: { enabled: true },
        colors: this.colors,
        legend: { show: false },
        xaxis: {
          type: 'datetime',
          axisBorder: { show: false },
          labels: {
            show: true,
            style: {
              colors: '#DFDAE740',
              fontSize: '16px'
            },
            format: this.view === 'month' ? 'MMM' : 'MMM dd',
            showDuplicates: false,
            datetimeFormatter: {
              month: 'MMM',
              day: 'MMM dd'
            }
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          axisBorder: { show: false },
          labels: {
            show: true,
            style: {
              colors: '#DFDAE740',
              fontSize: '16px'
            }
          }
        },
        grid: {
          strokeDashArray: 7,
          borderColor: '#FFFFFF40'
        },
        dataLabels: {
          colors: ['#F44336', '#E91E63', '#9C27B0']
        },
        stroke: {
          width: 3,
          dashArray: [this.dashed ? 10 : 0, 0]
        },
        markers: {
          size: 2,
          colors: ['#DD2678', '#DFDAE7'],
          strokeColors: ['#DD2678', '#DFDAE7'],
          hover: {
            size: 3
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.apexcharts-tooltip {
  border: none !important;
  background: $dark-one !important;
  color: $gray;

  &-title {
    background-color: $pink !important;
    border-bottom: none !important;
  }
}
</style>
