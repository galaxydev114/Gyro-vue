<template>
  <div class="n-btn"
      :class="[`n-btn--${size}`,
      {
        'n-btn--no-width': dense || noWidth,
        'n-btn--padding-custom': paddingX !== undefined
      }]"
      :style="{
        '--padding-x-custom': paddingX
      }">
    <q-btn :type="type"
           :flat="flat"
           :dense="dense"
           :color="color"
           :outline="outline"
           :text-color="textColor"
           :disabled="disabled"
           @click="$emit('click')"
           :class="{
             'q-btn--no-hover': noHover,
             'q-btn--dashed': dashed,
             'q-btn--bold': bold,
             'q-btn--no-bg': noBg,
             'q-btn--width-auto': widthAuto,
             'q-btn--no-border': noBorder
           }"
    >
      <slot />
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'n-btn',
  props: {
    dense: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    noHover: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    dashed: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    noBg: {
      type: Boolean,
      default: false
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: () => 'dark-pink'
    },
    textColor: {
      type: String,
      default: () => 'light-pink'
    },
    size: {
      type: String,
      default: () => 'md'
    },
    paddingX: {
      type: String
    },
    bold: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'button'
    },
    widthAuto: {
      type: Boolean,
      default: false
    },
    noWidth: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.n-btn{
  min-width: 140px;
  box-sizing: border-box;
  &--no-width{
    min-width: unset;
  }
  .q-btn {
    font-family: 'rift', sans-serif!important;
    font-size: 18px;
    line-height: 22px;
    width: 100%!important;
    font-weight: 500;
    &-main {
      width: 100%;
      font-weight: 400;
    }
    &--outline {
      white-space: nowrap;
      .q-btn__wrapper:before {
        border: 2px solid $soft-tone;
      }
    }
    &--dashed{
      white-space: nowrap;
      .q-btn__wrapper:before {
        border-style: dashed !important;
      }
    }
    &--no-hover{
      .q-focus-helper{
        display: none;
      }
    }
    &--no-bg{
      background: transparent!important;
    }
    &--bold {
      font-weight: bold;
    }
    &--width-auto{
      width: unset!important;
    }
    &--no-border {
      border: none;
    }
  }
  &--padding-custom {
    .q-btn__wrapper{
      padding: 0px var(--padding-x-custom, 0px);
    }
  }
  &--xxs{
    .q-btn{
      font-size: .875rem;
      min-width: unset;
      &__wrapper{
        padding: 4px 12px;
      }
    }
  }
  &--xs{
    .q-btn{
      font-size: 1rem;
      min-width: unset;
      &__wrapper{
        padding: 8px 15px;
      }
    }
  }
  &--sm{
    .q-btn{
      font-size: 1rem;
      vertical-align: middle;
      text-align: center;
      box-sizing: border-box;
    }
  }
  &--xl {
    .q-btn {
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
    }
  }
}
</style>
