<template>
  <div class="total-activities q-py-md q-px-md">
    <div class="total-activities__label text-left">
      <div>
        <c-icon icon="routines" />
      </div>
      <div class="text-gray font-rift text-weight-bold">
        total activities done
      </div>
    </div>
    <div class="total-activities__value font-rift text-green text-weight-bold">
      {{ value }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      require: true
    }
  }
}
</script>

<style lang="scss">
.total-activities{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid $soft-tone;
  border-radius: 6px;
  &__value{
    font-size: 52px;
    line-height: 56px;
  }
}
</style>
