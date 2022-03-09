<template>
  <div class="page-loader">
    <q-circular-progress
      class="q-mx-auto q-mt-lg"
      indeterminate
      size="100px"
      color="dark-pink"
      track-color="mid-tone">
    </q-circular-progress>
  </div>
</template>

<style lang="scss" scoped>
.page-loader{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .6);
  z-index: 9999;
  backdrop-filter: blur(2px);
}
</style>
