<template>
  <transition name="fade" mode="out-in">
    <slot/>
  </transition>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>>
