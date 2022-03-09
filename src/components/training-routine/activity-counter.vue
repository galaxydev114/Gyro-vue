<template>
  <div class="activity-counter">
    <q-img v-if="!counter > 0" src="@/assets/trainingRoutine/activity-counter-empty.svg" width="100%" />
    <q-img v-else src="@/assets/trainingRoutine/activity-counter-green.svg" width="100%" />
    <span class="activity-counter__title font-rift text-h5 text-weight-bold"
          :class="{'opacity-5': !counter > 0}"
    >
      X {{counter}}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    counter: {
      type: Number,
      default: 0,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-counter {
  width: 50px;
  height: 50px;
  position: relative;
  display: inline-block;
  &__title {
    top: 50%;
    left: 50%;
    transform: translateY(-45%) translateX(-50%);
    position: absolute;
    font-family: 'Rift', 'serif';
  }
  svg{
    width: 100%;
    height: 100%;
  }
  @media (max-width: $breakpoint-xs-max) {
    width: 65px;
    height: 65px;
    &__title{
      font-size: 16px;
    }
  }
}
</style>
