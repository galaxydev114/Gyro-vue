<template>
  <div class="unsupported-screen">
    <header-line />
    <div class="unsupported-screen__content text-center">
      <div class="text-h2 font-roboto text-bold " style="text-transform: unset">
        NOVOS will work on mobile phones.
      </div>
      <div class="text-h5 text-pink q-my-md">
        But not quite yet.
      </div>
      <div class="text-h4 text-weight-regular">
        For now, come back from a PC.
      </div>

      <q-img src="@/assets/unsupported-screen.webp" width="100%" class="q-mt-lg" />

    </div>

  </div>
</template>

<script>
export default {
  components: {
    'header-line': () => import('@/components/common/header-line')
  }
}
</script>

<style lang="scss" scoped>
.unsupported-screen{
  max-width: 100%;
  margin: auto;
  min-height: var(--app-height);
  display: flex;
  position: relative;
  z-index: 10;
  flex-wrap: wrap;
  &__content{
    padding: 40px 0;
    width: 90%;
    max-width: 500px;
    text-align: center;
    margin: 0 auto;
  }
}
</style>
