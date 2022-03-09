<template>
  <n-modal :visible="visible"
           size="custom"
           width="550px"
           @close="$emit('close')">
    <div class="text-center q-px-md q-px-sm-xl q-pt-xl q-pb-lg">
      <div class="text-center congrats-all-header">
        <div class="text-dark-pink font-rift text-h5 text-weight-bold text-uppercase">
          your ultimate training is one click away
        </div>
      </div>
      <div class="text-h1 q-mt-lg q-mb-md" style="text-transform: unset">
        Are you ready for the challenge?
      </div>
      <div class="q-mb-md">
        Hard work and commitment are necessary to reach your goal, and NOVOS will be there with you
      </div>

      <div class="flex flex-wrap q-mt-lg">
        <c-btn class="full-width" @click="$emit('next')">
          i'm ready!
        </c-btn>
        <c-btn class="full-width q-mt-md" flat @click="$emit('close')" textColor="grey-7">
          No, I want to reduce training time
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

<style lang="scss" scoped>
@media all and (max-width: $breakpoint-xs-max){
  .text-h1 {
    font-size: 2.25rem;
  }
}
</style>
