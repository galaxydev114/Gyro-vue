<template>
  <div>
    <div class="row justify-between items-center q-mt-sm q-mb-md">
      <div class="text-h5 text-weight-regular">
        This week
      </div>
      <div class="text-h5 text-weight-regular text-pink text-uppercase text-weight-bold font-rift">
        {{ daysCompleted }}/{{ daysScheduled }} achieved
      </div>
    </div>
    <div class="row q-col-gutter-md q-mb-lg justify-between q-mb-lg">
      <div class="col-1 col-grow items-center justify-center"
           v-for="(day, i) in week"
           :key="`day-${day}-${i}`">
        <c-radial-progress :value="day.value || 0" width="100%" :class="{ 'opacity-5': isNaN(day.value) }" />
        <div class="opacity-5 text-center text-weight-bold q-mt-sm">
          {{ day.short }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    week: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'c-radial-progress': () => import('@/components/common/radial-progress')
  },
  computed: {
    daysCompleted () {
      return this.week.filter(day => day.value >= 100).length
    },
    daysScheduled () {
      return this.week.filter(day => !isNaN(day.value)).length
    }
  }
}
</script>
