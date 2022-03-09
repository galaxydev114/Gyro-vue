<template>
  <div style="order: 2">
    <c-empty-day :isCurrentDay="isCurrentDay" v-if="isEmpty" @click="$emit('click')" />
    <c-btn outline
           dashed
           size="sm"
           textColor="dark-pink"
           class="full-width"
           @click="$emit('click')"
           v-else>
      Add new activity
    </c-btn>
  </div>
</template>

<script>
export default {
  props: {
    isEmpty: {
      type: Boolean,
      default: false
    },
    isCurrentDay: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'c-empty-day': () => import('components/weekly-training-plan/empty-day')
  }
}
</script>
