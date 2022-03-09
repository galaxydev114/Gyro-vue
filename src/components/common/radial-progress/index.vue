<template>
  <div class="radial-progress">
    <svg class="progress" :width="width" :height="height" viewBox="0 0 40 40" viewport="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle r="15.91549"
              cx="20"
              cy="20"
              fill="transparent"
              stroke="#433558"
              stroke-dasharray="100"
              stroke-dashoffset="0"
              ></circle>
      <circle r="15.91549"
              cx="20"
              cy="20"
              fill="transparent"
              stroke-dasharray="100"
              stroke-dashoffset="0"
              :stroke="value < 100 ? '#E7A957' : '#2CAD6D'"
              ref="bar"></circle>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    width: {
      type: String,
      default: '40px'
    },
    height: {
      type: String,
      default: '40px'
    }
  },
  mounted () {
    this.change()
  },
  methods: {
    change () {
      this.$refs.bar.style['stroke-dashoffset'] = this.value - 100
    }
  },
  watch: {
    value () {
      this.change()
    }
  }
}
</script>

<style lang="scss" scoped>
.progress {
  display: block;
  margin: 0 auto;
  overflow: hidden;
  transform: rotate(-90deg) rotateX(180deg);
  circle {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 1s ease;
    stroke-width: 7px;
  }
}
</style>
