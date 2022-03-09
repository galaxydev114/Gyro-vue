<template>
  <div class="level"
       :class="`level--${num}`">
    <div class="level__item"
         v-for="i in 3"
         :class="{'level__item--filled': isFilled(i)}"
         :key="`level-${i}`"></div>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: () => 1
    }
  },
  methods: {
    isFilled (i) {
      return i <= this.num
    }
  }
}
</script>

<style lang="scss" scoped>
.level{
  $root: &;
  display: flex;
  align-items: flex-end;
  &__item{
    border-radius: 2px;
    border: 1.5px solid transparent;
    width: 5px;
    margin: 0 1px;
    display: block;
    &:nth-child(1){
      height: 6px;
    }
    &:nth-child(2){
      height: 10px;
    }
    &:nth-child(3){
      height: 14px;
    }
  }
  &--1{
    #{$root}__item{
      border-color: #2CAD6D;
      &--filled{
        background: #2CAD6D;
      }
    }
  }
  &--2{
    #{$root}__item{
      border-color: #BCD61C;
      &--filled{
        background: #BCD61C;
      }
    }
  }
  &--3{
    #{$root}__item{
      border-color: #F82A37;
      &--filled{
        background: #F82A37;
      }
    }
  }
}
</style>
