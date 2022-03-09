<template>
  <div class="bordered q-py-md">
    <div :class="`text-h2 ${textColor} text-weight-bold full-width`">
      {{ value }}
    </div>
    <div class="full-width text-weight-bold text-uppercase text-gray font-rift text-h5">
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    textColor: {
      type: String,
      default: () => 'text-green'
    }
  }
}
</script>

<style lang="scss" scoped>
.bordered{
  border: 1px solid $soft-tone;
  border-radius: 6px;
}
</style>
