<template>
  <div class="step-block"
       :style="`width: ${size};`">
    <div class="step-block__sub" :style="`padding-top: ${size}`"></div>
    <div class="step-block__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '48px'
    }
  }
}
</script>

<style lang="scss">
.step-block{
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  background: $pink;
  border-radius: 100%;
  position: relative;
  &__content{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
