<template>
  <q-page class="container">
    <div class="joinfg__base text-gray">
      <joining-process-setup :userName="userName"
                    :skipScore="shouldSkipScore"
                    :emailAddress="currentUser.email"
                    @finish="finishOnboardingClicked"
                    @start-over="showType = 'user-setup'"/>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  components: {
    'joining-process-setup': () => import('@/components/friend-group/_joining-process-setup')
  },
  computed: {
    ...mapGetters({
      accessCodeValid: 'accessCode/accessCodeValid',
      currentUser: 'user/currentUser',
      userScore: 'user/userScore',
      isLoggedIn: 'user/isLoggedIn'
    }),
    ...mapState('user', ['completedOnboarding'])
  },
  data () {
    return {
      userName: null,
      showType: 'user-setup',
      shouldSkipScore: false,
      email: null,
      isWithEmail: false,
      promo: null,
      isWithPromo: false,
      isWithAccessCode: false
    }
  },
  methods: {
    ...mapActions('user', [
      'authorizeUserStored',
      'getLastUserPreferences',
      'logout'
    ]),

    skipFNStep () {
      this.shouldSkipScore = true
      this.showProcessSetup(null)
    },

    showProcessSetup (user) {
      if (!this.userScore || !Object.values(this.userScore)?.filter(Boolean).length) {
        this.shouldSkipScore = true
      }
      this.userName = user
      this.showType = 'process-setup'
    },
    shouldShow (type) {
      return this.showType === type
    },
    finishOnboardingClicked () {
      this.trackAction('Finish Onboarding', { promo: this.$route.query.promocode })
      this.$router.push('/training-plan?joinfg=first')
    },

    preventNav (e) {
      if (!this.shouldShow('process-setup')) return
      e.preventDefault()
      e.returnValue = ''
    },

    collectMetricsOnStart () {
      this.trackAction('Start Onboarding', {
        isWithEmail: this.isWithEmail,
        isWithPromo: this.isWithPromo,
        email: this.email,
        promo: this.promo,
        isWithAccessCode: this.isWithAccessCode
      })
    },
    collectDataOnStart () {
      this.email = this.$route.query.email
      this.isWithEmail = Boolean(this.email)
      this.promo = this.$route.query.promocode
      this.isWithPromo = Boolean(this.promo)
      this.isWithAccessCode = Boolean(this.accessCodeValid)
    }
  },
  async mounted () {
    this.collectDataOnStart()
    this.collectMetricsOnStart()
  },
  beforeMount () {
    window.addEventListener('beforeunload', this.preventNav)
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.preventNav)
    this.currentStep = 1
    this.userName = ''
  },
  beforeRouteEnter (to, from, next) {
    if (to.query.accessCode) {
      next({ path: '/login', query: to.query })
    } else {
      next()
    }
  }
}
</script>

<style lang="scss">

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
{
  opacity: 0;
}

.joinfg {
  &__base {
    display: flex;
    background: var(--app-bg);
    background-size: cover;
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
    height: var(--app-height);
    @media all and (max-width: $breakpoint-sm-max){
      height: auto!important;
      overflow-y: auto!important;;
    }
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
    @media all and (max-width: $breakpoint-sm-max){
      height: auto!important;;
    }
  }
}

.join-fg-steps {
  &__item {
    $root: &;
    margin-bottom: 10px;

    &-index {
      background: $soft-tone;
      width: calc((var(--app-height) / 100) * 4.5);
      height: calc((var(--app-height) / 100) * 4.5);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid $soft-tone;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      position: relative;

      @media all and (max-width: $breakpoint-sm-max) {
        width: 50px;
        height: 50px;
      }

      &:after {
        content: "";
        position: absolute;
        bottom: -20px;
        left: 50%;
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        transform: translateX(-50%);
        background: $soft-tone;
      }
    }

    &--active {
      #{$root}-index {
        border-color: $dark-pink;
        color: $dark-pink;
      }
    }

    &--done {
      #{$root}-index {
        border-color: $dark-pink;
        background: $dark-pink;

        &:after {
          background: $dark-pink;
        }
      }
    }
    &--disable {
      opacity: 0.2;
    }

    &:last-child {
      #{$root}-index:after {
        display: none;
      }
    }
  }
}
</style>
