<template>
  <div class="chip" :class="{
    'chip--gray': color === 'gray',
    'chip--green': color === 'green',
    'chip--yellow': color === 'yellow',
    'chip--red': color === 'red',
    'chip--blue': color === 'blue',
  }">
    <div class="chip__internal">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: () => 'gray'
    }
  }
}
</script>

<style lang="scss" scoped>
.chip {
  text-transform: uppercase;
  border: 2px solid $light-pink;
  border-radius: 6px;
  display: inline-block;
  box-sizing: border-box;

  &__tags {
    margin: 0 10px 10px 0;
    &:last-child {
      margin-right: 0;
    }
  }

  &__internal {
    color: $gray;
    background: rgba(244, 216, 233, 0.3);
    padding: 3px 10px;
    font-size: 12px;
    font-weight: bold;
    box-sizing: border-box;
  }
}

.chip--green {
  border-color: #2CAD6D;

  & > .chip__internal {
    background-color: rgba(44, 173, 109, 0.3);
  }
}
.chip--yellow {
  border-color: #E7A957;

  & > .chip__internal {
    background-color: rgba(231, 169, 87, 0.3);
  }
}
.chip--red {
  border-color: #E34F4F;

  & > .chip__internal {
    background-color: rgba(227, 79, 79, 0.3);
  }
}
.chip--blue {
  border-color: #594FE3;

  & > .chip__internal {
    background-color: rgba(89, 79, 227, 0.3);
  }
}
</style>
