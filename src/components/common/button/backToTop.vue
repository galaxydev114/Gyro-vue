<template>
  <div class="back-to-top" @click="$emit('click')">
    <c-icon icon="rightArrow" class="back-to-top__icon" />
  </div>
</template>

<style lang="scss" scoped>
  .back-to-top{
    position: fixed;
    bottom: env(safe-area-inset-bottom);
    right: 20px;
    margin-bottom: 20px;
    border-radius: 6px;
    background: $dark-pink;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    &__icon{
      transform: rotate(-90deg);
      /deep/ img{
        filter: brightness(0) invert(1);
      }
    }
  }
</style>
