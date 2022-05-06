<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    @close="$emit('close')">
    <div class="modal-find-fg-details q-py-lg q-px-lg-lg q-px-sm-md q-px-md-lg">
      <div class="text-center">
        <div class="text-white q-px-lg-lg q-px-sm-sm" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
          We will find the best<br><span class="text-pink">friends group</span> for you asap
        </div>
        <div class="text-h4 text-weight-regular q-mt-sm" ref="description">
          {{isWaitingForAdmin ? 'Our admins will get in touch soon, or ping us on discord': 'In a few days you will get your friend group. Stay tuned'}}
        </div>
      </div>
      <div class="q-pt-md q-px-lg-lg q-px-md-sm q-px-sm-none">
        <div class="box-item full-width">
          <find-step />
          <preference-box :preferences="preferences" class="q-mt-sm"/>
        </div>
        <div class="q-mt-md row justify-end">
          <div class="col-12 col-md-6 q-py-sm q-pr-md-sm q-pr-sm-none">
            <c-btn outline
              class="btn-join-fg full-width"
              color="light-pink"
              :bold="false"
              @click="$emit('cancel')">
              <c-icon class="q-mr-sm" :icon="'trashWhite'" :width="'20px'" />
              I don't need a group
            </c-btn>
          </div>
          <div v-if="!isWaitingForAdmin" class="col-12 col-md-6 q-py-sm q-pl-md-sm q-p1-sm-none">
            <c-btn outline
              class="btn-join-fg full-width"
              color="light-pink"
              :bold="false"
              @click="changePreference">
              <c-icon class="q-mr-sm" :icon="'changeWhite'" :width="'20px'" />
              Change My preferences
            </c-btn>
          </div>
        </div>
      </div>
      <c-btn outline
        class="btn-join-fg full-width"
        color="light-pink"
        :bold="false"
        @click="passAdmin">
        <c-icon class="q-mr-sm" :icon="'changeWhite'" :width="'20px'" />
        Pass (Admin)
      </c-btn>
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
    isWaitingForAdmin: {
      type: Boolean,
      default: false
    },
    preferences: {
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
  components: {
    'n-modal': () => import('@/components/dashboard/modal'),
    'preference-box': () => import('../includes/common/_preference-box'),
    'find-step': () => import('../includes/common/_find-step')
  },
  methods: {
    changePreference () {
      this.$router.push('/friend-group')
    },
    passAdmin () {
      this.$emit('passAdmin')
    }
  }
}
</script>

<style lang="scss">
  .modal-find-fg-details {
    width: 85vw;
    max-width: 940px;
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
    }
  }
</style>
