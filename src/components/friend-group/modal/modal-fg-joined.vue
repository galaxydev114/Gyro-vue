<template>
  <n-modal :visible="visible"
    size="custom"
    @close="$emit('close')">
    <div class="modal-fg-joined q-py-lg q-px-lg-lg q-px-md-lg">
      <div class="mask-bg items-center text-center">
      </div>
      <div class="q-px-xs-md q-px-md-none">
        <div class="text-center q-pt-sm">
          <span class="text-pink font-rift text-h4">You Joined a Friends group <br> succesfully!</span>
        </div>
        <div class="q-py-md almost-span text-center q-px-sm">
          Time to meet your teammates!
        </div>
        <div class="q-py-sm row justify-center">
          <q-btn unelevated
            class="btn-join-fg full-width"
            color="dark-pink"
            @click="showTooltip()">
            Let's go
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
    showTooltip () {
      if (!this.$route.query.joined) {
        this.$router.replace(`${this.$route.path}?joined=1`)
      }
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  .modal-fg-joined {
    width: 85vw;
    max-width: 384px;
    .mask-bg {
      background-image: url('../../../assets/friend-group/mask-bg-joined.svg');
      height: 133px;
      width: 100%;
    }
    .almost-span {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 32px;
      color: #FFFFFF;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
      .almost-span {
        font-size: 20px;
        line-height: 24px;
      }
    }
  }
</style>
