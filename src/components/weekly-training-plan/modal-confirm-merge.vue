<template>
  <n-modal :visible="visible">
    <div class="modal__m text-center">
      <div class="modal__mcontent">
        <div class="text-h3 text-weight-bold">
          Training time sections will merge
        </div>
        <div>
          You already have a training time section scheduled here
        </div>
        <div class="d-flex items-center justify-between">
          <c-btn outline @click="$emit('cancel')">
            Cancel
          </c-btn>
          <c-btn @click="$emit('confirm')">
            Merge
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
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  }
}
</script>

<style lang="scss">
.modal {
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
