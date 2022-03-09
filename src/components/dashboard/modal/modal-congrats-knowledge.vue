<template>
  <n-modal :visible="visible"
           showClose
           @close="$emit('close')">
    <div class="modal-congrats text-center">
      <div class="text-center congrats-all-header">
        <c-icon icon="done" width="160px" />
        <div class="text-dark-pink font-rift text-h5 text-weight-bold text-uppercase" style="margin-top: -40px">
          Time's up!
        </div>
      </div>
      <div class="text-h3 q-mt-lg q-mb-xl font-roboto" style="text-transform: unset">
        Congratulations, you finished your <span class="highlight">Knowledge Time</span> activity!
        <p class="font-roboto" style="font-size: 20px; margin: 10px; font-weight: normal">
          Let's continue training
        </p>
      </div>
      <div class="d-flex items-center justify-between q-mt-xl">
        <c-btn class="full-width" @click="$emit('back-to-tp')">
          Back to Training Plan
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
      default: true
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  data () {
    return {
      ratingModel: 4
    }
  }
}
</script>

<style lang="scss">
.modal-congrats {
  padding: 18px 40px;
}
.highlight {
  color: $pink
}
.congrats-all-header{
  background: url("./../../../assets/onboarding/completing-bg.png") center no-repeat;
  background-size: 100%;
}
.scores-block{
  border: 1px solid $soft-tone;
  border-radius: 6px;
  padding: 10px 30px;
  width: auto;
  margin: 10px auto;
  flex: 0;
  display: inline-flex;
}
</style>
