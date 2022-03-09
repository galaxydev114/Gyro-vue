<template>
  <div class="q-px-sm">
    <div class="fncs-ntf">
      <div class="text-h text-pink">
        GET READY FOR FNCS
      </div>
      <div class="q-pt-md q-pb-lg q-py-xs-none q-px-sm-sm" style="font-size: 16px">
        Update your training plan now
      </div>
      <c-btn size="xs"
             @click="trackAction('TP: updateFNCS6Ntf openModal'); updateModal = true"
             class="q-ml-auto update-btn">
        Let's start
      </c-btn>
      <div class="q-ml-md btn-close-wrapper"
           @click="$emit('hide')">
        <c-icon icon="plusPink" class="float-left" />
      </div>
    </div>
    <n-modal :visible="updateModal" @close="cancel">
      <!--      confirm-->
      <div class="q-pa-lg text-center">
        <div class="text-h3 text-pink">
          Update training plan?
        </div>
        <div class="q-mt-md q-mb-lg text-gray">
          The training activities in your current plan will change
        </div>
        <div class="row justify-center">
          <c-btn outline @click="cancel">
            Not now
          </c-btn>
          <c-btn class="q-ml-xs q-ml-sm-md" @click="update">
            Yes, update
          </c-btn>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script>
export default {
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  data () {
    return {
      updateModal: false
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
      this.trackAction('TP: updateFNCSNtf cancell')
      this.updateModal = false
    },
    update () {
      this.$emit('update')
      this.updateModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
.fncs-ntf {
  border: 1px solid $pink;
  border-radius: 6px;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  @media all and (max-width: $breakpoint-xs-max) {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 15px;
    margin: 20px 0 0;
  }
}
.update-btn{
  white-space: nowrap;
  flex: 0 0 160px;
  width: 160px;
  @media all and (max-width: $breakpoint-xs-max) {
    width: 100%;
    flex-basis: 100%;
  }
}
.btn-close-wrapper{
  transform: rotate(45deg);
  cursor: pointer;
  @media all and (max-width: $breakpoint-xs-max) {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
