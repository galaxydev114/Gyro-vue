<template>
  <div class="player-land full-width" :class="{'player-land--public' : !isLoggedIn}" :key="partnerId">
    <div class="left q-md-pb-xl" :class="{'left--public' : !isLoggedIn}">
      <user-info-column :user="currentCollaborator" :isPublic="!isLoggedIn" :partnerId="partnerId"/>
    </div>
    <div class="right q-pa-lg q-pb-xl" :class="{'right--public' : !isLoggedIn}" :style="{ paddingTop: isLoggedIn ? '40px' : '48px'}" >
      <div class="right__content">
        <div class="text-h1">
          {{ currentCollaborator.profileVideoTitle }}
        </div>
        <div class="text-h4 text-weight-regular opacity-5 q-mt-sm">
          {{ currentCollaborator.profileVideoSubtitle }}
        </div>
        <div class="q-mt-lg block" style="display: flex !important;justify-content: center;">
          <n-multimedia class="multimedia-width"
                        :src="currentCollaborator.profileVideoUrl"
                        :thumbnail="currentCollaborator.profileVideoThumbnailUrl"
          />
        </div>
        <template v-if="currentCollaborator.activities">
          <div class="text-h3 q-mb-md q-mt-xl">
            Exclusive content
          </div>
          <activities-list
            :items="currentCollaborator.activities"
            :name="currentCollaborator.name"
            :unlocked="isLoggedIn"
            @clickCta="handleCtaClick"
            @clickExpandActivity="handleClickExpandActivity"
            @clickLockActivity="handleClickLockActivity"
          />
        </template>

        <!-- <div class="other-creators" v-if="creators && creators.length">
          <slider title="Other creators you might like"
                  :swiperOptions="{
                    slidesPerView: creatorsSlidesCount
                  }"
                  sliderID="creators"
                  :items="creators"
                  @click-slide="handleClickCreator">
            <template v-slot="{ item }">
              <user-card :image="item.profileImageUrl"
                         :name="item.name"
                         :tagline="item.tagline"
              />
            </template>
          </slider>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Partners',
  components: {
    'n-multimedia': () => import('@/components/common/multimedia'),
    'activities-list': () => import('@/components/partners-land/activities-list'),
    'user-info-column': () => import('@/components/common/user-info-column')
  },
  props: {
    currentCollaborator: {
      type: Object,
      default: () => ({})
    },
    partnerId: String,
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    creators: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    handleCtaClick (activity) {
      this.trackAction('Partners: Click activity CTA', { partnerId: this.partnerId, activityTitle: activity.title })
      let target = '#'
      try {
        target = new URL(activity.ctaUrl)
      } catch {
        const routeData = this.$router.resolve(activity.ctaUrl)
        target = routeData.href
      }
      window.open(target, '_blank')
    },
    handleClickLockActivity (activity) {
      this.$emit('click-lock-activity', activity)
    },
    handleClickExpandActivity (activity) {
      this.trackAction('Partners: Click expand activity', { partnerId: this.partnerId, activityTitle: activity.title })
    },
    handleClickCreator (_, index) {
      const creatorId = this.creators[index]?.slug
      if (!creatorId) return
      this.trackAction('Partners: Click other creator', { partnerId: this.partnerId, otherPartnerId: creatorId })
      this.$router.push({ name: 'Partner', params: { id: creatorId } })
    }
  },

  computed: {
    creatorsSlidesCount () {
      if (this.$q.screen.lt.sm) {
        return 2
      } else if (this.$q.screen.lt.md) {
        return 4
      } else if (this.$q.screen.lt.lg) {
        return 4
      } else {
        return 5
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
}

.text-h4 {
  font-size: 20px;
}

.bordered {
  border-radius: 6px;
}

.player-land {
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
      &--public{
        width: calc(100% - 400px);
      }
    }
    @media all and (max-width: $breakpoint-tablet-min){
      width: 100%;
    }
    &--public {
      background: var(--app-bg);
      background-size: cover;
      background-attachment: fixed;
    }
    &__content {
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      @media all and (max-width: $breakpoint-lg-max){
        width: 100%;
        max-width: 600px;
      }
    }
  }
}

.other-creators {
  padding-top: 40px;
  margin-top: 40px;
  border-top: 1px solid $soft-tone;
  display: flex;
  flex-wrap: wrap;
}

.multimedia-width{
  width: 100%;
}
</style>
