<template>
  <q-card tag="div"
          bordered
          v-if="data.title"
          class="tournament"
          :class="[
            {'tournament--done': isTournamentOver},
            {'tournament--is-current-day': isCurrentDay},
            {'tournament--drag': true},
         ]">
    <div class="row">
      <div class="col">
        <q-card-section>
          <div class="text-subtitle text-gray d-flex items-center justify-between"
              :class="{
                  'opacity-5': isTournamentOver
          }">
            <n-category category="tournament" size="20px" class="text-weight-regular" :uppercase="false"/>
          </div>
        </q-card-section>
        <q-card-section class="text-left q-py-none col" style="min-height: 28px">
          <div :class="isCurrentDay ? 'text-h3 text-green' : 'text-h5 text-gray'">
            {{ data.title }}
          </div>
        </q-card-section>
        <q-card-section class="text-left text-gray q-pt-none q-pb-md col" style="min-height: 28px">
          Good luck
        </q-card-section>
      </div>
      <div class="tournament__thumbnail q-pa-sm">
        <q-img
          style="border-radius: 6px;"
          :ratio="1"
          :src="data.thumbnail"
        />
      </div>
    </div>

    <div class="tournament__loader" v-if="loading">
      <q-circular-progress
        indeterminate
        size="30px"
        color="dark-pink"
        track-color="mid-tone">
      </q-circular-progress>
    </div>
  </q-card>
</template>

<script>
import paymentMixin from '@/mixins/payment.mixin'

export default {
  props: {
    isCurrentDay: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    'n-category': () => import('@/components/common/activity-category')
  },
  mixins: [paymentMixin],
  data () {
    return {
      loading: false
    }
  },
  computed: {
    isTournamentOver () {
      return this.$date(this.data.endAt).isBefore(this.$date())
    }
  },
  methods: {
    doClick () {
      this.$emit('click', this.data.id)
    }
  }
}
</script>

<style lang="scss">
.tournament{
  $root: &;
  transition: all .3s ease-in-out;
  min-height: min-content;
  width: 100%;
  position: relative;
  display: block;
  z-index: 3;
  padding: 4px 2px;
  background: $dark-one;
  border: none;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.202551);
  &__done{
    position: absolute;
    top: 0;
    right: 0;
    width: 44px;
    height: 24px;
    text-align: center;
    background: $green;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    display: flex;
    padding: 7px;
    align-items: flex-start;
    justify-content: flex-end;
  }
  &__thumbnail{
    width: 120px;
  }
  &__loader{
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .text-h3,
  .text-h5{
    font-family: 'Roboto', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif!important;
    text-transform: unset;
  }
  &:hover{
    text-decoration: none;
    background: $dark-sec;
    transform: scale(1.02);
    z-index: 5;
    #{$root}__footer{
      max-height: 44px;
      opacity: 1;
      overflow: unset;
    }
  }
  @media all and (max-width: $breakpoint-xs-max) {
    text-decoration: none;
    background: $dark-sec;
    z-index: 5;
    &--is-current-day {
      background: $dark-sec;
    }
  }
  &:last-child{
    margin-bottom: 0;
  }

  border-left: 5px solid $gray;
  border-left-color: $orange;

  &--done{
    .text-h5,
    .text-h3{
      color: #5B4F6C!important;
      text-decoration: line-through;
    }
    .text-gray{
      color: #5B4F6C!important;
    }
  }
  &--link{
    cursor: pointer;
  }
  &--drag{
    cursor: pointer;
  }
  @media all and (min-width: $breakpoint-sm-min) {
    &--is-current-day {
      background: rgba(255, 255, 255, .03);
    }
  }
  &.sortable-chosen{
    opacity: .2!important;
  }
  &--done{
    border: 2px solid $mid-tone;
    border-left: 5px solid $mid-tone;
    box-shadow: unset;
    background: $dark;
    &:hover{
      background: inherit;
    }
    #{$root}__footer{
      background: $dark;
      border-bottom: 2px solid $mid-tone!important;
      border-right: 2px solid $mid-tone;
      border-left: 5px solid $mid-tone!important;
      margin-right: -1px;
    }
  }
  .opacity-7{
    opacity: .7;
  }
}
</style>
