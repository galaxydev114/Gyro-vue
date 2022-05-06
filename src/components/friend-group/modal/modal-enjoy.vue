<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    @close="$emit('close')">
    <div class="modal-enjoy-details relative-position">
      <div class="mask-bg">
      </div>
      <div class="q-py-lg q-px-lg-lg q-px-sm-md q-px-md-lg">
        <div class="text-center q-pt-sm q-px-lg-lg q-px-sm-sm">
          <div class="text-white q-px-lg-lg q-px-sm-sm" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
            Enjoy your time with novos <br><span class="text-pink">Friends Group</span>
          </div>
          <div class="text-h5 text-weight-regular q-mt-sm q-px-md text-gray" ref="description">
            Is your group not meeting your expectations? Let us know in Discord
          </div>
        </div>
        <div class="q-pt-md q-px-lg-lg q-px-md-sm q-px-sm-none">
          <div class="q-pa-sm box-item full-width">
            <fg-box :name="friendGroupInfo && friendGroupInfo.name" :region="friendGroupInfo && friendGroupInfo.region"/>
            <preference-box :preferences="friendGroupInfo" class="q-mt-sm"/>
          </div>
          <div class="q-mt-lg row">
            <div class="col-12 col-md-6 q-py-sm q-pr-md-md q-pr-sm-none">
              <c-btn outline
                class="btn-join-fg full-width"
                color="light-pink"
                :bold="false"
                @click="$emit('leaveFg')"
              >
                <c-icon class="q-mr-sm" :icon="'trashWhite'" :width="'20px'" />
                Leave the group
              </c-btn>
            </div>
            <div class="col-12 col-md-6 q-py-sm q-pl-md-sm q-pl-sm-none">
              <c-btn outline
                class="btn-join-fg full-width"
                color="light-pink"
                :bold="false"
                @click="goToFriendGroup"
              >
                <c-icon class="q-mr-sm" :icon="'discord'" :width="'20px'" />
                Go To Discord
              </c-btn>
            </div>
          </div>
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
    },
    friendGroupInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      reasonOption: 0,
      feedbackModel: ''
    }
  },
  methods: {
    goToFriendGroup () {
      if (this.friendGroupInfo?.url) {
        window.open(this.friendGroupInfo?.url, '_blank')
      }
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal'),
    'fg-box': () => import('../includes/common/_fg-box'),
    'preference-box': () => import('../includes/common/_preference-box')
  }
}
</script>

<style lang="scss">
  .modal-enjoy-details {
    width: 85vw;
    max-width: 932px;
    .mask-bg {
      background-image: url('../../../assets/friend-group/mask-bg.png');
      min-height: 111px;
      position: absolute;
      width: 100%;
    }
    .box-item {
      background: $dark-one;
      border-radius: 24px;
    }
    button {
      font-size: 20px;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
    }
  }
</style>
