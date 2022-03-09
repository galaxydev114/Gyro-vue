<template>
  <div class="slider">
    <div class="text-h3 q-mb-md block" v-if="title">
      {{ title }}
    </div>
    <div class="relative-position full-width">
      <div class="swiper-button-prev" @click="prev()">
        <c-icon icon="leftArrowRounded" width="25px"/>
      </div>
      <div class="swiper-button-next" @click="next()">
        <c-icon icon="rightArrowRounded" width="25px"/>
      </div>
      <swiper :options="options"
              :auto-destroy="false"
              :delete-instance-on-destroy="true"
              :cleanup-styles-on-destroy="false"
              :ref="sliderID"
              v-on="$listeners">
        <SwiperSlide
          class="slide"
          v-for="(item, idx) in items"
          :key="`slide-${idx}`"
        >
          <slot v-bind:item="item"/>
        </SwiperSlide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    swiperOptions: {
      type: Object
    },
    sliderID: {
      type: String,
      require: true
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  methods: {
    next () {
      this.$refs[this.sliderID].$swiper.slideNext()
    },
    prev () {
      this.$refs[this.sliderID].$swiper.slidePrev()
    }
  },
  computed: {
    options () {
      return {
        ...{
          slidesPerView: 4,
          spaceBetween: 16,
          slidesPerGroup: 1,
          loop: true
        },
        ...this.swiperOptions
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.text-h3 {
  font-size: 24px;
  text-transform: none;
  font-family: "Roboto", sans-serif !important;
  @media all and (max-width: $breakpoint-sm-max) {
    font-size: 20px;
    padding-right: 80px;
  }
}

.slider {
  width: 100%;
}

.slide{
  height: auto;
}

.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: -40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  height: auto;
  cursor: pointer;
  z-index: 3;
  padding: 0;
  opacity: .7;

  &:after {
    display: none;
  }

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}

.swiper-button-prev {
  right: 35px;
  left: unset;
}

.swiper-button-next {
  right: 0;
}
</style>
