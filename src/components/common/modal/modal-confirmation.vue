<template>
  <n-modal :visible="visible">
    <div class="routine__m text-center">
      <div class="routine__mcontent">
        <div class="text-h3 text-weight-bold q-mx-auto q-my-lg">
          <slot />
        </div>
        <div v-if='!hideCancelButton' class="d-flex items-center justify-between">
          <c-btn outline @click="$emit('cancel')">
            {{ cancelText }}
          </c-btn>
          <c-btn @click="$emit('confirm')">
            {{ confirmText }}
          </c-btn>
        </div>
        <div v-else class="d-flex items-center justify-center">
          <c-btn @click="$emit('confirm')">
            {{ confirmText }}
          </c-btn>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    hideCancelButton: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  }
}
</script>

<style lang="scss">
.routine{
  &__mmodal{
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  &__mcontent{
    padding: 30px;
  }
  &__mfooter{
    background: $dark-one;
    padding: 5px 10px;
    font-size: 14px;
    .n-btn{
      display: inline-block;
      .q-btn{
        font-family: 'Roboto', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif!important;
        text-transform: lowercase;
        font-weight: 400;
        line-height: inherit;
        font-size: 14px;
      }
    }
  }
}
</style>
