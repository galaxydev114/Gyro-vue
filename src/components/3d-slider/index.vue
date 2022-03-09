<template>
  <div class="slider-3d">
    <q-resize-observer @resize="resizeSlider"/>
    <div class="slider-3d__prev">
      <c-icon icon="leftArrowRounded" />
    </div>
    <div class="slider-3d__next">
      <c-icon icon="rightArrowRounded" />
    </div>
    <swiper v-if="timer"
            :options="swiperOptions"
            :auto-destroy="false"
            :delete-instance-on-destroy="true"
            :cleanup-styles-on-destroy="false"
            ref="mySwiper"
            @slide-change="hideElements">
      <SwiperSlide
        class="slider-3d__slide"
        v-for="(slide, idx) in records"
        :key="`slide-${idx}`"
      >
        <slot v-bind:slide="slide"/>
      </SwiperSlide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import urlTypes from '@/mixins/urlType.mixins'

export default {
  props: {
    records: {
      type: Array,
      require: true,
      default: () => []
    },
    showElements: {
      type: Number,
      default: 6
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  mixins: [urlTypes],
  data () {
    return {
      timer: false,
      swiperOptions: {
        effect: 'coverflow',
        grabCursor: true,
        loop: false,
        centeredSlides: true,
        slidesPerView: 'auto',
        navigation: {
          nextEl: '.slider-3d__next',
          prevEl: '.slider-3d__prev'
        },
        coverflowEffect: {
          rotate: 0,
          stretch: 470,
          depth: 220,
          modifier: 1,
          slideShadows: true
        },
        breakpoints: {
          320: {
            effect: 'slide',
            loop: true,
            centeredSlides: true,
            slidesPerView: 1,
            coverflowEffect: {}
          },
          1024: {
            coverflowEffect: {
              rotate: 0,
              stretch: 420,
              depth: 200,
              modifier: 1,
              slideShadows: true
            }
          },
          1280: {
            coverflowEffect: {
              rotate: 0,
              stretch: 500,
              depth: 220,
              modifier: 1,
              slideShadows: true
            }
          },
          1440: {
            coverflowEffect: {
              rotate: 0,
              stretch: 550,
              depth: 150,
              modifier: 1,
              slideShadows: true
            }
          }
        }
      }
    }
  },
  methods: {
    resizeSlider () {
      const swiper = this.$refs.mySwiper && this.$refs.mySwiper.$swiper
      swiper && swiper.update()
    },
    hideElements () {
      const container = this.$refs.mySwiper && this.$refs.mySwiper.$el
      const slides = container.querySelectorAll('.slider-3d__slide')

      slides.forEach((slide) => {
        const style = slide.style
        const index = Math.abs(style['z-index'])
        if (index >= this.showElements / 3) {
          slide.style.opacity = 0
        } else {
          slide.style.opacity = 1
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.timer = true
      setTimeout(() => {
        const swiper = this.$refs.mySwiper && this.$refs.mySwiper.$swiper
        swiper.slideTo(4, 1000, false)
        this.hideElements()
      }, 100)
    })
  }
}
</script>

<style lang="scss" scoped>
.slider-3d{
  width: 100%;
  padding: 0 80px;
  position: relative;
  @media (max-width: $breakpoint-tablet-max){
    padding: 0 40px;
  }
  @media (max-width: $breakpoint-sm-max){
    padding: 0;
  }
  &__slide{
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    width: 650px;
    height: 380px;
    &:after{
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: $dark-sec;
      opacity: .8;
      z-index: 2;
      transition: all .2s ease-in-out;
    }
    &.swiper-slide-active{
      opacity: 1;
      &:after{
        opacity: 0;
        z-index: -1;
      }
    }
    @media (max-width: $breakpoint-tablet-max){
      width: 500px;
      height: 350px;
    }
    @media (max-width: $breakpoint-sm-max){
      width: 100%;
      height: auto;
    }
  }
  &__next,
  &__prev{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    z-index: 20;
    &:focus,
    &:active{
      outline: none;
      box-shadow: none;
    }
    @media (max-width: $breakpoint-sm-max){
      display: none;
    }
  }
  &__prev{
    left: 0;
  }
  &__next{
    right: 0;
  }
}
</style>
