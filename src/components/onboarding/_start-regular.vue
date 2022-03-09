<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container style="height: var(--app-height)">
      <div class="onboarding__find-user">
        <header-line />
        <div class="onboarding__find-user-content" v-if="!showLoader">
          <div class="text-center">
            <div class="text-h1">
              Link your <span class="text-pink">Epic</span> Account
            </div>
            <div class="text-h4 text-weight-regular q-mt-sm">
              This will unlock more features of NOVOS, such as the ability to track
              your in-game progress.
            </div>
          </div>
          <q-form class="q-mt-xl q-px-xl" ref="nicknameForm">
            <div class="full-width q-pt-sm">
              <c-btn @click="startEpicOauthFlow"
                     class="full-width"
                     color="dark-pink">
                <q-img src="@/assets/onboarding/EpicGames_White.svg" width="21px" style="margin-right: 11px;" />
                <span class="font-roboto text-subtitle1 text-weight-regular">Link with Epic Account</span>
              </c-btn>
              <q-btn v-if="showSkipEpicLink"
                    flat
                    unelevated
                    color="dark-pink"
                    @click="userName = null; skipFortniteNickStep()"
                    class="full-width">
                SKIP FOR NOW
              </q-btn>
              <div v-if="showSkipEpicLink" class="text-gray text-center">
                Don't worry, you can link your Epic account later.
              </div>
            </div>
          </q-form>
          <page-loader v-if="showPageLoader" />
        </div>
        <calculating-loader v-else
          class="onboarding__find-user-spinner text-center q-mx-auto q-my-auto"
          :userName="userName"
          @end="showLoader = false"
          @next="e => $emit('next', e, redirect)"
        />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import * as fortniteTrackerApi from '@/services/fortniteTrackerApi'
import { mapActions, mapGetters } from 'vuex'
import { sendSegmentEvent, segmentIdentify } from '@/services/segment'
import { UPGRADE_MODAL_EXPERIMENT_DATE } from '@/constants/helpers'

export default {
  components: {
    'page-loader': () => import('@/components/common/page-loader'),
    'header-line': () => import('components/common/header-line/index'),
    'calculating-loader': () => import('./includes/_calculating-loader')
  },
  props: {
    skipLoader: {
      type: Boolean,
      default: false
    },
    allowLinkEpicSkip: {
      type: Boolean,
      default: false
    },
    referrer: {
      default: undefined
    }
  },
  data () {
    return {
      epicOauthUri: process.env.VUE_APP_EPIC_OAUTH_URL,
      redirect: '/',
      percent: 0,
      showLoader: false,
      showPageLoader: false,
      filterVal: '',
      userName: '',
      options: []
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('experiments', ['userExperiments']),
    ...mapGetters({ abForceLinkEpic: 'experiments/experimentGyroForceLinkEpic' }),
    showSkipEpicLink () {
      return this.allowLinkEpicSkip || !this.abForceLinkEpic
    }
  },
  methods: {
    ...mapActions({
      updateUserEpicId: 'user/updateUserEpicId',
      getUserScore: 'user/getUserScore'
    }),

    skipFortniteNickStep  (e) {
      this.trackAction('User Onboarding: Skip Fortnite Nickname')
      segmentIdentify(null, {
        name: this.currentUser.email,
        email: this.currentUser.email,
        paywall_experiemnt: (this.currentUser.createdAt > UPGRADE_MODAL_EXPERIMENT_DATE),
        fortniteNickname: this.currentUser.fortniteNickname,
        referralCode: this.currentUser.referralLink,
        experiments: this.userExperiments
      })
      this.$emit('skipFNStep', e)
    },

    startEpicOauthFlow () {
      this.trackAction('User Onboarding: Start Link with Epic via OAuth2')
      const state = { epicRef: this.referrer }
      const url = new URL(this.epicOauthUri)
      url.searchParams.set('state', btoa(JSON.stringify(state)))
      url.searchParams.set('redirect_uri', window.location.origin + this.$route.path + (this.$route.path.endsWith('/') ? '' : '/'))
      location.href = url
    },
    doEpicOauthStep2 ({ code }) {
      if (code) {
        this.showPageLoader = true
        try {
          const oauth2State = JSON.parse(atob(decodeURIComponent(this.$route.query.state)))
          this.redirect = oauth2State.epicRef
        } catch {}
        return this.updateUserEpicId({ userId: this.currentUser.id, code })
          .then((user) => {
            if (!user) { throw new Error('No user received.') }
            this.trackAction('User Onboarding: Link Epic Account Success', { userId: this.currentUser.id })
            this.showLoader = true
            segmentIdentify(null, {
              name: this.currentUser.email,
              email: this.currentUser.email,
              paywall_experiemnt: (this.currentUser.createdAt > UPGRADE_MODAL_EXPERIMENT_DATE),
              fortniteNickname: this.currentUser.fortniteNickname,
              referralCode: this.currentUser.referralLink,
              experiments: this.userExperiments
            })
            this.userName = this.currentUser.fortniteNickname
            if (this.skipLoader) {
              this.$emit('next', this.userName, this.redirect)
            }
          })
          .catch((err) => {
            this.trackAction('User Onboarding: Link Epic Account Failure', { error: err })
            this.$q.notify({
              color: 'dark-pink',
              textColor: 'white',
              icon: 'error',
              message: 'Something went wrong. Try again or skip for now.',
              badgeClass: 'hidden'
            })
          })
          .finally(() => { this.showPageLoader = false })
      }
    },

    async loadNames (prefix) {
      const response = await fortniteTrackerApi.getUserNames(prefix.toLowerCase())

      if (response.status === 200) {
        if (response?.data?.map && {}.toString.call(response?.data?.map) === '[object Function]') {
          return response?.data?.map(data => data.name)
        }
      }

      return []
    },

    trackAction (action, opts = {}) {
      sendSegmentEvent(action, opts)
    }
  },

  created () {
    if (this.$route.query.code) {
      return this.doEpicOauthStep2({ code: this.$route.query.code })
    }
  },

  watch: {
    showLoader (newValue) {
      if (newValue) {
        this.trackAction('See Skill Score Loading Spinner')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.onboarding{
  &__find-user{
    height: 90vh;
    display: flex;
    flex-direction: column;
    &-content{
      max-width: 500px;
      display: flex;
      margin: auto;
      flex-direction: column;
      @media (max-width: $breakpoint-xs-max) {
        margin-top: 10%;
        .text-h1{
          font-size: 36px;
        }
        .text-h4{
          font-size: 16px;
        }
      }
    }
  }
}
.no-user-result{
  width: 100%;
  background: $mid-tone;
  border: 2px solid $dark-pink;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  margin-top: 4px;
  transition: all .3s ease-in-out;
}
</style>
