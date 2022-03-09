<template>
  <n-modal :visible="visible"
           @close="closeModal"
           size="custom"
           width="700px"
           show-close>
    <div class="modal-marketing-questions">
      <iframe :src="typeformModalUrl" />
    </div>
  </n-modal>
</template>

<script>

export default {
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  props: {
    typeformModalUrl: {
      type: String,
      require: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal () {
      this.$emit('closeModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-marketing-questions{
  iframe{
    pointer-events: all;
    border: none;
    width: 700px;
    height: 700px;
    float: left;
    border-radius: 12px;
    overflow: hidden;
    @media (max-width: $breakpoint-sm-max) {
      width: 80vw;
      height: 400px;
    }
    @media (max-width: $breakpoint-xs-max) {
      width: 90vw;
      height: 350px;
    }
  }
}
</style>
