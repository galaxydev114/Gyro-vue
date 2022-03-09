<template>
  <n-modal :visible="visible" @close="$emit('close')">
    <div class="modal-knowledge text-center q-pa-lg">
      <div class="text-center modal-knowledge-header">
        <c-icon icon="knowledge" width="160px" />
        <div class="text-dark-pink font-rift text-h5 text-weight-bold text-uppercase" style="margin-top: -40px">
          Welcome to
        </div>
      </div>
      <div class="text-h3 q-mt-lg q-mb-md font-roboto" style="text-transform: unset">
        Knowledge time
      </div>
      <div class="q-mb-lg">
        Top quality video library curated by NOVOS team for you to watch, learn and improve
      </div>
      <div class="flex items-center q-py-sm">
        <c-icon icon="rightArrowPink" class="q-mr-md" width="14px"/>
        Choose a video to watch
      </div>
      <div class="flex items-center q-py-sm">
        <c-icon icon="rightArrowPink" class="q-mr-md" width="14px"/>
        Be an active listener & take notes
      </div>
      <div class="flex items-center q-py-sm">
        <c-icon icon="rightArrowPink" class="q-mr-md" width="14px"/>
        Don’t extend the activity time
      </div>
      <div class="divider q-my-lg"></div>
      <div class="text-center text-h4 font-roboto" style="text-transform: unset">
        Are you ready to revolutionize your training?
      </div>

      <div class="d-flex items-center justify-between q-mt-md">
        <c-btn class="full-width" @click="$emit('close')">
          Start Knowledge time
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
    },
    scores: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  data () {
    return {
      ratingModel: 4
    }
  },
  created () {
    this.trackAction('Knowledge time: show first modal')
  }
}
</script>

<style lang="scss" scoped>
.modal-knowledge-header{
  background: url("./../../assets/onboarding/completing-bg.png") center no-repeat;
  background-size: 100%;
}
.divider{
  display: block;
  width: 100%;
  height: 1px;
  background: $mid-tone;
}
</style>
