<template>
  <div class="week-overview relative-position"
       :class="{'week-overview--is-next': isNext,
       'week-overview--disabled': disable,
       'week-overview--small': $q.screen.lt.sm}"
       :style="`background: ${color}`">
    <div class="week-overview__name">
      Week {{ weekNumber }}
    </div>
    <div class="week-overview__content">
      <div class="week-overview__days">
        <div class="week-overview__day relative-position"
             :style="`border: 1px solid ${!isNext ? color : '#433558'}`"
             v-for="(day, i) in week"
             :key="`day-${i}`">
          <div class="week-overview__day-number text-weight-bold">
            {{ getDay(day) }}
          </div>
          <div v-if="weekNumber === 1 || $q.screen.lt.sm" class="week-overview__day-label font-rift text-uppercase text-weight-bold">
            {{ getWeekDay(day) }}
          </div>
          <div class="week-overview__day-bg absolute full-width full-height opacity-5"
               :style="`background: ${isNext ? '#433558' : color}; top: 0; left: 0; border-radius: 6px`"
               style="z-index: 1"></div>
        </div>
      </div>
      <div class="week-overview__description column justify-end q-pl-md">
        <div class="q-mt-xs text-h4">
          {{ title }}
        </div>
        <div class="text-subtitle2 text-weight-regular text-gray q-mt-xs q-mb-auto">
          {{ description }}
        </div>
        <div v-if="!isNext" class="flex items-center justify-between full-width">
          <div class="column text-center props-item">
            <level :num="volume" />
            <div class="q-mt-xs">
              Volume
            </div>
          </div>
          <div class="column text-center props-item">
            <level :num="intensity" />
            <div class="q-mt-xs">
              Intensity
            </div>
          </div>
          <div class="column text-center props-item">
            <level :num="specify" />
            <div class="q-mt-xs">
              Specificity
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="week-overview__done" v-if="disable">
      <c-icon icon="check" width="16px" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      props: String,
      default: () => ''
    },
    description: {
      props: String,
      default: () => ''
    },
    weekNumber: {
      type: Number,
      default: () => 1
    },
    dayStart: {
      type: [Date, Object],
      require: true
    },
    color: {
      type: String,
      default: () => '#DD2678'
    },
    volume: {
      type: Number,
      default: () => 1
    },
    intensity: {
      type: Number,
      default: () => 1
    },
    specify: {
      type: Number,
      default: () => 1
    },
    isNext: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    level: () => import('./level')
  },
  methods: {
    getWeekDay (date) {
      return this.$q.screen.lt.lg ? this.$date(date).format('ddd') : this.$date(date).format('dddd')
    },
    getDay (date) {
      return this.$date(date).format('D')
    }
  },
  computed: {
    week () {
      const start = this.dayStart
      const d = this.$date(start)
      const week = []

      week.push(d)
      week.push(d.add(1, 'day'))
      week.push(d.add(2, 'day'))
      week.push(d.add(3, 'day'))
      week.push(d.add(4, 'day'))
      week.push(d.add(5, 'day'))
      week.push(d.add(6, 'day'))

      return week
    }
  }
}
</script>

<style lang="scss" scoped>
.week-overview{
  $root: &;
  display: flex;
  align-items: center;
  padding: 2px 2px 2px 35px;
  height: 148px;
  border-radius: 6px;
  position: relative;
  &__name{
    color: #fff;
    transform: rotate(-90deg);
    width: 144px;
    font-weight: bold;
    position: absolute;
    top: 43%;
    left: -55px;
    text-align: center;
    text-transform: uppercase;
  }
  &__content{
    width: 100%;
    background: $dark;
    border-radius: 6px 0 0 6px;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: 10px;
  }
  &__days{
    height: 100%;
    flex: 0 0 calc(100% - 270px);
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }
  &__day{
    height: 100%;
    border-radius: 6px;
    width: calc(100%/7 - 10px);
    padding: 10px;
    color: #fff;
  }
  &__day-label{
    width: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: -40px;
    font-size: 16px;
  }
  &__day-number{
    position: relative;
    z-index: 2;
  }
  &__description{
    flex: 0 0 250px;
    opacity: .7;
  }

  .props-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    padding: 7px 15px 3px 15px;
    background: $dark-one;
    font-size: 12px;
    margin-top: auto;
  }

  &--is-next{
    background: transparent!important;
    border: 2px dashed $dark-one;
    height: 100px;
    overflow: hidden;
    #{$root}__name{
      width: 100px;
      left: -33px;
      height: 35px;
      line-height: 35px;
      top: 30px;
      border-bottom: 2px dashed $dark-one;
    }
  }
  &--small{
    padding: 35px 2px 2px 2px;
    height: auto;
    #{$root}__name{
      transform: unset;
      top: 5px;
      left: 10px;
      right: 10px;
      text-align: left;
      width: 100%;
    }
    #{$root}__description{
      height: auto;
      padding: 0;
      flex-basis: unset;
      order: 1;
    }
    #{$root}__content{
      flex-direction: column;
      justify-content: flex-start;
      align-items: unset;
    }
    #{$root}__days{
      height: auto;
      order: 2;
      flex-basis: unset;
      align-items: unset;
    }
    #{$root}__day{
      height: auto;
      width: calc(100%/7 - 5px);
      margin-top: 35px;
      &:before{
        content: "";
        display: block;
        padding-top: 100%
      }
    }
    #{$root}__day-label{
      top: -25px;
    }
    #{$root}__day-number{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
    .props-item{
      flex-direction: row;
      align-items: center;
      width: 30%;
      margin: 10px 0;
      justify-content: space-between;
      .level{
        order: 2;
      }
    }
  }
  &--disabled{
    background: $soft-tone!important;
    border: 1px solid $green;
    #{$root}__day{
      border-color: $dark-one!important;
      &-bg{
        background: $dark-one!important;
      }
    }
  }
  &__done{
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 40px;
    text-align: center;
    background: $green;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    display: flex;
    padding: 7px;
    align-items: flex-start;
    justify-content: flex-end;
  }
}
</style>
