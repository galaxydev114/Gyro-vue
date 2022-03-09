<template>
  <div class="question-point-option"
       :class="{
          'question-point-option--correct': isCorrect,
          'question-point-option--wrong': wrong,
          'question-point-option--animated': animated
        }"
       @click="onClick">
    <div class="question-point-option__index">
      <c-icon icon="check" v-if="isCorrect" width="10px"/>
      <c-icon icon="close" v-else-if="wrong" width="14px" />
      <span v-else>{{ index + 1 }}</span>
    </div>
    <div class="question-point-option__text">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      require: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    wrong: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      animated: false
    }
  },
  methods: {
    onClick () {
      this.animated = true
      setTimeout(() => {
        this.animated = false
        this.$emit('click')
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.question-point-option {
  $root: &;
  display: flex;
  align-items: center;
  width: 100%;
  border: 2px solid $soft-tone;
  border-radius: 6px;
  padding: 20px;
  transition: all .2s ease-in-out;
  &__index{
    width: 32px;
    height: 32px;
    background: $soft-tone;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    margin-right: 10px;
    flex:0 0 32px;
  }
  &__text{
    font-size: 14px;
    line-height: 19px;
  }
  &--wrong{
    border-color: $orange;
    #{$root}__index{
      background: $orange;
    }
  }
  &--correct{
    border-color: $green;
    #{$root}__index{
      background: $green;
    }
  }
  &--animated{
    transform: scale(.96);
  }
  &:hover,
  &.active{
    background: $dark-one;
    cursor: pointer;
  }
}
</style>
