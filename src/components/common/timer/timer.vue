<script>
const audio = new Audio(require('@/assets/sounds/timer.wav'))
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame

export default {
  props: {
    seconds: {
      props: Number,
      default: 120
    },
    stopTime: {
      props: Number,
      default: 0
    },
    id: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      time: 0,
      isStart: false,
      timer: null,
      currentProgress: 0,
      hasSound: true,

      endTime: 0
    }
  },
  mounted () {
    this.time = this.seconds
  },
  render () {
    return this.$scopedSlots.default({
      isStart: this.isStart,
      isPass: this.isPass,
      hasSound: this.hasSound,
      showTime: this.showTime,
      startTimer: this.startTimer,
      stopTimer: this.stopTimer,
      pauseTimer: this.pauseTimer,
      restartTimer: this.restart,
      toggleSound: this.toggleSound
    })
  },
  computed: {
    showTime () {
      let minutes = parseInt(this.time / 60, 10)
      let seconds = parseInt(this.time % 60, 10)

      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds

      return minutes + ':' + seconds
    }
  },
  methods: {
    startTimer () {
      this.isStart = true
      this.$emit('start')
      this.endTime = new Date().getTime() + this.seconds * 1000
      this.timer = requestAnimationFrame(this.showTimeInterval)
    },
    stopTimer () {
      audio.load()
      this.isStart = false
      this.currentProgress = 0
      cancelAnimationFrame(this.timer)
      setTimeout(() => {
        this.time = this.seconds
      }, 100)
    },
    pauseTimer () {
      this.isStart = false
    },
    restart () {
      this.stopTimer()
      this.startTimer()
    },
    isPass (i) {
      return i <= this.currentProgress
    },
    toggleSound () {
      this.hasSound = !this.hasSound
    },
    getRemainingTime (deadline) {
      const currentTime = new Date().getTime()
      return (deadline - currentTime) / 1000
    },
    showTimeInterval () {
      this.time = this.getRemainingTime(this.endTime)
      this.currentProgress += 60 / this.seconds
      if (this.time >= 1 && this.isStart) {
        requestAnimationFrame(this.showTimeInterval)
      } else if (this.time < 1) {
        if (this.hasSound) {
          setTimeout(() => audio.play(), 100)
        }
        this.time = 0
        this.isStart = false
        this.$emit('time-expire')
        cancelAnimationFrame(this.timer)
      }
    }
  },
  watch: {
    id () {
      this.stopTimer()
      this.time = this.seconds
    },
    stopTime () {
      this.stopTimer()
    }
  }
}
</script>
