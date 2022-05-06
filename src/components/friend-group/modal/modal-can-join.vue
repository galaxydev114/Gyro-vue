<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    @close="$emit('close')">
    <div class="modal-canjoin-details relative-position">
      <div class="mask-bg">
      </div>
      <div class="q-py-lg q-px-lg-lg q-px-sm-md q-px-md-lg">
        <div class="text-center q-px-lg-lg q-px-sm-sm">
          <div class="text-white q-px-lg-lg q-px-sm-sm" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
            We've found the best <br><span class="text-pink">Friend Group</span> for you
          </div>
          <div class="text-h5 text-weight-regular q-mt-sm q-px-md text-gray" ref="description">
            Join it now to get to know them
          </div>
        </div>
        <div class="q-pt-md q-px-lg-lg q-px-md-sm q-px-sm-none">
          <div class="q-pa-sm box-item full-width">
            <fg-box :region="friendGroupInfo && friendGroupInfo.region" :name="friendGroupInfo && friendGroupInfo.name" />
            <preference-box :preferences="friendGroupInfo" class="q-mt-sm"/>
          </div>
          <div class="q-mt-lg row">
            <div class="col-12 col-md-6 q-py-sm q-pr-md-md q-pr-sm-none">
              <c-btn outline
                class="btn-join-fg full-width"
                color="light-pink"
                :bold="false"
                @click="$emit('changePrefs')"
              >
                <c-icon class="q-mr-sm" :icon="'refreshWhite'" :width="'20px'" />
                Change My Preferences
              </c-btn>
            </div>
            <div class="col-12 col-md-6 q-py-sm q-pl-md-md q-pl-sm-none">
              <q-btn unelevated
                class="btn-join-fg full-width"
                color="dark-pink"
                @click="$emit('joinFg')"
              >
                <c-icon class="q-mr-sm" :icon="'joinWhite'" :width="'20px'" />
                Join Friends group
              </q-btn>
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
  components: {
    'n-modal': () => import('@/components/dashboard/modal'),
    'fg-box': () => import('../includes/common/_fg-box'),
    'preference-box': () => import('../includes/common/_preference-box')
  }
}
</script>

<style lang="scss">
  .modal-canjoin-details {
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
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
    }
  }
</style>
