<template>
  <n-modal :visible="visible"
           @close="$emit('close')">
    <div class="text-center q-px-lg q-py-lg">
      <div class="text-h3 q-mt-lg q-mb-md font-roboto text-pink" style="text-transform: unset">
        COMING SOON!
      </div>

      <div class="text-gray">
        The option of adding a tournament to your training schedule will be available soon!
      </div>
      <div class="d-flex items-center justify-between q-mt-xl">
        <c-btn class="full-width" @click="$emit('close')">
          Got it, thank you
        </c-btn>
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
