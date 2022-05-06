<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    @close="$emit('close')">
    <div class="modal-leave-reason-details q-py-lg q-px-lg-lg q-px-sm-md q-px-md-lg">
      <div class="text-center">
        <div class="text-white q-px-lg-lg q-px-sm-sm" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
          Tell us why the <span class="text-pink">Friend Group</span> doesn't fit for you
        </div>
      </div>
      <div class="q-pt-md q-px-lg-lg q-px-md-sm q-px-sm-none">
        <span class="text-pink text-h3 text-uppercase q-pb-sm font-rift">Choose Your Option</span>
        <div class="column text-gray q-pt-sm">
          <q-radio class="q-mt-sm" v-model="reasonOption" val="1" :label="options[0]" />
          <q-radio class="q-mt-sm" v-model="reasonOption" val="2" :label="options[1]" />
          <q-radio class="q-mt-sm" v-model="reasonOption" val="3" :label="options[2]" />
        </div>
        <div class="q-mt-md">
          <div class="q-mb-xs text-grey-7">Description of your problem</div>
          <q-input v-model="reason"
            style="min-height:unset"
            type="textarea"
            outlined
            placeholder="Enter Description"/>
        </div>
        <div class="q-mt-md row justify-end">
          <div class="col-12 col-md-6 q-py-sm">
            <q-btn unelevated
              class="btn-join-fg full-width"
              color="dark-pink"
              @click="onSubmit"
              :disable="reasonOption === 0 || (reasonOption === '3' && !reason)">
              Submit!
            </q-btn>
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
    }
  },
  data () {
    return {
      reasonOption: 0,
      reason: '',
      options: [
        'Too high level of players for me',
        'The language of the group doesn’t fit me',
        'Other (Tell why)'
      ]
    }
  },
  methods: {
    onSubmit () {
      let combinedReason = this.options[this.reasonOption]
      if (this.reasonOption === 3) {
        combinedReason += `: ${this.reason}`
      }
      this.$emit('submit', {
        reason: combinedReason
      })
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  }
}
</script>

<style lang="scss">
  .modal-leave-reason-details {
    width: 65vw;
    max-width: 647px;
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
    }
  }
</style>
