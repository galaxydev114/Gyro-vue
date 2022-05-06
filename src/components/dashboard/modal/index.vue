<template>
  <q-dialog v-model="$_visible"
            @keydown.esc="closeOnEsc"
            :maximized="$q.screen.xs"
            no-backdrop-dismiss
            no-esc-dismiss
            :content-class="{'backdrop-dark': bgDarkMode}">
    <div class="n-modal"
         :style="`height: ${height}; width: ${getWidth}; max-height: ${maxHeight}`">
      <div class="n-modal__header-bg" v-if="showHeader && $q.screen.gt.sm">
        <img src="@/assets/modal-header.svg" />
      </div>
      <div class="n-modal__close"
           v-if="showClose && !forceHideClose"
           @click="$emit('close')">
        <c-icon icon="closeCircle" />
      </div>
      <div class="n-modal__content" :class="{ 'n-modal__content--no-padding': noPadding }">
        <slot />
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: () => 'md'
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    forceHideClose: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: () => 'auto'
    },
    maxHeight: {
      type: String,
      default: () => 'initial'
    },
    width: {
      type: String,
      default: () => 'auto'
    },
    bgDarkMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeOnEsc () {
      if (this.showClose) {
        this.$emit('close')
      }
    }
  },
  computed: {
    $_visible: {
      get: function () {
        return this.visible
      },
      set: function (val) {
        this.$emit('update-visible', val)
      }
    },
    getWidth () {
      switch (this.size) {
        case 'custom':
          return this.width
        case 'md':
          return '400px'
        case 'lg':
          return '600px'
        case 'xl':
          return '900px'
        default:
          return '400px'
      }
    }
  }
}
</script>

<style lang="scss">
.q-dialog{
  backdrop-filter: blur(2px);
  z-index: 15950;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
  &--seamless{
    backdrop-filter: none;
  }
}
.backdrop-dark {
  backdrop-filter: blur(6px);
}
.q-dialog .n-modal{
  background: $dark;
  max-width: 90%;
  border-radius: 12px;
  position: relative;
  overflow: unset;
  z-index: 2147483647;
  /deep/ * {
    user-select: none;
  }
  &__header-bg{
    height: 60px;
    overflow: hidden;
    display: block;
    background: linear-gradient(151.32deg, #D92779 17.68%, #7C277E 86.39%);
    border-radius: 12px 12px 0 0;
    position: relative;
    z-index: 9;
  }
  &__close{
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    transition: all .3s ease-in-out;
    z-index: 9999;
    &:hover{
      transform: scale(1.2);
    }
    @media (max-width: $breakpoint-sm-max) {
      top: 15px;
      right: 15px;
      img {
        width: 30px;
      }
    }
    @media (max-width: $breakpoint-410-max) {
      top: 10px;
      right: 10px;
      img {
        width: 25px;
      }
    }
  }
  &__content{
    width: 100%;
    height: 100%;
  }
  @media (max-width: $breakpoint-xs-max) {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    margin: 10px;
    &__content{
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px;
      &--no-padding {
        padding: 0;
      }
    }

  }
}
</style>
