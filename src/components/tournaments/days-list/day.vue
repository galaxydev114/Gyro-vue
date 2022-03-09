<template>
  <div class="day-item q-mb-md">
    <div class="day-item__header text-h5">
      {{ date }}
    </div>
    <div style="z-index: 2">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      default: () => ''
    }
  }
}
</script>

<style lang="scss" scoped>
.day-item{
  width: 100%;
  &__header{
    position: sticky;
    top: 0;
    background: $dark;
    z-index: 3;
    color: $gray-violet;
    padding: 0 0 15px 0;
  }
}
</style>
