<template>
  <q-page class="container">
    <div class="onboarding__base onboarding__center text-gray">
      <user-setup-regular
        skipLoader
        allowLinkEpicSkip
        :referrer="referrer"
        @next="goBack"
        @skipFNStep="goBack"/>
    </div>
  </q-page>
</template>

<script>
export default {
  components: {
    'user-setup-regular': () => import('@/components/onboarding/_start-regular')
  },
  data () {
    return {
      referrer: null
    }
  },
  methods: {
    goBack (nick, redirect = null) {
      this.trackAction('Onboarding Repeat: Return from link Epic account')
      if (redirect) {
        this.$router.push(redirect)
      } else {
        this.$router.back()
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.referrer = from
    })
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

.onboarding {
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
    @media all and (max-width: $breakpoint-xs-max){
      padding-bottom: 50px;
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
</style>
