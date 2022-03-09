<template>
  <n-modal :visible="visible">
    <div class="text-center">
      <div class="modal">
        <c-icon icon="tournament" width="160px" />
        <div class="text-h3 text-weight-bold" style="margin-top: -30px; text-transform: initial;">
          Tournament removed from your training schedule
        </div>
        <div class="row justify-around q-mt-lg">
          <c-btn class="font-roboto" @click="$emit('close')">
            Finish
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
  padding: 40px;
}
</style>
