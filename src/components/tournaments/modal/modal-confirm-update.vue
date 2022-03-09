<template>
  <n-modal size="xl"
    :visible="visible"
    :showClose="!loading"
    max-height="100vh"
    @close="$emit('close')">
    <div v-if="!loading" class="modal-confirm text-center q-pa-lg">
      <div class="text-center modal-confirm__header">
          <c-icon icon="info" width="160px" />
          <div class="text-pink font-rift text-h5 text-weight-bold text-uppercase" style="margin-top: -40px">
            Add Tournament Preparation?
          </div>
      </div>

      <div class="text-h3 font-rift q-my-md" v-if="$q.screen.gt.xs" style="text-transform: unset">
        NOVOS will adjust your training schedule to<br/>
        maximize your tournament performance
      </div>

      <template v-else>
        <div class="text-h4 font-rift q-my-md" style="text-transform: unset">
          NOVOS will adjust your <br/>training schedule to
          maximize your<br/> tournament performance
        </div>
      </template>

      <div class="modal-confirm__preview q-mt-lg q-mx-auto">
        <q-img v-if="$q.screen.gt.xs"
          :src="`${$asset_url}/gyro/ui-assets/tournament-update-preview.png`" />
        <q-img v-else
          :src="`${$asset_url}/gyro/ui-assets/tournament-update-preview-small.png`" />
      </div>

      <div class="row justify-center q-mt-md q-col-gutter-md">
        <div class="modal-confirm__button col-xs-12 col-sm-6">
          <c-btn outline @click="$emit('cancel')">
            Cancel
          </c-btn>
        </div>
        <div class="modal-confirm__button col-xs-12 col-sm-6">
          <c-btn @click="$emit('confirm')">
            Update my Training Plan
          </c-btn>
        </div>
      </div>
    </div>
    <div v-else class="column" style="height: 700px; max-height: 80vh;">
      <div class="text-center q-py-xl q-px-xl q-my-auto">
        <q-circular-progress
          class="q-mx-auto q-mt-lg"
          show-value
          indeterminate
          size="130px"
          color="dark-pink"
          track-color="mid-tone">
          <img src="@/assets/trainingPlan/icons/calendar.svg">
        </q-circular-progress>
        <div class="q-mt-sm text-pink text-weight-bold text-h5">
          Updating your training plan
        </div>

        <div class="text-h3 font-roboto q-my-lg" v-if="$q.screen.gt.xs" style="text-transform: unset">
          Adding tournament to your schedule<br/>
          and re-generating Training Plan
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>
export default {
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-confirm {
  height: 100%;
  overflow: auto;

  &__header{
    background: url("./../../../assets/onboarding/completing-bg.png") center/contain no-repeat;
  }
  &__preview{
    max-width: 743px;
    max-height: 40vh;
    overflow: hidden;
    position: relative;
    @media (max-width: $breakpoint-sm-max) {
      max-height: 30vh;
      &:after {
        content: "";
        position: absolute;
        bottom: 0px;
        left: 0px;
        height: 50%;
        width: 100%;
        background: linear-gradient(0deg, $dark 0%, rgba(124, 39, 126, 0) 100%);
      }
    }
  }
  &__button {
    @media (min-width: $breakpoint-sm-min) {
      max-width: 250px;
    }
  }
}
</style>
