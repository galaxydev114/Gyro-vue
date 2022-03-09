<template>
  <n-modal :visible="visible"
           showClose
           @close="goToPlan">
    <div class="modal-congrats text-center">
      <div class="text-center congrats-all-header">
        <c-icon icon="done" :width="$q.screen.xs ? '100px' : '160px'" />
        <div class="text-pink font-rift text-h5 text-weight-bold text-uppercase" style="margin-top: -20px">
          congratulations!
        </div>
      </div>
      <div class="text-h3 q-mt-xs q-mt-sm-md q-mb-lg font-roboto" style="text-transform: unset">
        Thank you for joining <br/><span class="text-pink">NOVOS</span>!
      </div>
      <div class="text-h5 text-weight-regular q-mb-sm">
        What now?
      </div>
      <ul class="text-left">
        <li class="text-h5 text-weight-regular q-py-sm flex no-wrap items-start"
            v-for="(text, i) in texts"
            :key="`text-${i}`">
          <c-icon icon="purpleCheck" width="14px" style="height: 20px" />
          <div class="q-pl-md" style="line-height: 22px">
            {{ text }}
          </div>
        </li>
      </ul>

      <div class="fake-line" />
      <div class="d-flex column items-center justify-between">
        <div class="text-h4 q-mb-lg">
          Are you ready to revolutionize your training?
        </div>
        <c-btn class="full-width"
               @click="goToPlan">
          Continue to training plan
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
  },
  methods: {
    goToPlan () {
      this.$emit('close')
    }
  },
  computed: {
    texts () {
      return ['Follow your weekly personal training plan', 'Customize activities to your needs', 'Enjoy always updating exclusive content']
    }
  }
}
</script>

<style lang="scss" scoped>
.fake-line{
  height: 1px;
  width: 100%;
  background: $soft-tone;
  margin: 30px 0;
  @media all and (max-width: $breakpoint-xs-max){
    margin: 5px 0 20px;
  }
}
ul{
  padding: 0;
  list-style: none;
  @media all and (max-width: $breakpoint-xs-max){
    margin-top: 0;
  }
}

@media (max-width: $breakpoint-565-max) {
  .modal-congrats{
    padding: 20px;
    .congrats-all-header{}
  }
}

@media (max-width: $breakpoint-410-max) {
  .modal-congrats {
    padding: 10px;
    li{
      padding: 0 0 10px 0;
      &:last-child{
        padding-bottom: 0;
      }
    }
  }
  .text-h5{
    font-size: 12px;
  }
  .text-h4{
    font-size: 14px;
  }
}
</style>
