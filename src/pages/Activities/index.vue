<template>
  <article class="activities-page full-height">
    <div class="q-py-xl">
      <div style="max-width: 800px" class="q-mx-auto">
        <div class="text-h1 full-width text-center">
          Pro players activities
        </div>
        <div class="text-h4 q-mt-sm font-roboto text-weight-regular full-width text-center opacity-5">
          1,200+ activities from dozens of verified pro players
        </div>
        <div class="row q-mt-xl">
          <div class="col-12 col-md-6 q-pb-md q-pb-md-none q-px-sm">
            <q-input
              outlined
              clearable
              class="full-width bg-soft-tone"
              placeholder="Search..."
              :value="searchQuery"
              @input="setSearchQuery"
            >
              <template v-slot:prepend>
                <img src="@/assets/icons/search.svg" alt="search icon"/>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-pb-md q-pb-md-none q-px-sm">
            <q-select
              filled
              clearable
              color="dark-pink"
              :label-slot="!selectedPlayer"
              :value="selectedPlayer"
              :popup-content-style="{ height:'300px' }"
              @input="setSearchPlayer">
              <span slot="label">
                All players
              </span>
            </q-select>
          </div>

          <div class="col-12 col-md-3 q-px-sm">
            <q-select
              filled
              clearable
              color="dark-pink"
              :label-slot="!selectedDifficulty"
              :value="selectedDifficulty"
              :options="difficulties"
              :popup-content-style="{ 'max-height':'300px' }"
              @input="setSearchDifficulty">
              <span slot="label">
                All difficulties
              </span>
            </q-select>
          </div>
        </div>
      </div>
    </div>

    <div class="activities-page__main">
      <div class="row">
        <div class="col-12 q-mb-xl">
          <slider title="Newest"
                  sliderID="Newest"
                  :swiperOptions="{
                    slidesPerView: slidesPerViewForNewest
                  }"
                  :items="newest">
                  <template v-slot="{ item }">
                    <n-routine-card v-bind="item" approvedOnTop />
                  </template>
          </slider>
        </div>

        <div class="col-12 q-mb-xl">
          <slider title="Browse by player"
                  sliderID="byPlayer"
                  :swiperOptions="{
                    slidesPerView: slidesPerViewForPlayer
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
              <n-routine-card v-bind="item" approvedOnTop />
            </template>
          </n-list>
        </div>

      </div>
    </div>
  </article>
</template>

<script>
export default {
  components: {
    slider: () => import('@/components/common/slider'),
    'n-routine-card': () => import('@/components/training-routine/card.vue'),
    'n-list': () => import('@/components/common/content-list/list'),
    'user-card': () => import('@/components/common/user-card')
  },
  data () {
    return {
      searchQuery: '',
      selectedPlayer: '',
      selectedDifficulty: ''
    }
  },
  methods: {
    setSearchQuery () {
      // ToDo add logic
    },
    setSearchPlayer () {
      // ToDo add logic
    },
    setSearchDifficulty () {
      // ToDo add logic
    }
  },
  computed: {
    slidesPerViewForNewest () {
      const screen = this.$q.screen.width
      if (screen <= 768) {
        return 1
      } else if (screen <= 1024) {
        return 2
      } else {
        return 3
      }
    },
    slidesPerViewForPlayer () {
      const screen = this.$q.screen.width
      if (screen <= 576) {
        return 2
      } else if (screen <= 768) {
        return 3
      } else if (screen <= 1024) {
        return 4
      } else if (screen <= 1440) {
        return 6
      } else {
        return 7
      }
    },
    difficulties () {
      return ['EASY', 'INTERMEDIATE', 'ADVANCED']
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
.activities-page {
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  &__main {
    padding: 40px 55px;
    @media all and (max-width: $breakpoint-md-max) {
      padding: 30px;
    }
    @media all and (max-width: $breakpoint-sm-max) {
      padding: 20px;
    }
  }
}
</style>
