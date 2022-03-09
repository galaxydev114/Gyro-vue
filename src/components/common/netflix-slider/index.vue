<template>
  <div class="netflix-slider">
    <swiper :options="swiperOptions"
            :auto-destroy="false"
            :delete-instance-on-destroy="true"
            :cleanup-styles-on-destroy="false"
            @click-slide="clickSlide">
      <SwiperSlide class="netflix-slider__slide"
                   v-for="(slide, idx) in slides"
                   :key="`slid-${idx}`">
        <div class="netflix-slider__single"
             :key="`slid-${idx}`">
          <img :src="slide.img"/>
          <div class="netflix-slider__single-content"
               v-if="slide.title">
            <div class="text-h5" v-if="slide.title">
              {{ slide.title }}
            </div>
          </div>
        </div>
      </SwiperSlide>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  props: {
    slides: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  methods: {
    clickSlide (index, reallyIndex) {
      this.$emit('click', this.slides[reallyIndex])
    }
  },
  data () {
    return {
      swiperOptions: {
        slidesPerView: 4,
        spaceBetween: 10,
        slidesPerGroup: 2,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          370: {
            slidesPerView: 1,
            spaceBetween: 0,
            slidesPerGroup: 1
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
            slidesPerGroup: 3
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 10,
            slidesPerGroup: 2
          },
          1440: {
            slidesPerView: 6,
            spaceBetween: 10,
            slidesPerGroup: 2
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.netflix-slider{
  position: relative;
  &__single{
    $root: &;
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      float: left;
    }
    &-content{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 30px 15px 15px;
      background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,212,255,0) 100%);
      opacity: 0;
      transition: all .3s ease-in-out;
    }
    &:hover{
      #{$root}-content{
        opacity: 1;
      }
    }
  }
  /deep/ {
    .swiper-wrapper {
      padding: 25px 0;
    }
    .swiper-slide {
      transition: 250ms transform;
      z-index: 2;

      &:hover {
        transform: scale(1.2);
        z-index: 3;
        cursor: pointer;
        box-shadow: 0 0 15px rgba(0, 0, 0, .7);
      }

      &:first-child:hover{
        margin:0 40px;
      }

      &:last-child:hover{
        margin:0 -40px;
      }

    }
  }
  .swiper-button-prev,
  .swiper-button-next{
    position: absolute;
    top: 25px;
    bottom: 25px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    height: auto;
    background: rgba(#000, .5);
    cursor: pointer;
    z-index: 3;
    color: $dark-pink;
  }
  .swiper-button-prev{
    left: 0;
  }
  .swiper-button-next{
    right: 0;
  }
}
</style>
