<template>
  <div class="categories-item"
       :class="{'categories-item--active': isActive}"
       @click="$emit('click')">
    <routine-category :category="name" small/>
    <div class="text-subtitle2 opacity-5">
      {{ count }} videos
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      require: true
    },
    count: {
      type: Number,
      require: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'routine-category': () => import('@/components/common/activity-category')
  }
}
</script>

<style lang="scss">
.categories-item{
  padding: 15px;
  border: 2px solid $soft-tone;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  transition: all .2s ease-in-out;
  &--active{
    border-color: $dark-pink;
  }
  &:hover{
    cursor: pointer;
    background: rgba(255, 255, 255, .03);
  }
}
</style>
