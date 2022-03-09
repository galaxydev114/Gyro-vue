<template>
  <div class="score-card">
    <div class="text-h5 text-weight-bold q-mb-sm">
      {{ title }}
    </div>
    <div class="text-p q-mb-sm score-card__desc">
      {{ description }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: () => null
    },
    title: {
      type: String,
      default: () => null
    }
  }
}
</script>

<style lang="scss">
.score-card {
  background: $dark-one;
  border-radius: 6px;
  padding: 20px;
  position: relative;
  margin-bottom: 10px;
  @media all and (max-width: 1023px) {
    width: calc(100% / 3 - 20px);
    margin: 10px 10px 0;
    display: inline-block;
    float: left;
  }
  @media all and (max-width: 768px) {
    width: 100%;
    margin: 0 0 20px;
  }
  &__desc {
      color: $gray;
      opacity: 0.7;
  }
}
</style>
