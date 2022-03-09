<template>
  <div class="empty-day" @click="$emit('click')">
    <c-icon icon="plusPink" />
    <div :class="`text-${ isCurrentDay ? 'h4' : 'h5'} text-soft-tone q-my-sm`">
      Let's add something here!
    </div>
    <c-btn flat
           dense
           noHover
           size="sm"
           textColor="dark-pink">
      Add new activity
    </c-btn>
  </div>
</template>

<script>
export default {
  props: {
    isCurrentDay: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-day{
  border: 2px dashed $soft-tone;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 16px 16px 8px;
  min-height: 128px;
  border-radius: 6px;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    // opacity: .15;
  }
}
</style>
