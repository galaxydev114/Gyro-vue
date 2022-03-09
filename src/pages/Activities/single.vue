<template>
<div class="player-activities">
  <div class="left">
    <user-info-column :user="player" />
  </div>
  <div class="right">
    <div class="right__content">
      <div class="row q-pa-lg">
        <div class="col-12 q-mb-lg">
          <h3 class="q-mt-none">Featured</h3>
          <div class="full-width relative-position">
            <swiper :options="swiperOptions"
                    :auto-destroy="false"
                    :delete-instance-on-destroy="true"
                    :cleanup-styles-on-destroy="false"
                    ref="mySwiper">
              <SwiperSlide
                class="slider-3d__slide"
                v-for="i in 4"
                :key="`slide-${i}`"
              >
                <n-routine-card v-bind="allActivities[i]" vertical :showCounter="false" />
              </SwiperSlide>
            </swiper>
            <div class="navigation">
              <div class="navigation__prev">
                <c-icon icon="leftArrowRounded" width="26px" />
              </div>
              <div class="navigation__next">
                <c-icon icon="rightArrowRounded" width="26px" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 q-mb-xl">
          <slider title="Newest"
                  sliderID="Newest"
                  :swiperOptions="{
                    slidesPerView: $q.screen.gt.sm ? 2 : 1
                  }"
                  :items="newest">
            <template v-slot="{ item }">
              <n-routine-card v-bind="item" :showApproved="false" :showCounter="false" />
            </template>
          </slider>
        </div>

        <div class="col-12 q-mb-xl">
          <h3>All Activities</h3>
          <n-list
            :maxInRow="3"
            :items="allActivities"
            :paginationOptions="{
              enabled: true,
              infinite: true
            }"
            @page="$emit('get-next-page')"
          >
            <template v-slot="{item}">
              <n-routine-card v-bind="item" :showApproved="false" :showCounter="false" />
            </template>
          </n-list>
        </div>

        <div class="col-12">
          <slider title="Browse by player"
                  sliderID="byPlayer"
                  :swiperOptions="{
                    slidesPerView: slidesPerViewByPlayer
                  }"
                  :items="players">
            <template v-slot="{ item }">
              <user-card :image="item.image"
                         :name="item.name"
                         :tagline="item.tagline"
              />
            </template>
          </slider>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  components: {
    'user-info-column': () => import('@/components/common/user-info-column'),
    slider: () => import('@/components/common/slider'),
    'n-routine-card': () => import('@/components/training-routine/card.vue'),
    'n-list': () => import('@/components/common/content-list/list'),
    'user-card': () => import('@/components/common/user-card'),
    Swiper,
    SwiperSlide
  },
  data () {
    return {
      swiperOptions: {
        slidesPerView: 1,
        navigation: {
          nextEl: '.navigation__next',
          prevEl: '.navigation__prev'
        }
      }
    }
  },
  computed: {
    player () {
      return {
        id: 'd5f4c5e8-330a-4f06-9676-93fea82a9d10',
        name: 'Chapix',
        slug: 'chapix',
        tagline: 'Pro Player for Falcon Esports',
        quote: '2 times winner solo cash cups',
        achievements: [
          {
            icon: 'moneybag',
            title: '$270,000 in Earnings'
          },
          {
            icon: 'goldenTrophy',
            title: '13x Cash Cup Winner'
          },
          {
            icon: 'goldenTrophy',
            title: 'Trio FNCS Season 5 Winner'
          }
        ],
        youtubeLink: 'https://www.youtube.com/channel/UCQirvM6bjCh2esvEGlxx38A/videos',
        twitchLink: 'https://www.twitch.tv/chapix',
        twitterLink: 'https://twitter.com/ChapixFN'
      }
    },
    // TODo replace with correct data
    newest () {
      return [
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        },
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        },
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        },
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        },
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        },
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        },
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        }
      ]
    },
    allActivities () {
      return [
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        },
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        },
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        },
        {
          id: '87b200ea-1636-41c5-bf87-6580e70dcc91',
          title: 'Aggressiveness practice',
          subtitle: 'Improve your aggressiveness by deliberately practicing it',
          skill: 'BR',
          thumbnail: 'https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/BR-Routine-Filler.png',
          difficulty: 'INTERMEDIATE',
          approvedBy: 'NOVOS',
          counter: null,
          duration: '30'
        }
      ]
    },
    players () {
      return [
        {
          image: 'https://avatarfiles.alphacoders.com/148/thumb-148526.png',
          name: 'Player Name',
          tagline: '102 activity'
        },
        {
          image: 'https://i.pinimg.com/474x/4d/8d/da/4d8ddab6a355a5a8f5629516ac46d949.jpg',
          name: 'Player Name',
          tagline: '102 activity'
        },
        {
          image: 'https://i.pinimg.com/originals/ba/18/9f/ba189fb7c2879a7762d046f27b72b6ab.jpg',
          name: 'Player Name',
          tagline: '102 activity'
        },
        {
          image: 'https://avatarfiles.alphacoders.com/141/thumb-141632.jpg',
          name: 'Player Name',
          tagline: '102 activity'
        },
        {
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnkmeZ0yIapAiu_BC-YrWeEFeA6VlQ5GdmPvNtnnAh291nAFRQtKtNfEfEtPDCZm9vWOE&usqp=CAU',
          name: 'Player Name',
          tagline: '102 activity'
        }
      ]
    },
    slidesPerViewByPlayer () {
      return this.$q.screen.gt.md ? 4 : this.$q.screen.gt.sm ? 3 : 2
    }
  }
}
</script>

<style lang="scss" scoped>
.player-activities {
  display: block;
  overflow-y: auto;
  @media all and (max-width: $breakpoint-sm-max + 1){
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .left {
    border-right: 2px solid $soft-tone;
    width: 400px;
    flex-grow: 1;
    float: left;
    @media all and (max-width: $breakpoint-lg-max) {
      width: 400px;
    }
    @media all and (min-width: $breakpoint-565-max) and (max-width: $breakpoint-sm-max+1){
      display: flex;
      width: 100%;
      height: unset;
      overflow-y: hidden;
      &--public{
        width: 400px;
        overflow-y: unset;
        display: block;
      }
    }
    @media all and (max-width: $breakpoint-tablet-min){
      width: 100%;
      border: none;
    }
  }

  .right {
    width: calc(100% - 400px);
    float: left;
    min-height: 100vh;
    //Hack for correct height of div
    border-left: 2px solid $soft-tone;
    margin-left: -2px;
    @media all and (max-width: $breakpoint-lg-max){
      width: calc(100% - 400px);
    }
    @media all and (min-width: $breakpoint-565-max) and (max-width: $breakpoint-sm-max+1){
      width: 100%;
    }
    @media all and (max-width: $breakpoint-tablet-min){
      width: 100%;
    }
    &__content {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      @media all and (max-width: $breakpoint-lg-max){
        width: 100%;
        max-width: 800px;
      }
    }
  }

  .navigation{
    position: absolute;
    bottom: 30px;
    width: 252px;
    right: 0;
    &__next,
    &__prev{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 20;
      opacity: .7;
      &:focus,
      &:active{
        outline: none;
        box-shadow: none;
      }
      &:hover{
        opacity: 1;
      }
      @media (max-width: $breakpoint-sm-max){
        display: none;
      }
    }
    &__prev{
      left: 0;
    }
    &__next{
      left: 40px;
    }
  }
}
</style>
