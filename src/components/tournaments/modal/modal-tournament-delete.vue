<template>
  <n-modal :visible="visible">
    <div class="text-center">
      <div class="modal">
        <c-icon icon="tournament" width="160px" />
        <div class="text-h3 text-weight-bold" style="margin-top: -30px; text-transform: initial;">
          Are you sure you want to remove this tournament out of your training schedule?
        </div>
        <div class="row justify-around q-mt-lg">
          <template v-if="inProgress">
            <div class="col-12 text-center q-mt-lg">
              <q-circular-progress
                indeterminate
                size="30px"
                color="dark-pink"
                track-color="mid-tone">
              </q-circular-progress>
            </div>
          </template>
          <template v-else>
            <c-btn class="font-roboto" outline @click="$emit('cancel')">
              Cancel
            </c-btn>
            <c-btn class="font-roboto" @click="$emit('confirm')">
              Remove
            </c-btn>
          </template>
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
    inProgress: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  }
}
</script>

<style lang="scss">
.modal {
  padding: 40px;
}
</style>
