<template>
  <n-chip :color="color">
    {{difficulty | toUpperCase}}
  </n-chip>
</template>

<script>
import Chip from '@/components/training-routine/chip'

export default {
  props: {
    difficulty: {
      type: String,
      default: ''
    }
  },

  components: {
    'n-chip': Chip
  },

  filters: {
    toUpperCase (value) {
      if (!value || typeof value !== 'string') return ''
      return value.toUpperCase()
    }
  },

  computed: {
    color () {
      if (!this.difficulty) {
        return 'gray'
      }

      switch (this.difficulty.toUpperCase()) {
        case 'EASY': return 'green'
        case 'INTERMEDIATE': return 'yellow'
        case 'ADVANCED': return 'red'
        case 'EXPERT': return 'blue'
        default:
          return 'gray'
      }
    }
  }
}
</script>

<style>

</style>
