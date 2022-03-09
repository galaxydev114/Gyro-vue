<template functional>
  <section class="q-mt-xl">
    <div class="text-h4">Benchmark</div>
    <p
      v-if="props.subtitle"
      class="text-gray q-my-xs"
    >
      {{ props.subtitle }}
    </p>
    <div
      v-if="props.bronze"
      class="flex border-bottom items-center q-pb-sm q-mt-lg q-mb-sm text-h5"
    >
      <div class="q-mr-sm">
        <img src="./../../../assets/icons/bronze-icon.webp" width="26px" height="26px" class="float-left" />
      </div>
      <div class="text-weight-regular">Bronze:</div>
      <div class="q-ml-auto">
        {{ props.bronze }}
      </div>
    </div>

    <div
      v-if="props.silver"
      class="flex border-bottom items-center q-pb-sm q-mb-sm text-h5"
    >
      <div class="q-mr-sm">
        <img src="./../../../assets/icons/silver-icon.webp" width="26px" height="26px" class="float-left" />
      </div>
      <div class="text-weight-regular">Silver:</div>
      <div class="q-ml-auto">
        {{ props.silver }}
      </div>
    </div>

    <div
      v-if="props.gold"
      class="flex border-bottom items-center q-pb-sm q-mb-sm text-h5"
    >
      <div class="q-mr-sm">
        <img src="./../../../assets/icons/gold-icon.webp" width="26px" height="26px" class="float-left" />
      </div>
      <div class="text-weight-regular">Gold:</div>
      <div class="q-ml-auto">
        {{ props.gold }}
      </div>
    </div>

    <div
      v-if="props.platinum"
      class="flex border-bottom items-center q-pb-sm q-mb-sm text-h5"
    >
      <div class="q-mr-sm">
        <img src="./../../../assets/icons/platinum-icon.webp" width="26px" height="26px" class="float-left" />
      </div>
      <div class="text-weight-regular">Platinum:</div>
      <div class="q-ml-auto">
        {{ props.platinum }}
      </div>
    </div>

    <div
      v-if="props.diamond"
      class="flex border-bottom items-center q-pb-sm q-mb-sm text-h5"
    >
      <div class="q-mr-sm">
        <img src="./../../../assets/icons/diamond-icon.webp" width="26px" height="26px" class="float-left" />
      </div>
      <div class="text-weight-regular">Diamond:</div>
      <div class="q-ml-auto">
        {{ props.diamond }}
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    subtitle: { type: String },
    bronze: { type: String },
    silver: { type: String },
    gold: { type: String },
    platinum: { type: String },
    diamond: { type: String }
  }
}
</script>

<style>
</style>
