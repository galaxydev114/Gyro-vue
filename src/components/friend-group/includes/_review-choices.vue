<template>
  <div ref="content" class="joinfg__rightbar q-pa-md q-py-lg q-py-lg-xl q-px-lg-lg relative-position">
    <div class="col" :class="{'text-center': $q.screen.gt.sm}">
      <div class="text-white q-px-lg-lg q-px-sm-sm q-pb-sm" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
          Review your choices
      </div>
      <div class="text-h4 text-weight-regular q-mt-sm" ref="description">
        Few steps left to your perfect Friend Group
      </div>
    </div>
    <div class="text-center q-mt-lg-xl q-mt-md-md q-mt-sm-md q-mt-xs-sm justify-center d-flex q-mb-lg row">
      <div class="col-xl-4 col-lg-5 col-md-7 col-sm-9 col-12">
        <div class="review-item full-width">
          <div class="row">
            <div class="review-img d-flex">
              <img :src="getSkillIcon()"
                width="32px"
                alt="skill score"/>
            </div>
            <div class="items-center d-flex">
              <div class="">
                <div class="review-label row">
                  Skill Score
                </div>
                <div class="review-desc row">
                  {{getSkillDesc()}} - {{currentUserScore}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="review-item full-width q-mt-md">
          <div class="row">
            <div class="review-img d-flex">
              <img
                :src="locationIcon"
                :width="32"
                :height="32"/>
            </div>
            <div class="items-center d-flex">
              <div class="">
                <div class="review-label row">
                  Location
                </div>
                <div class="review-desc row">
                  {{preferences.region}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="review-item full-width q-mt-md">
          <div class="row">
            <div class="review-img d-flex">
              <img
                :src="getLeagueIcon(preferences.league)"
                :width="32"
                :height="32"
                :alt="preferences.league"/>
            </div>
            <div class="items-center d-flex">
              <div class="">
                <div class="review-label row">
                  League
                </div>
                <div class="review-desc row">
                  {{preferences.league}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="review-item full-width q-mt-md">
          <div class="row">
            <div class="review-img d-flex">
              <img
                :src="getLangFlagIcon(preferences.language)"
                :width="32"
                :height="32"
                :alt="preferences.language"/>
            </div>
            <div class="items-center d-flex">
              <div class="">
                <div class="review-label row">
                  Language
                </div>
                <div class="review-desc row">
                  {{preferences.language}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="review-item full-width q-mt-md">
          <div class="row">
            <div class="review-img d-flex">
              <img
                :src="timeIcon"
                :width="32"
                :height="32"/>
            </div>
            <div class="items-center d-flex">
              <div class="">
                <div class="review-label row">
                  Play Time
                </div>
                <div class="review-desc row">
                  {{preferences.availability.join(', ')}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="review-item full-width q-mt-md">
          <div class="row">
            <div class="review-img d-flex">
              <img :src="getPlatformIcon(preferences.platform)"
                v-if="getPlatformIcon(preferences.platform)"
                width="32px"
                :alt="preferences.platform"/>
            </div>
            <div class="items-center d-flex">
              <div class="">
                <div class="review-label row">
                  Platform
                </div>
                <div class="review-desc row">
                  {{ preferences.platform }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center mt-fixed-bottom">
      <div class="col-6 q-px-lg-none q-pr-sm">
        <c-btn outline
              class="btn-join-fg"
              :bold="false"
              :class="{'full-width': $q.screen.lt.sm, 'btn-previous': $q.screen.gt.xs}"
              color="light-pink"
              @click="$emit('previous')">
          Previous
        </c-btn>
      </div>
      <div class="col-6 q-px-lg-none q-pl-sm">
        <q-btn unelevated
             class="q-btn-main q-px-md btn-join-fg"
             :class="{'full-width': $q.screen.lt.sm, 'btn-next': $q.screen.gt.xs}"
             color="dark-pink"
             @click="$emit('finish')">
          Confirm
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { languages } from '@/constants'
import timeIcon from '@/assets/friend-group/time.svg'
import locationIcon from '@/assets/friend-group/location.svg'

export default {
  props: {
    preferences: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      timeIcon,
      locationIcon
    }
  },
  computed: {
    ...mapGetters({
      currentUserScore: 'user/currentUserScore'
    })
  },
  // computed: {
  //   ...mapGetters({
  //     preferences: 'user/userFriendGroupPreferences'
  //   })
  // },
  methods: {
    getPlatformIcon (platform) {
      switch (platform.toLowerCase()) {
        case 'pc':
          return require('@/assets/platforms/desktop.svg')
        case 'mobile':
          return require('@/assets/platforms/mobile.svg')
        case 'console':
          return require('@/assets/platforms/ps.svg')
        case 'xbox':
          return require('@/assets/platforms/xbox.svg')
        case 'nintendo':
          return require('@/assets/platforms/nintendo.svg')
      }
    },
    getLangFlagIcon (locale) {
      switch (locale) {
        case languages.LANGS.ENGLISH.code:
          return require('@/assets/friend-group/uk-lang-flag.svg')
        case languages.LANGS.SPANISH.code:
          return require('@/assets/friend-group/sp-flag.svg')
        case languages.LANGS.FRENCH.code:
          return require('@/assets/friend-group/fr-flag.svg')
      }
    },
    getLeagueIcon (league) {
      switch (league) {
        case 'open':
          return require('@/assets/friend-group/open-league.svg')
        case 'contender':
          return require('@/assets/friend-group/contender-league.svg')
        case 'champion':
          return require('@/assets/friend-group/champion-league.svg')
      }
    },
    getSkillIcon () {
      switch (true) {
        case (this.currentUserScore < 450):
          return require('@/assets/icons/bronze-icon.webp')
        case (this.currentUserScore < 950):
          return require('@/assets/icons/silver-icon.webp')
        case (this.currentUserScore > 950):
          return require('@/assets/icons/gold-icon.webp')
      }
    },
    getSkillDesc () {
      switch (true) {
        case (this.currentUserScore < 450):
          return 'Beginner'
        case (this.currentUserScore < 950):
          return 'Advanced'
        case (this.currentUserScore > 950):
          return 'Pro'
      }
    }
  }
}
</script>

<style lang="scss">
  .review-item {
    background: #382B4B;
    border-radius: 6px;
    .review-img {
      padding: 20px 24px;
    }
    .review-label {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      text-transform: uppercase;
      color: #DFDAE7;
      opacity: 0.5;
    }
    .review-desc {
      margin-top: 4px;
      font-family: 'Rift';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 32px;
      /* identical to box height, or 133% */
      color: #FFFFFF;
    }
    @media screen and (max-width: $breakpoint-sm-max) {
      .review-desc {
        font-size: 20px;
        line-height: 24px;
      }
      .review-img {
        padding: 14px 18px;
      }
    }
  }
</style>
