<template>
<div class="flex align-center">
  <q-spinner v-if="isLoading"/>
  <c-icon icon="couponGreen" v-else-if="isSuccessIconVisible"></c-icon>
  <c-icon icon="couponPink" v-else></c-icon>
</div>
</template>

<script>
export default {
  name: 'discount-icon',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    },
    isSuccessIconVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  }
}
</script>
