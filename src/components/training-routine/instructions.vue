<template>
  <section class="content session__section q-mt-xl">
    <div class="text-h4 q-mt-xl">Instructions</div>
    <div class="text-subtitle1 text-weight-regular text-gray q-mt-sm">
      Follow the steps below to complete this session
    </div>

    <n-instruction
      v-for="(step, i) of steps"
      :key="step.title + i"
      :step="i + 1"
      :title="step.title"
      :description="step.description"
    />
  </section>
</template>

<script>
import InstructionItem from './instruction-item'

export default {
  components: {
    'n-instruction': InstructionItem
  },

  props: {
    steps: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  color: $gray;
  /deep/ .q-card {
    p {
      font-size: 20px;
      &:last-child{
        padding-bottom: 0;
        margin-bottom: 0;
      }
    }
  }
}
</style>
