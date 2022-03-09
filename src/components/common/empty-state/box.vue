<template>
  <div class="empty-box" @click="$emit('click')">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
  }
}
</script>

<style lang="scss" scoped>
.empty-box{
  border: 2px dashed $soft-tone;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 16px 16px 8px;
  min-height: 128px;
  border-radius: 6px;
  flex-direction: column;
}
</style>
