<template>
  <div class="training-plan__time-section"
       :class="{'training-plan__time-section--animate': animate}"
       @mouseover="showEdit = true"
       @mouseleave="showEdit = false">
    <div v-if="start" class="training-plan__time-section-label">
      {{ showTme }}
    </div>
    <div v-else class="training-plan__time-section-label">New time section</div>
    <div class="training-plan__time-section-action full-width flex items-center justify-between q-pl-md">
      <div style="cursor: pointer"
           @click="$emit('change-time')"
           v-if="showEdit || $q.screen.lt.sm">
        <c-icon icon="edit" class="float-left" />
        <q-tooltip
          v-if="$q.screen.gt.xs"
          anchor="top middle"
          self="bottom middle"
          max-width="240px"
          content-style="background-color: #382B4B; font-size: 14px"
          :offset="[10, 10]"
        >
          Edit section time
        </q-tooltip>
      </div>
      <div
        style="cursor: pointer"
        class="q-ml-auto"
        data-intercom-target="Add activity button"
        @click="$emit('add')"
      >
        <c-icon icon="plusPink" class="q-ml-auto float-left" />
        <q-tooltip
          v-if="$q.screen.gt.xs"
          anchor="top middle"
          self="bottom middle"
          max-width="240px"
          content-style="background-color: #382B4B; font-size: 14px"
          :offset="[10, 10]"
        >
          Add an activity
        </q-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    start: {
      type: String,
      require: true
    },
    end: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      showEdit: false,
      init: false,
      animate: false
    }
  },
  computed: {
    showTme () {
      return `${this.$dayjs.timeOfDay(this.start).format('h:mma')} ${this.end ? ' - ' + this.$dayjs.timeOfDay(this.end).roundMinsBlock(15).format('h:mma') : ''}`
    }
  },
  mounted () {
    setTimeout(() => {
      this.init = true
    }, 300)
  },
  watch: {
    showTme () {
      if (this.init) {
        this.animate = true
        setTimeout(() => {
          this.animate = false
        }, 1600)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.training-plan{
  &__time-section{
    $root: &;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 2px solid $soft-tone;
    border-bottom: 2px solid $soft-tone;
    padding: 18px 0 18px 15px;
    color: $gray;
    order: 1;
    margin: 0 0 18px 0;
    position: relative;
    &--animate{
      #{$root}-label{
        color: $dark-pink;
        transform: scale(1.1);
      }
    }
    &:before{
      position: absolute;
      content: "";
      width: 2px;
      height: 24px;
      background: $soft-tone;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
    &-label{
      font-weight: bold;
      white-space: nowrap;
      transition: all .3s ease-in-out;
    }
    &:hover{
      color: #fff;
    }
    &:first-child{
      border: none;
      padding: 0 0 0 15px;
    }
  }
}
</style>
