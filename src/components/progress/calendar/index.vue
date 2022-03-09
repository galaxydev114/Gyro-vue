<template>
  <div>
    <div class="row justify-between items-center q-mt-sm q-mb-md">
      <div class="text-h5 text-weight-regular">
        {{ date }}
      </div>
    </div>
    <div class="play-calendar">
      <q-date
        readonly
        class="no-shadow full-width"
        color="dark-pink"
        view="Months"
        first-day-of-week="1"
        :value="date"
        minimal
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activities: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  computed: {
    date () {
      return this.$date().format('MMMM YYYY')
    },
    daysCompleted () {
      return this.activities.filter(day => day.value >= 100).length
    },
    daysScheduled () {
      return this.activities.length
    }
  },
  mounted () {
    setTimeout(() => {
      this.setupActivities()
    }, 1000)
  },
  methods: {
    setupActivities () {
      document.querySelectorAll('.q-date__calendar-item--in').forEach((el) => {
        const dayEl = el.getElementsByClassName('block')[0]
        const day = el.getElementsByClassName('block')[0].innerHTML
        const hasActivity = this.activities.find((item) => {
          const itemDay = this.$date(item.date).get('date')
          return +itemDay === +day
        })
        if (hasActivity) {
          const playDayCount = document.createElement('div')
          playDayCount.classList.add('day-play')
          playDayCount.style.width = hasActivity.value + '%'
          playDayCount.style.height = hasActivity.value + '%'
          dayEl.before(playDayCount)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.play-calendar {
  margin: 0 -16px;
}

/deep/ {
  .day-play{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border: 1px solid $dark-pink;
    border-radius: 100%;
    display: block;
    background: rgba($dark-pink, .25);
    z-index: 1;
    opacity: .8;
  }

  .q-date {
    &__navigation {
      display: none;
    }

    &__view {
      padding: 0;
      width: 100%;
    }
    &__today{
      color: $pink;
      font-weight: bold;
    }

    &__calendar-item {
      .block{
        position: relative;
        z-index: 3;
      }
      button {
        width: 42px;
        height: 42px;
        font-size: 16px;
      }
    }
  }
}
</style>
