<template>
  <div class="q-pt-xl">
    <week v-for="(week, i) in weeks"
          class="q-mb-md"
          :key="`week-${i}`"
          :disable="i < trainingPlansAmount"
          :color="week.color"
          :title="week.title"
          :description="week.description"
          :week-number="week.weekNumber"
          :volume="week.volume"
          :day-start="week.dayStart"
          :intensity="week.intensity"
          :specify="week.specify" />

    <week title="Next goal"
          description="Once you finish all 3 weeks of training you will have the option to start a new goal"
          :day-start="nextWeekStart"
          :week-number="weeks.length + 1"
          v-if="showNextWeek"
          is-next
    />
    <div class="q-mt-xl">
      <c-btn class="q-mx-auto" style="max-width: 330px" @click="$emit('next')">
        CONTINUE TO MY TRAINING PLAN
      </c-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    weeks: {
      type: Array,
      default: () => []
    },
    showNextWeek: {
      type: Boolean,
      default: true
    }
  },
  components: {
    week: () => import('./week')
  },
  computed: {
    ...mapState({
      trainingPlansAmount: state => state.user.trainingPlansAmount
    }),
    nextWeekStart () {
      if (this.weeks.length) {
        const d = this.$date(this.weeks[this.weeks.length - 1].dayStart)
        return d.add(1, 'week')
      } else {
        const d = this.$date(new Date())
        return d.add(1, 'week')
      }
    }
  }
}
</script>
