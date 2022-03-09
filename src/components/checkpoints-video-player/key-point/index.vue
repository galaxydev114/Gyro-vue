<template>
  <div class="key-point">
    <div class="key-point__header text-subtitle1 font-rift text-gray opacity-5">
      Key Point
    </div>
    <div class="key-point__content">
      <div class="text-h4 q-my-md">
        {{ title }}
      </div>
      <div class="text-gray">
        <slot />
      </div>
    </div>
    <div class="key-point__footer q-mt-md">
      <c-btn @click="$emit('continue')" :bold="false">
        CONTINUE
      </c-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      require: true
    },
    description: {
      type: String,
      require: true
    },
    imgSrc: {
      type: String,
      default: () => ''
    },
    hideStartOver: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.key-point{
  width: 100%;
  padding: 30px;
  border-radius: 6px;
  background: $dark;
  max-height: 100%;
  height: auto;
  overflow-y: auto;
  /deep/ img{
    width: 100%;
    height: auto;
    max-height: 250px;
  }
}
</style>
