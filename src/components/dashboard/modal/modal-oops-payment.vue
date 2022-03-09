<template>
  <n-modal :visible="visible" @close="$emit('close')">
    <div class="modal-oops text-center">
      <img
        src="@/assets/onboarding/info-icon.svg"
        class="q-mt-md"
        height="160" width="160"
      />

      <div class="text-h2" style="margin-top: -40px">
        Something went wrong
      </div>

      <div class="modal-oops__footer">
        <c-btn class="q-mt-xs text-uppercase" @click="$emit('try-again')">
          Try Again
        </c-btn>

        <c-btn outline class="q-mt-xs text-uppercase" @click="$emit('back')">
          Back to training plan
        </c-btn>
      </div>
    </div>
  </n-modal>
</template>

<script>
export default {
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.modal-oops{
  &__footer{
    padding: 170px 40px 40px;
    width: 100%;
    background: url("./../../../assets/oops.png") center bottom no-repeat;
  }
}
</style>
