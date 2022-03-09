<template>
  <div @click="onClick" class="filter-item" :class="{'filter-item--disabled': isClicked}">
    <div class="filter-item__icon q-mr-sm">
      <slot name="icon"/>
    </div>
    <span class="text-h5" :class="{
      'text--pink': color === 'pink',
      'text--gray': color === 'gray'
    }"><slot/></span>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'pink'
    }
  },

  data () {
    return {
      isClicked: false
    }
  },

  methods: {
    onClick () {
      this.isClicked = !this.isClicked
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-item {
  width: fit-content;
  height: 48px;
  box-sizing: border-box;
  border: 1.5px solid $soft-tone;
  background-color: $dark-one;
  border-radius: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  color: $pink;
  cursor: pointer;
  transition: background-color .2s, opacity .2s;

  &:hover {
    background-color: $soft-tone;
  }

  &:active {
    background-color: $mid-tone;
  }

  &--disabled {
    opacity: .5;
  }

  &--white {
    color: $gray;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: $soft-tone;
  }

  @media (max-width: $breakpoint-tablet-max) {
    height: 32px;
    padding: 6px;
  }
}

.text--pink {
  color: $pink;
}

.text--gray {
  color: $gray;
}
</style>
