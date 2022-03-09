<template>
  <div class="onboarding__base onboarding__center text-gray">
    <q-layout view="hHh lpR fFf">
      <q-drawer
        :width="leftBarWidth"
        v-if="$q.screen.width > 1200 && !resetToken"
        v-model="showBar"
        :dark="false"
        :overlay="false"
        :content-style="{'background': 'none'}">
        <div class="onboarding__leftbar">
          <div class="onboarding__leftbar-header text-left q-px-lg">
            <q-img src="@/assets/logo.svg" height="28px" width="156px" />
          </div>
          <div class="onboarding__leftbar-content">
            <div class="text-h1">
              Revolutionize Your Training
            </div>
            <div class="text-h4 text-weight-regular q-mt-md q-mb-xl">
              With NOVOS Early Access
            </div>
            <div class="text-weight-bold font-rift text-subtitle q-pt-md q-mb-lg text-uppercase">
              things you can expect:
            </div>
            <q-list>
              <q-item v-for="(thing, index) in thingsYouCanExpect"
                      class="q-pl-none"
                      :key="index">
                <q-item-section side top>
                  <div class="thing-index text-h5">
                    <q-icon class="text-h4" name="done"/>
                  </div>
                </q-item-section>
                <q-item-section class="training-steps__item-label text-weight-bold text-h5">
                  {{ thing }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-drawer>
      <q-page-container class="onboarding__container">
        <div class="no-background q-px-sm" v-if="$q.screen.lt.sm">
          <div class="q-py-md items-center">
            <div class="col">
              <router-link to="/">
                <q-img src="@/assets/logo.svg" height="28px" width="156px" />
              </router-link>
            </div>
          </div>
        </div>
        <div class="onboarding__sign-container q-pa-md q-pa-sm-none">
          <div class="onboarding__sign-content">
            <change-password
              v-if="resetToken"
              @submit="changePassword"
            />
            <template v-else-if="!isLoggedIn">
              <template v-if="!currentState">
                <div class="q-mb-xl">
                  <div class="col q-mb-xl">
                    <div class="text-h1">
                      <span class="text-pink">Create</span> Your Account
                    </div>
                    <div class="text-h4 text-weight-regular q-mt-sm">
                      Sign up with Discord, Google or with your email
                    </div>
                  </div>
                  <div class="col">
                    <c-btn outline
                           @click="startDiscordOauthFlow(); trackAction('Sign-up: click discord')"
                           class="full-width"
                           color="light-pink">
                      <q-img src="@/assets/onboarding/discord-icon.svg" height="18px" width="18px" class="q-mr-sm" />
                      <span class="font-roboto text-subtitle1">Discord</span>
                    </c-btn>
                  </div>
                  <div class="col q-mt-md">
                    <c-btn outline
                           @click="startGoogleOauthFlow(); trackAction('Sign-up: click google')"
                           class="full-width"
                           color="light-pink">
                      <q-img src="@/assets/onboarding/google-icon.svg" height="18px" width="18px" class="q-mr-sm" />
                      <span class="font-roboto text-subtitle1">Google</span>
                    </c-btn>
                  </div>
                  <div class="col q-px-lg text-center q-my-lg">
                    <c-text-divider>
                      Or sign up with
                    </c-text-divider>
                  </div>
                  <div class="col">
                    <c-btn outline
                           class="full-width"
                           @click="startEmailFlow(); trackAction('Sign-up: click email')"
                           color="light-pink">
                      <span class="font-roboto text-subtitle1">@ Email</span>
                    </c-btn>
                  </div>
                  <div class="full-width text-left q-mt-md">
                    <q-checkbox
                      v-model="acceptTermsAndCondition"
                      @input="trackAction('Approve Terms and Conditions')"
                    >
                    </q-checkbox>
                    Accept
                    <a :href='`${computedUrl}/terms-and-conditions-novos-gg`' target="_blank" rel="noopener noreferrer" class="text-dark-pink text-underline text-weight-bold"> Terms & conditions </a> and
                    <a :href='`${computedUrl}/privacy-policy`' target="_blank" rel="noopener noreferrer" class="text-dark-pink text-underline text-weight-bold"> Privacy policy </a>
                  </div>
                </div>
                <div class="text-center text-h5 q-mt-auto q-mt-md-xl login-fixed-bottom">
                  <div class="divider full-width bg-soft-tone q-my-md lt-sm" style="height: 1px"></div>
                  Already have an account?
                  <q-btn flat
                         dense
                         padding="0"
                         color="dark-pink"
                         @click="changeState('sign-in')"
                         class="q-btn--no-hover text-h5 text-capitalize q-ml-sm">
                    Sign in here
                  </q-btn>
                </div>
              </template>
              <template v-else>
                <!--          SECURITY ACTION TYPE-->
                <create-account v-show="showState('create')"
                                @submit="register"
                                @discord="startDiscordOauthFlow"
                                @google="startGoogleOauthFlow"
                                @changeState="changeState" />
                <recovery-password v-show="showState('recovery')"
                                   @submit="recoverPassword"
                                   @changeState="changeState" />
                <sign-in v-show="showState('sign-in')"
                         @submit="login"
                         @discord="startDiscordOauthFlow(); trackAction('Sign-in: click discord')"
                         @google="startGoogleOauthFlow(); trackAction('Sign-in: click google')"
                         @changeState="changeState" />
              </template>
            </template>
          </div>
        </div>
      </q-page-container>

      <n-modal :visible="showBadAccessCode" size="md">
        <div class="text-center q-pa-lg" style="text-transform: unset">
          <div class="text-h4 font-roboto q-my-md">
            Code already used
          </div>
          <div class="text-gray font-roboto q-my-xl">
            An account associated with this code<br/>
            has already been created.
          </div>
          <div class="text-center q-mt-xl">
            <c-btn class="q-mx-auto" @click="afterBadAccessCode('sign-in')">
              Log In
            </c-btn>
          </div>
          <div class="col text-center text-h5 q-mt-md">
            <span>Don't have an account?</span>
            <q-btn
              flat
              dense
              padding="0"
              color="dark-pink"
              @click="afterBadAccessCode('create')"
              class="q-btn--no-hover text-h5 text-capitalize q-ml-sm"
            >
              Sign Up
            </q-btn>
          </div>
        </div>
      </n-modal>

      <page-loader v-if="showPageLoader" />

    </q-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import * as LocalStorageService from '@/services/localstorageservice'
import { sendReferralAnalytics } from '@/services/api'

export default {
  components: {
    'create-account': () => import('@/components/onboarding/includes/security/_create-accout'),
    'recovery-password': () => import('@/components/onboarding/includes/security/_recovery-password'),
    'sign-in': () => import('@/components/onboarding/includes/security/_sign-in'),
    'change-password': () => import('@/components/onboarding/includes/security/_change-password'),
    'page-loader': () => import('@/components/common/page-loader'),
    'n-modal': () => import('@/components/dashboard/modal')
  },

  data () {
    return {
      leftBarWidth: 400,
      showBar: true,
      showPageLoader: false,
      currentState: null,
      discordOauthUri: process.env.VUE_APP_DISCORD_OAUTH_URL,
      googleOauthUri: 'https://accounts.google.com/o/oauth2/v2/auth', // default fallback
      accessCode: null,
      referralLink: null,
      showBadAccessCode: false,
      acceptTermsAndCondition: true
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      currentUser: 'user/currentUser',
      accessCodeRole: 'accessCode/accessCodeRole'
    }),
    ...mapState('user', ['completedOnboarding']),

    userId () { return this.$route.query.user_id },
    resetToken () { return this.$route.query.token },

    thingsYouCanExpect () {
      return [
        'Personalized training plans',
        'Customizable schedule',
        'Constantly updated content'
      ]
    },
    computedUrl () {
      return process.env.VUE_APP_TOP_PAGE_URL
    }
  },

  methods: {
    ...mapActions({
      authorizeUserStored: 'user/authorizeUserStored',
      userRegister: 'user/registerNewUser',
      userLogin: 'user/login',
      userRecoverPassword: 'user/resetPassword',
      userChangePassword: 'user/changePassword',
      getLastUserPreferences: 'user/getLastUserPreferences',
      validateAccessCode: 'accessCode/validateAccessCode'
    }),

    changeState (type) {
      this.currentState = type
      if (this.currentState === null || this.currentState === 'create') {
        this.showBar = true
      } else {
        this.showBar = false
      }
    },
    showState (type) {
      return this.currentState === type
    },

    showErrorMessage (errorMessage) {
      this.$q.notify({
        color: 'dark-pink',
        textColor: 'white',
        icon: 'error',
        message: errorMessage,
        badgeClass: 'hidden'
      })
    },

    checkPreSignup (method) {
      const fail = this.currentState === null && !this.acceptTermsAndCondition
      if (fail) {
        this.showErrorMessage('Please agree to the terms and conditions and the privacy policy')
        this.trackAction(method + ': Error occured on Registraion Details', { error: 'User don\'t accept Terms, Conditions and Privacy policy' })
      }
      return !fail
    },

    startDiscordOauthFlow () {
      if (this.checkPreSignup('Discord')) {
        const state = { accessCode: this.accessCode, referralLink: this.referralLink, tapfiliateRef: this.tapfiliateRef }
        const url = new URL(this.discordOauthUri)
        url.searchParams.set('state', btoa(JSON.stringify(state)))
        location.href = url
      }
    },
    async startGoogleOauthFlow () {
      if (this.checkPreSignup('Google')) {
        const redirectUri = location.origin + '/login/?provider=google'
        const state = { accessCode: this.accessCode, referralLink: this.referralLink, tapfiliateRef: this.tapfiliateRef, redirectUri }

        const wellKnownRes = await fetch('https://accounts.google.com/.well-known/openid-configuration')
          .catch(() => {})
        const wellKnown = wellKnownRes?.ok && await wellKnownRes.json()
          .catch(() => {})

        const url = new URL(wellKnown.authorization_endpoint || this.googleOauthUri)
        url.searchParams.set('client_id', this.$GOOGLE_OAUTH2_CLIENT_ID)
        url.searchParams.set('response_type', 'code')
        url.searchParams.set('scope', 'openid profile email')
        url.searchParams.set('state', btoa(JSON.stringify(state)))
        url.searchParams.set('redirect_uri', redirectUri)
        location.href = url
      }
    },
    startEmailFlow () {
      if (this.checkPreSignup('Email')) {
        this.changeState('create')
      }
    },

    displayProviderName (provider = 'discord') {
      return provider.replace(/^\w/, c => c.toUpperCase())
    },
    doOauthStep2 ({ code, provider = 'discord', state }) {
      if (code) {
        this.showPageLoader = true
        const oauth2State = JSON.parse(atob(decodeURIComponent(state)))
        return this.userLogin({
          code,
          provider,
          redirect_uri: oauth2State?.redirectUri || window.location.origin + this.$route.path,
          // below only used for registration
          accessCode: oauth2State?.accessCode,
          referralLink: oauth2State?.referralLink,
          tapfiliateRef: oauth2State?.tapfiliateRef,
          role: 'earlyaccess2' // NOTE: ignore for now role given by code //this.accessCodeRole
        })
          .then(() => {
            this.trackAction(`Login by ${this.displayProviderName(provider)} Success`, { userId: this.currentUser.id })
          })
          .catch((err) => {
            this.trackAction(`Login by ${this.displayProviderName(provider)} Failure`, { error: err })
            throw err
          })
          .finally(() => { this.showPageLoader = false })
      }
      return Promise.resolve()
    },

    login (form) {
      this.trackAction('Sign-in: click login by email')
      this.showPageLoader = true
      this.userLogin(form)
        .then(() => {
          this.trackAction('Login by Email Success', form)
          this.onLoginSuccess()
        })
        .catch((err) => {
          this.trackAction('Login by Email Failure', form)
          this.onLoginFailure(err)
        })
        .finally(() => { this.showPageLoader = false })
    },

    recoverPassword (form) {
      this.userRecoverPassword(form)
      this.changeState(null)
      this.trackAction('Recover Password: Sent request', form)
      this.$q.notify({
        type: 'positive',
        message: 'Recovery email sent. Please check your email for instructions!'
      })
    },

    register (form) {
      this.showPageLoader = true
      const role = 'earlyaccess2' // NOTE: ignore for now role given by code //this.accessCodeRole
      this.userRegister({
        ...form,
        accessCode: this.accessCode,
        referralLink: this.referralLink,
        tapfiliateRef: this.tapfiliateRef,
        role
      }).then(() => {
        this.trackAction('Registration success', { ...form, role, referralCode: this.referralLink })
        this.onLoginSuccess()
      }).catch((err) => {
        this.trackAction('Registration failed', { ...form, role, referralCode: this.referralLink })
        this.onLoginFailure(err)
      }).finally(() => { this.showPageLoader = false })
    },

    changePassword (form) {
      this.userChangePassword({
        userId: this.userId,
        changePassToken: this.resetToken,
        newPassword: form.password
      }).then(() => {
        this.$q.notify({
          type: 'positive',
          message: 'Success!'
        })
      }).catch(() => {
        this.$q.notify({
          type: 'negative',
          message: 'Something went wrong. Please try resetting password again...'
        })
      })

      this.$router.replace(this.$route.path)
    },

    onLoginSuccess () {
      this.getLastUserPreferences({ userId: this.currentUser?.id }).then(() => {
        const referrer = LocalStorageService.popLoginReferrer()
        const returnTo = this.completedOnboarding
          ? (referrer || '/training-plan')
          : '/onboarding'
        this.$router.replace(returnTo)
      })
    },
    onLoginFailure (err) {
      this.$q.notify({
        type: 'negative',
        message: err?.data || 'Something went wrong. Please try again in few minutes'
      })
    },

    checkAccessCode () {
      this.showPageLoader = true
      return this.validateAccessCode(this.accessCode)
        .then((accessCodeValid) => {
          if (!accessCodeValid) {
            throw new Error('invalid access code')
          }
        })
        .catch(() => {
          LocalStorageService.popLoginReferrer()
          // this.showBadAccessCode = true
          this.afterBadAccessCode(null)
        })
        .finally(() => {
          this.showPageLoader = false
        })
    },
    afterBadAccessCode (state) {
      this.accessCode = null
      this.showBadAccessCode = false
      this.changeState(state)
      this.$router.replace('/login')
    }
  },

  async mounted () {
    this.accessCode = this.$route.query.accessCode
    if (!this.isLoggedIn) {
      this.showPageLoader = true
      await this.doOauthStep2(this.$route.query)
        .catch(() => this.onLoginFailure({
          data: `Invalid ${this.displayProviderName(this.$route.query.provider)} login! Please login with email/password`
        }))
        .then(() => this.authorizeUserStored())
        .then(() => this.onLoginSuccess())
        .catch(() => {})
        .finally(() => {
          this.showPageLoader = false
        })
    }
    if (this.accessCode) {
      return this.checkAccessCode()
    }
    if (this.$route.query.promocode) {
      this.referralLink = this.$route.query.promocode
    }
    if (this.$route.query.ref) {
      this.tapfiliateRef = this.$route.query.ref
    }
    if (this.$route.query.referral) {
      this.referralLink = this.$route.query.referral
      this.trackAction('Referrals: View sign up page', { referralId: this.referralLink })
      sendReferralAnalytics(this.currentUser.id, this.referralLink, 'link-click')
    }
    if (this.isLoggedIn) {
      this.onLoginSuccess()
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (to.matched.some(route => route.path === '/login')) {
        // if we navigated to login path directly, switch to login state
        // instead of the default signup CTA state
        vm.changeState('sign-in')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.onboarding{
  &__container{
    height: var(--app-height);
    box-sizing: border-box;
    @media (max-width: $breakpoint-xs-max) {
      height: unset;
      padding-bottom: 60px;
    }
  }
  &__sign-container{
    background: $dark;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    @media (max-width: $breakpoint-xs-max) {
      background: transparent;
      overflow-y: auto;
      min-height: unset;
      height: auto;
    }
  }
  &__sign-content{
    width: 100%;
    max-width: 480px;
    text-align: center;
    @media (max-width: $breakpoint-xs-max) {
      min-height: 100%;
      height: 100%;
      flex-direction: column;
      display: flex;
      justify-content: flex-start;
      text-align: left;
      .text-h1{
        font-size: 2.5rem;
      }
    }
  }
  &__leftbar {
    height: var(--app-height);
    width: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &-header {
      height: 100px;
      border-bottom: 1px solid $mid-tone;
      display: flex;
      align-items: center;
    }
    &-content{
      padding: 40px;
    }
    .thing-index{
      background: $dark-pink;
      width: 50px;
      height: 50px;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      position: relative;
    }
  }
}
</style>

<style lang="scss">
.onboarding {
  &__base {
    display: flex;
    background: var(--app-bg);
    background-size: cover;
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
    height: var(--app-height);
    /deep/ * {
      user-select: none;
    }

    .q-drawer {
      background: transparent !important;

      &.q-dark {
        background: $dark !important;
        box-shadow: 0 0 10px rgba(0, 0, 0, .5);
      }
    }
  }

  &__center {
    width: 100%;
    height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
}

@media (max-width: $breakpoint-xs-max) {
  .onboarding__center{
    min-height: 500px;
  }
  .login-fixed-bottom{
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 40px;
  }
}
</style>
