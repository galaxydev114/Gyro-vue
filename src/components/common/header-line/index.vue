<template>
  <div class="onboarding__header full-width row items-center justify-between q-p-md">
    <div class="col-5 col-sm-2">
    </div>
    <div class="col-7 col-sm-8 text-center">
      <q-img src="@/assets/logo.svg" height="28px" width="156px" />
    </div>
    <div class="col-0 col-sm-2"></div>
  </div>
</template>

<script>
export default {
  props: {
    completing: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.onboarding{
  &__header{
    border-bottom: 1px solid $mid-tone;
    height: 100px;
    padding: 0 25px;
    justify-content: revert;
    @media all and (max-width: $breakpoint-xs-max){
      height: 70px;
      .col-5{
        order: 2;
        text-align: right;
      }
      .col-7{
        text-align: left;
      }
    }
  }
}
</style>
