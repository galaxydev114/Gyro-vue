<template>
  <div class="col scores-container scores-container--show">
    <div class="d-flex justify-center items-center">
      <div class="q-mt-lg-lg  q-px-lg-lg q-px-md-lg">
        <div class="row justify-center q-mb-lg">
          <div v-for="cat in categoryItems" :key="cat.label" class="col-md-6 col-sm-6 col-12 q-px-lg-sm q-px-md-sm q-px-sm-sm">
            <div class="q-py-lg bordered q-ma-lg-lg q-ma-md-sm q-my-sm cat-plat-item relative-position"
              :class="[`cat-plat-item--${setupClass(cat.class)}`, {'row q-px-md': $q.screen.lt.sm, 'column justify-center': $q.screen.gt.xs }]"
              @click="onToggle(cat.class)" >
              <span class="q-mt-lg-lg text-label text-capitalize text-weight-bold">
                {{ cat.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center">
      <div class="col-6 q-px-lg-none q-pr-sm">
        <c-btn outline
              class="btn-join-fg"
              :bold="false"
              :class="{'full-width': $q.screen.lt.sm, 'btn-previous': $q.screen.gt.xs}"
              color="light-pink"
              @click="$emit('previous')">
          Previous
        </c-btn>
      </div>
      <div class="col-6 q-px-lg-none q-pl-sm">
        <q-btn unelevated
             class="q-btn-main q-px-md btn-join-fg"
             :class="{'full-width': $q.screen.lt.sm, 'btn-next': $q.screen.gt.xs}"
             color="dark-pink"
             :disable="selectedPlatform === ''"
             @click="$emit('next')">
          Next
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    selectedPlatform: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      categoryItems: [
        {
          step: 1,
          class: 'pc',
          label: 'PC'
        },
        {
          step: 2,
          class: 'console',
          label: 'Console'
        },
        {
          step: 3,
          class: 'nintendo',
          label: 'Nintendo'
        },
        {
          step: 4,
          class: 'mobile',
          label: 'Mobile'
        }
      ]
    }
  },
  methods: {
    onToggle (step) {
      this.$emit('selected', step)
    },
    setupClass (step) {
      return this.selectedPlatform === step ? `${step}-selected` : step
    }
  }
}
</script>

<style lang="scss">
  .text-label {
    font-family: Roboto;
    font-size: 20px;
    position: absolute;
    bottom: 16px;
    left: 16px;
  }
  .cat-plat-item {
    cursor: pointer;
    border: 1.5px solid $soft-tone;
    box-shadow: 0px 16px 32px rgba(0, 0, 0, 0.202551);
    border-radius: 6px;
    background-size: cover;
    aspect-ratio: 320 / 190;
    min-width: 180px;
    @media screen and (min-width: $breakpoint-sm-max) and (max-width: $breakpoint-lg-max) {
      min-width: 120px;
    }
    &:hover {
      border: 1.5px solid $dark-pink;
    }
    &--pc{
      background-image: linear-gradient(180deg, rgba(28, 16, 44, 0.3) 0%, #1C102C 100%), url('../../../assets/friend-group/pc-bg.png');
      &-selected {
        background-image: linear-gradient(0deg, rgba(200, 68, 97, 0.3), rgba(200, 68, 97, 0.3)), linear-gradient(180deg, rgba(28, 16, 44, 0.3) 0%, #1C102C 100%), url('../../../assets/friend-group/pc-bg.png');
        border: 1.5px solid $dark-pink;
      }
    }
    &--console{
      background-image: linear-gradient(180deg, rgba(28, 16, 44, 0.3) 0%, #1C102C 100%), url('../../../assets/friend-group/console-bg.png');
      &-selected {
        background-image: linear-gradient(0deg, rgba(200, 68, 97, 0.3), rgba(200, 68, 97, 0.3)), linear-gradient(180deg, rgba(28, 16, 44, 0.3) 0%, #1C102C 100%), url('../../../assets/friend-group/console-bg.png');
        border: 1.5px solid $dark-pink;
      }
    }
    &--nintendo{
      background-image: linear-gradient(180deg, rgba(28, 16, 44, 0.3) 0%, #1C102C 100%), url('../../../assets/friend-group/nintendo-bg.png');
      &-selected {
        background-image: linear-gradient(0deg, rgba(200, 68, 97, 0.3), rgba(200, 68, 97, 0.3)), linear-gradient(180deg, rgba(28, 16, 44, 0.3) 0%, #1C102C 100%), url('../../../assets/friend-group/nintendo-bg.png');
        border: 1.5px solid $dark-pink;
      }
    }
    &--mobile{
      background-image: linear-gradient(180deg, rgba(28, 16, 44, 0.3) 0%, #1C102C 100%), url('../../../assets/friend-group/mobile-bg.png');
      &-selected {
        background-image: linear-gradient(0deg, rgba(200, 68, 97, 0.3), rgba(200, 68, 97, 0.3)), linear-gradient(180deg, rgba(28, 16, 44, 0.3) 0%, #1C102C 100%), url('../../../assets/friend-group/mobile-bg.png');
        border: 1.5px solid $dark-pink;
      }
    }
  }
</style>
