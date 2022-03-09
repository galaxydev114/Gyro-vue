<template>
  <div :class="`badge badge--${label.toLowerCase()}`">
    New
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
.badge{
  position: absolute;
  top: 20px;
  right: 18px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: bold;
  &--new{
    color: $pink;
  }
  &--update{
    color: #E3734F;
  }
}
</style>
