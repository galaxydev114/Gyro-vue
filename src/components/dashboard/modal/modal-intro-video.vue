<template>
  <n-modal :visible="visible"
           size="lg"
           @close="$emit('close')">
    <div class="text-center q-pt-md q-pb-lg q-px-lg">
      <c-icon icon="tournament" width="160px" />
      <div class="full-width text-h2 text-center" style="margin-top: -50px;">
        {{ title }}
      </div>
      <div class="full-width text-center q-mt-md q-mb-lg text-gray"
           style="font-size: 16px">
       {{ description }}
      </div>
      <div>
        <n-multimedia v-if="videoUrl" :src="videoUrl" @click="$emit('play-video')" @ended="$emit('finish-watch-video')"/>
      </div>
      <div class="text-center q-mt-lg">
        <slot />
      </div>
    </div>
  </n-modal>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: () => ''
    },
    description: {
      type: String,
      default: () => ''
    },
    videoUrl: {
      type: String,
      default: () => ''
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal'),
    'n-multimedia': () => import('@/components/common/multimedia')
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: $breakpoint-xs-max) {
  .text-h2{
    font-size: 24px;
  }
}
</style>
