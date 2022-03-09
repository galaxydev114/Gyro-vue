<template>
  <div class="congrats-point relative-position">
    <div class="text-center congrats-point__header">
      <c-icon icon="done" width="150px" />
      <div class="text-dark-pink font-rift text-h5 text-weight-bold text-uppercase" style="margin-top: -40px">
        workshop completed!
      </div>
    </div>
    <div class="column">
      <div class="text-h4 q-mt-lg font-roboto text-center">
        {{ title }}
      </div>
      <div class="q-my-md">
        <slot />
      </div>
      <div>
        <c-btn @click="$emit('complete')">
          mark as complete
        </c-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => ''
    }
  }
}
</script>

<style lang="scss" scoped>
.congrats-point {
  padding: 30px;
  border-radius: 6px;
  background: $dark;
  max-height: 100%;
  height: auto;
  overflow-y: auto;
  &__header{
    background: url("./../../../assets/onboarding/completing-bg.png") center no-repeat;
    background-size: 100%;
  }
}
</style>
