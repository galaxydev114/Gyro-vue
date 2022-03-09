<script>
const audio = new Audio(require('@/assets/sounds/timer.wav'))

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
      hasSound: true
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
      this.timer = setInterval(() => {
        --this.time
        this.currentProgress += 60 / this.seconds
        if (this.time <= 0) {
          if (this.hasSound) {
            setTimeout(() => audio.play(), 100)
          }
          this.$emit('time-expire')
          this.stopTimer()
        }
      }, 1000)
    },
    stopTimer () {
      audio.load()
      this.isStart = false
      this.time = this.seconds
      this.currentProgress = 0
      clearInterval(this.timer)
    },
    pauseTimer () {
      this.isStart = false
      clearInterval(this.timer)
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
