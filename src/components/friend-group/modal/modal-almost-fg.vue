<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    @close="$emit('close')">
    <div class="modal-fg-almost-details relative-position">
      <div class="mask-bg">
      </div>
      <div class="q-py-lg q-px-lg-lg q-px-sm-md q-px-md-lg">
        <div class="text-center q-py-md">
          <div class="text-white q-px-lg-lg q-px-sm-sm" :class="{'text-h1': $q.screen.gt.md, 'text-h2': $q.screen.lt.sm}">
            You're almost in your <br><span class="text-pink">friend group</span>
          </div>
        </div>
        <div class="q-pt-md almost-span text-center">
          <span>We need to analyze your performance and training for the next <span class="text-pink">X days</span> to assign you to the right Friend-group for you</span>
        </div>
        <div class="q-mt-lg q-px-lg-lg q-px-sm-sm text-center">
          <img src="@/assets/friend-group/almost-bg.png" class="full-width"/>
        </div>
        <div class="q-mt-lg q-py-md-md q-py-sm-sm row justify-center">
          <q-btn unelevated
            class="btn-join-fg q-px-lg"
            :class="{'full-width': $q.screen.lt.sm}"
            color="dark-pink"
            @click="goTrain()">
            Got it, let’s train!
          </q-btn>
        </div>
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
  data () {
    return {
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  methods: {
    goTrain () {
      this.$router.replace('/training-plan')
    }
  }
}
</script>

<style lang="scss">
  .modal-fg-almost-details {
    width: 85vw;
    max-width: 940px;
    .mask-bg {
      background-image: url('../../../assets/friend-group/mask-bg.png');
      min-height: 162px;
      position: absolute;
      width: 100%;
      @media screen and (max-width: $breakpoint-xs-max) {
        min-height: 112px;
      }
    }
    .almost-span {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 140%;
      padding: 0px 119px;
      color: #A79FB2;
      @media screen and (max-width: $breakpoint-xs-max) {
        padding: 0px 10px;
      }
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
    }
  }
</style>
