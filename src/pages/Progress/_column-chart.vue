<template>
  <apexchart
    :height="height"
    :options="options"
    :series="series"
  />
</template>

<script>
import Apexchart from 'vue-apexcharts'

export default {
  components: { Apexchart },

  props: {
    categories: {
      type: Array,
      default: () => []
    },
    userData: {
      type: Array,
      default: () => []
    },
    averageUserData: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: '300px'
    }
  },

  computed: {
    series () {
      return [
        {
          type: 'bar',
          data: this.userData
        },
        {
          type: 'bar',
          data: this.averageUserData
        }
      ]
    },
    options () {
      return {
        plotOptions: {
          bar: {
            columnWidth: '24px',
            borderRadius: 6
          }
        },
        chart: {
          type: 'bar',
          zoom: { enabled: false },
          toolbar: { show: false }
        },
        tooltip: { enabled: false },
        colors: ['#DD2678', '#DFDAE7'],
        legend: { show: false },
        xaxis: {
          axisBorder: { show: false },
          labels: {
            show: true,
            style: {
              colors: '#DFDAE740',
              fontSize: '16px'
            }
          },
          categories: this.categories
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
          enabled: false
        }
      }
    }
  },

  data () {
    return {
    }
  }
}
</script>

<style>
</style>
