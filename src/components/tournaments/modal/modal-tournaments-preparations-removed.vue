<template>
  <n-modal :visible="visible" size="lg" show-close @close="$emit('close')">
    <div class="text-center">
      <div class="modal">
        <c-icon icon="tournament" width="160px" />
        <div class="text-h3 text-weight-bold q-mb-sm" style="margin-top: -50px; text-transform: initial;">
          Tournament preparations removed
        </div>
        <div class="q-mb-lg">
          Some of your tournaments have been rescheduled or canceled,
          so we'll remove the prep activities from your Training Plan.
        </div>
        <div class="text-gray text-weight-bold text-center text-h5">
          Tournaments changed:
        </div>
        <div class="container q-mt-md text-left">
          <tournament-item v-for="(tournament, i) in tournaments"
                           :key="`tournament-${i}`"
                           v-bind="tournament"
                           :class="{'q-mb-sm': i + 1 < tournaments.length}"
                           small
          />
        </div>
        <div class="row justify-center q-mt-lg q-col-gutter-md">
          <c-btn class="font-roboto col-xs-12 col-sm-6"
                 outline
                 @click="$emit('close')">
            Got it, thank you
          </c-btn>
          <c-btn class="font-roboto col-xs-12 col-sm-6"
                 @click="$emit('confirm')">
            add new tournaments
          </c-btn>
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
    tournaments: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal'),
    'tournament-item': () => import('@/components/tournaments/days-list/tournament')
  }
}
</script>

<style lang="scss" scoped>
.modal {
  padding: 40px;
}
.container {
  max-height: 40vh;
  overflow-y: auto;
}
</style>
