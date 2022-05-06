<template>
  <q-page class="container">
    <page-loader v-if="showLoader" />
    <div v-else class="joinfg__base text-gray">
      <joining-process-setup
        :skipLooking="shouldSkipLooking"
        :applicationReadyCallback="finishFGApplication"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'page-loader': () => import('@/components/common/page-loader'),
    'joining-process-setup': () => import('@/components/friend-group/_joining-process-setup')
  },
  data () {
    return {
      shouldSkipLooking: true,
      showLoader: false
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser',
      currentUserScore: 'user/currentUserScore'
    })
  },
  methods: {
    ...mapActions({
      reloadUser: 'user/loadUser',
      getUserScore: 'user/getUserScore',
      applyForFriendGroup: 'user/applyForFriendGroup'
    }),
    async finishFGApplication (applicationData) {
      if (this.currentUser?.id) {
        // TODO: No sure what logic needed here
        await this.applyForFriendGroup({ userId: this.currentUser.id, applicationData })
      }
    }
  },
  async created () {
    this.showLoader = true
    if (!this.currentUserScore) {
      await this.getUserScore({ userId: this.currentUser?.id, forceCalc: true })
    }
    this.showLoader = false
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
      width: calc((var(--app-height) / 100) * 5);
      height: calc((var(--app-height) / 100) * 5);
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
