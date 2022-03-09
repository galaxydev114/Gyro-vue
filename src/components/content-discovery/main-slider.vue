<template>
  <div class="content-discovery-slider" @click="$emit('click')">
    <img :src="computedImage" class="content-discovery-slider__img" alt="Image" />
    <div class="content-discovery-slider__content column">
      <div class="text-h3 font-roboto q-mb-sm" style="text-transform: none">
        {{ title }}
      </div>
      <div class="text-h5 text-weight-regular">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script>
import urlTypes from '@/mixins/urlType.mixins'
export default {
  props: {
    image: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true
    },
    description: {
      type: String,
      default: () => ''
    }
  },
  mixins: [urlTypes],
  computed: {
    computedImage () {
      if (this.isYoutubeUrl(this.image)) {
        const matched = this.image?.match(/youtube.com\/embed\/([^#&?]*)/)
        if (matched) {
          return `https://i.ytimg.com/vi/${matched[1]}/mqdefault.jpg`
        }
      } else if (!this.image || this.isVideoUrl(this.image)) {
        return require('@/assets/other/Fortnite-Original-Map.webp')
      }
      return this.image
    }
  }
}
</script>

<style lang="scss">
.content-discovery-slider{
  width: 100%;
  height: 100%;
  position: relative;
  float: left;
  &__img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
    float: left;
    @media (max-width: $breakpoint-xs-max){
      height: auto;
      max-height: 210px;
    }
  }
  &__content{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px;
    background: rgba($dark-one, .8);
    @media (max-width: $breakpoint-xs-max){
      position: relative;
      padding: 20px;
    }
  }
}
</style>
