<template>
  <div class="row items-center tournament-tag"
       :class="{'tournament-tag--colored': isNextTournamentInFuture}">
    <div class="tournament-tag__bg"></div>
    <div class="row q-mr-sm justify-center items-center tournament-tag__content">
      <c-icon class="q-mr-sm" :icon="'trophyNew'" :width="'16px'" />
      <template v-if="isNextTournamentInFuture">
        <span class="text-weight-bold">
          {{ tournament.title }}
        </span>
        <span class="text-gray q-ml-xs" v-if="daysAway > 0">
          ({{ daysAway }} day{{ daysAway > 1 ? "s" : "" }} left)
        </span>
        <span class="text-green q-ml-xs" v-else> (Today) </span>
      </template>
      <span v-else class="text-subtitle1 text-weight-bold">
        None selected, Update
        <span class="tournament-tag-cta" @click="$emit('click')">Here</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tournament: Object,
    oneline: Boolean
  },

  computed: {
    daysAway () {
      return Math.floor(
        -this.$date().startOf('day').diff(this.tournament.startAt, 'days', true)
      )
    },
    isNextTournamentInFuture () {
      return this.tournament && this.daysAway >= 0
    }
  }
}
</script>

<style lang="scss" scoped>
.tournament-tag {
  $root: &;
  border-radius: 6px;
  display: flex;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  height: 30px;
  position: relative;
  &__content{
    margin: 2px;
    position: relative;
    z-index: 3;
    padding: 4px 12px 4px 8px;
    border-radius: 6px;
  }
  &--colored{
    #{$root}__bg{
      background: linear-gradient(0deg, rgba(51,105,209,1) 0%, rgba(101,51,209,1) 100%);
      border-radius: 6px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index:2
    }
    #{$root}__content{
      background: rgb(76,55,119);
      background: linear-gradient(0deg, rgba(76,55,119,1) 0%, rgba(41,44,102,1) 100%);
    }
  }
  &-cta {
    color: $dark-pink;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
