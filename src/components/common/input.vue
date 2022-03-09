<template>
  <div class="input-wrapper">
    <label v-if="label" class="label">Some text here</label>
    <input
      :class="{
        'input': true,
        'input--icon': icon,
        'input--disabled': disabled
      }"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
    />

    <div v-if="icon === 'search'" class="input-wrapper__icon">
      <img src="@/assets/icons/search.svg" alt="search icon"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String
    },
    icon: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.input-wrapper {
  position: relative;
  display: flex;
  flex-flow: column;
}
.input-wrapper__icon {
  position: absolute;
  top: 12px;
  left: 15px;
}

.label {
  line-height: 19px;
  font-weight: bold;
  color: $gray;
  user-select: none;
}

.input {
  padding: 15px;
  border-radius: 6px;
  box-sizing: border-box;
  border: 2px solid rgba(67,53,88, 0.9);
  background-color: rgba(0, 0, 0, 0);
  color: $gray;
  height: 46px;
}
.input::placeholder {
  color: $gray;
  opacity: 0.5;
}
.input:focus{
  outline: none;
  border: 2px solid $light-pink;
}

.input--disabled {
  border-color: $gray;
  opacity: 0.3 !important;
  cursor: not-allowed;
}
.input--disabled::placeholder {
  color: $gray;
}

.input--icon {
  padding-left: 45px;
}

</style>
