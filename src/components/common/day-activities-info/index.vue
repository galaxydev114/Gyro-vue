<template>
  <div class="day-activities-info q-px-lg">
    <div class="day-activities-info__info" v-if="current && total">
      {{ current }}/{{ total }}
    </div>
    <div class="day-activities-info__label q-mb-sm" v-else>
      LETS START THIS DAY
    </div>
    <div class="day-activities-info__progress">
      <q-linear-progress
        size="md"
        :value="progress"
        rounded
        color="green"
        track-color="light-tone"
      />
    </div>
    <div class="day-activities-info__label" v-if="current && total">
      TODAY ACTIVITIES
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      dailyRoutinesCounter: 'trainingPlan/dailyRoutinesCounter',
      trainingPlanOffsetDay: 'trainingPlan/trainingPlanOffsetDay'
    }),
    counter () {
      return this.dailyRoutinesCounter(this.trainingPlanOffsetDay)
    },
    current () {
      return (this.counter?.count - this.counter?.left) || 0
    },
    total () {
      return this.counter?.count || 0
    },
    progress () {
      return this.current && this.total ? (this.current * 100 / this.total) / 100 : 1
    }
  }
}
</script>

<style lang="scss" scoped>
.day-activities-info{
  text-align: center;
  position: relative;
  &:before,
  &:after{
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 30px;
    background: #DFDAE7;
    left: 0;
    opacity: .4;
  }
  &:after{
    left: unset;
    right: 0;
  }
  &__info{
    font-size: 1.2rem;
    font-weight: bold;
    color: $pink;
  }
  &__label{
    font-weight: bold;
    font-size: 12px;
    color: #DFDAE7;
  }
}
</style>
