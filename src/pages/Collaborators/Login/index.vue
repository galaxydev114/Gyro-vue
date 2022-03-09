<template>
  <div class="onboarding__base onboarding__center text-gray">
    <q-layout view="hHh lpR fFf">
      <q-drawer
        :width="leftBarWidth"
        v-if="$q.screen.width > 768 && !resetToken"
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
              Collaborators ONLY!
            </div>
            <div class="text-h4 text-weight-regular q-mt-md q-mb-xl">
              With NOVOS
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
              <template>
                <!--          SECURITY ACTION TYPE-->
                <recovery-password v-show="showState('recovery')"
                                   @submit="recoverPassword"
                                   @changeState="changeState" />
                <sign-in v-show="showState('sign-in')"
                         :isNewVisible="false"
                         @submit="login"
                         @discord="startDiscordOauthFlow"
                         @changeState="changeState" />
              </template>
            </template>
          </div>
        </div>
      </q-page-container>

      <page-loader v-if="showPageLoader" />

    </q-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { sendSegmentEvent } from '@/services/segment'

export default {
  components: {
    'recovery-password': () => import('@/components/onboarding/includes/security/_recovery-password'),
    'sign-in': () => import('@/components/onboarding/includes/security/_sign-in'),
    'change-password': () => import('@/components/onboarding/includes/security/_change-password'),
    'page-loader': () => import('@/components/common/page-loader')
  },

  data () {
    return {
      leftBarWidth: 400,
      showBar: true,
      showPageLoader: false,
      currentState: 'sign-in',
      discordOauthUri: process.env.VUE_APP_DISCORD_OAUTH_URL,
      referralLink: null,
      acceptTermsAndCondition: false
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      currentUser: 'user/currentUser'
    }),
    ...mapState({
      completedOnboarding: state => state.user.completedOnboarding,
      currentUserCollaboratorData: state => state.user.collaborator
    }),

    userId () { return this.$route.query.user_id },
    resetToken () { return this.$route.query.token },

    thingsYouCanExpect () {
      return [
        'Create your own content',
        'Be in touch with your fand',
        'Earn Money'
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
      userLogout: 'user/logout'
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
    startDiscordOauthFlow () {
      if (this.currentState === null && !this.acceptTermsAndCondition) {
        this.showErrorMessage('Please agree to the terms and conditions and the privacy policy')
        this.trackAction('Error occured on Registraion Details', { error: 'User don\'t accept Terms, Conditions and Privacy policy' })
      } else {
        location.href = this.discordOauthUri
      }
    },
    startEmailFlow () {
      if (this.currentState === null && !this.acceptTermsAndCondition) {
        this.showErrorMessage('Please agree to the terms and conditions and the privacy policy')
        this.trackAction('Error occured on Registraion Details', { error: 'User don\'t accept Terms, Conditions and Privacy policy' })
      } else {
        this.changeState('create')
      }
    },

    doDiscordOauthStep2 ({ code }) {
      if (code) {
        this.showPageLoader = true
        return this.userLogin({ code, accessCode: null, redirect_uri: window.location.origin + this.$route.path })
          .then(() => {
            sendSegmentEvent('Login by Discord Success', { userId: this.currentUser.id })
          })
          .catch((err) => {
            sendSegmentEvent('Login by Discord Failure', { error: err })
            throw err
          })
          .finally(() => { this.showPageLoader = false })
      }
      return Promise.resolve()
    },

    login (form) {
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
        accessCode: null,
        referralLink: this.referralLink,
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
        let returnTo = 'collabLogin'
        if (this.completedOnboarding) {
          if (this.currentUserCollaboratorData?.isCollaborator) {
            returnTo = 'collabDashboard'
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'User is not collaborator - please contact support to be a collaborator'
            })
            this.userLogout().then(() => {
              this.$router.push({ name: 'collabLogin' })
            })
          }
        } else {
          this.userLogout().then(() => {
            this.$router.push({ name: 'collabLogin' })
          })
          this.$q.notify({
            type: 'negative',
            message: 'Something went wrong. Please try again in few minutes'
          })
        }
        this.$router.push({ name: returnTo })
      })
    },
    onLoginFailure (err) {
      this.$q.notify({
        type: 'negative',
        message: err?.data || 'Something went wrong. Please try again in few minutes'
      })
    },

    trackAction (action, opts = {}) {
      sendSegmentEvent(action, opts)
    }
  },

  async mounted () {
    if (!this.isLoggedIn) {
      this.showPageLoader = true
      await this.doDiscordOauthStep2(this.$route.query)
        .catch(() => this.onLoginFailure({
          data: 'Invalid Discord login! Please login with email/password'
        }))
        .then(() => this.authorizeUserStored())
        .then(() => this.onLoginSuccess())
        .catch(() => {})
        .finally(() => {
          this.showPageLoader = false
        })
    }

    if (this.$route.query.promocode) {
      this.referralLink = this.$route.query.promocode
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
