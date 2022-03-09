<template>
  <div class="user-info-column q-md-pb-xl">
    <div class="player-info">
      <q-img v-if="isPublic" src="@/assets/logo.svg" height="28px" width="156px" style="position: absolute;z-index: 9;top: 50px;left: 40px;"/>
      <div class="player-info__img">
        <img class="full-width"
             alt="Profile image of collaborator"
             :src="user.profileImageUrl">
      </div>

      <div class="player-info__name q-pa-lg">
        <div class="text-h1">
          {{ user.name }}
        </div>
        <div class="text-h4 q-mt-sm" style="width:250px">
          {{ user.tagline }}
        </div>
        <div class="player-info__social">
          <a @click="trackAction('Partners: Click youtube link', { partnerId })" :href="user.youtubeLink" target="_blank" v-if="user.youtubeLink">
            <c-icon icon="youtube" />
          </a>

          <a @click="trackAction('Partners: Click twitch link', { partnerId })" :href="user.twitchLink" target="_blank" v-if="user.twitchLink">
            <c-icon icon="twitch" />
          </a>

          <a @click="trackAction('Partners: Click twitter link', { partnerId })" :href="user.twitterLink" target="_blank" v-if="user.twitterLink">
            <c-icon icon="twitter" />
          </a>
        </div>
      </div>
    </div>
    <div class="column q-pa-lg player-details">
      <div class="font-rift text-weight-bold q-mb-sm">
        Achievements
      </div>
      <div v-for="(achievement, idx) in user.achievements"
           :key="idx"
           class="achievements-item q-pa-md q-mb-sm text-weight-bold">
        <div class="achievements-item__icon">
          <c-icon :icon="achievement.icon || 'starTrophy'" width="24px" />
        </div>
        {{ achievement.title }}
      </div>

      <div class="quote-block">
        <c-icon icon="quote" class="quote-block__bg-icon" width="60px" />
        <span>{{ user.quote }}</span>
      </div>

      <div v-if="user.epicCreatorCode">
        <div class="font-rift text-weight-bold q-mb-sm">
          Creator code
        </div>
        <q-card-section class="bg-soft-tone flex items-center justify-between bordered">
          <span class="text-h5 text-weight-regular">{{ user.epicCreatorCode }}</span>
          <q-icon name="content_copy"
                  @click="trackAction('Partners: Copy creator code', { partnerId }); copy(user.epicCreatorCode)"
                  color="dark-pink"
                  size="20px"
                  class="cursor-clickable">
            <q-tooltip anchor="top left"
                       self="bottom middle"
                       max-width="240px"
                       content-style="background-color: #382B4B; font-size: 14px"
                       @hide="copied = false"
                       :offset="[10, 10]">
              {{ user.epicCreatorCode }}
            </q-tooltip>
          </q-icon>
        </q-card-section>
      </div>
    </div>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    partnerId: {
      type: String,
      default: ''
    }
  },
  methods: {
    copy (code) {
      copyToClipboard(code).then(() => {
        this.$q.notify({
          type: 'positive',
          message: 'Copied!'
        })
        this.copied = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info-column{
  display: flex;
  flex-direction: column;
  width: 100%;
  @media all and (min-width: $breakpoint-565-max) and (max-width: $breakpoint-sm-max+1){
    flex-direction: row;
    width: 100%;
    .player-info{
      max-width: 50%;
    }
    .player-details{
      width: 50%;
    }
  }
}

.player-info {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-bottom: 50px;
  &__img{
    position: relative;
    min-height: 250px;
    background-color: $soft-tone;
    img {
      max-height: 500px;
      width: 100%;
    }

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(0deg, rgba($dark, 1) 10%, rgba($dark, 0) 100%);
    }
  }

  &__name {
    position: absolute;
    z-index: 4;
    bottom: 0;
    width: 100%;
    @media all and (min-width: $breakpoint-sm){
      .text-h1{
        font-size: 62px;
        line-height: 68px;
      }
    }
    @media all and (min-width: $breakpoint-md){
      .text-h1{
        font-size: 72px;
        line-height: 78px;
      }
    }
    @media all and (max-width: $breakpoint-tablet-min){
      padding: 10px;
      .text-h1{
        font-size: 48px;
        line-height: 56px;
      }
      .text-h4{
        font-size: 16px;
        padding-right: 100px;
      }
    }
    @media all and (max-width: $breakpoint-565-max){
      padding: 10px 20px;
    }
  }

  &__social {
    position: absolute;
    bottom: 15px;
    right: 25px;
    display: flex;
    align-items: center;

    a {
      margin-left: 12px;
    }
    @media all and (max-width: $breakpoint-tablet-min){
      right: 10px;
      bottom: 2px;
    }
    @media all and (max-width: $breakpoint-565-max){
      right: 20px;
    }
  }

  @media all and (min-width: $breakpoint-mobile-max) and (max-width: $breakpoint-sm-max+1){
    width: 50%;
    padding-bottom: 0;
    &:after{
      bottom: 0;
    }
  }
}

.achievements-item {
  border: 1px solid $soft-tone;
  border-radius: 4px;
  display: flex;
  align-items: center;

  &__icon {
    margin-right: 8px;

    svg {
      float: left;
    }
  }
}

.quote-block {
  position: relative;
  padding: 16px;
  margin: 20px 0 10px;
  overflow: hidden;
  font-size: 24px;
  line-height: 28px;
  @media all and (max-width: $breakpoint-sm-max+1){
    display: none;
  }

  &__bg-icon{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }

  span {
    position: relative;
    z-index: 3;
  }
}
</style>
