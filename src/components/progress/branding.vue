<template>
  <div class="branding flex items-center">
    <img class="q-mr-sm" src="@/assets/ka-logo.png" height="100%" />
    <span class="text-regular" v-if="small">Built with Kinch Analytics</span>
    <div v-else>
      <div class="branding-built text-uppercase opacity-5">Built with</div>
      <div class="text-h5 font-roboto">Kinch Analytics</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    small: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.branding {
  &-built {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 120%;
  }
}
</style>
