<template>
  <div class="text-divider">
      <span>
        <slot />
      </span>
  </div>
</template>

<style lang="scss" scoped>
.text-divider{
  width: 100%;
  overflow: hidden;
  span{
    position: relative;
    padding: 0 30px;
    color: rgba(223, 218, 231, .5);
    &:before,
    &:after{
      content: "";
      position: absolute;
      top: 50%;
      border-top: 1px dashed $soft-tone;
      width: 200%;
    }
    &:before{
      right: 100%;
    }
    &:after{
      left: 100%;
    }
  }
}
</style>
