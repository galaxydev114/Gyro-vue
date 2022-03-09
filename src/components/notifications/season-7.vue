<template>
  <div class="q-px-sm">
    <div class="season-7-ntf">
      <div class="text-h5 text-pink">
        NEW META UPDATE!
      </div>
      <div class="text-subtitle1 q-pt-md q-pb-lg q-py-xs-none q-px-sm-sm">
        New activities have arrived along with Fortnite's new season!
      </div>
      <c-btn size="xs"
             :bold="false"
             @click="trackAction('TP: updateSeason7Ntf openModal'); updateModal = true"
             class="q-ml-auto update-btn">
        update my training plan
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
      this.trackAction('TP: updateSeason7Ntf cancell')
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
.season-7-ntf {
  border: 1px solid $pink;
  border-radius: 6px;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  background: url("./../../assets/other/season-7-bg.png");
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
