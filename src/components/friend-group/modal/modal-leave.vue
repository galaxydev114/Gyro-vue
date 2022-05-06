<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    :bgDarkMode="true"
    @close="$emit('close')">
    <div class="modal-leave-details relative-position">
      <div class="mask-bg">
      </div>
      <div class="q-py-lg q-px-lg-lg q-px-sm-md q-px-md-lg">
        <div class="text-center q-px-lg-lg q-px-sm-sm">
          <div class="text-white q-px-lg-lg q-px-sm-sm" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
            Are you sure you want to <span class="text-pink">leave</span> friends group?
          </div>
          <div class="q-mt-sm q-px-md">
            <img
              :src="questionIcon"
              :width="160"
              :height="160"/>
          </div>
        </div>
        <div class="q-pt-md q-px-lg-lg q-px-md-sm q-px-sm-none">
          <div class="q-mt-md row justify-end">
            <div class="col-12 col-md-6 q-py-sm q-pr-md-md q-pr-sm-none">
              <c-btn outline
                class="btn-join-fg full-width"
                color="light-pink"
                @click="$emit('leave')"
              >
                Leave group
              </c-btn>
            </div>
            <div class="col-12 col-md-6 q-py-sm q-pl-md-md q-pl-sm-none">
              <q-btn unelevated
                class="btn-join-fg full-width"
                color="dark-pink"
                @click="$emit('close')"
              >
                Stay in Group
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>
import { mapMutations } from 'vuex'
import questionIcon from '@/assets/friend-group/question-mark.svg'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      questionIcon
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  methods: {
    ...mapMutations({
      setJoinFGButtonState: 'user/setJoinFGButtonState'
    })
  }
}
</script>

<style lang="scss">
  .modal-leave-details {
    width: 85vw;
    max-width: 600px;
    .mask-bg {
      background-image: url('../../../assets/friend-group/mask-bg.png');
      min-height: 111px;
      position: absolute;
      width: 100%;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
    }
  }
</style>
