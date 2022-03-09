<template>
  <div class="loader">
    <q-circular-progress
      indeterminate
      size="80px"
      color="dark-pink"
      track-color="mid-tone"
    />
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.loader {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(var(--app-height) - 200px)!important;
}
</style>
