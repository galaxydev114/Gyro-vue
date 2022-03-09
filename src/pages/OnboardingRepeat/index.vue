<template>
  <q-page class="container">
    <div class="onboarding__base">
      <process-setup :userName="currentUser.fortniteNickname"
                     :emailAddress="currentUser.email"
                     v-if="!completing"
                     @finish="finishUserPreferencesClicked"/>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    'process-setup': () => import('@/components/onboarding/_process-setup-second-time.vue')
  },
  data () {
    return {
      completing: false
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser'
    })
  },
  methods: {
    ...mapActions({
    }),
    finishUserPreferencesClicked () {
      this.$router.push('/training-plan?onboarding=repeat')
    }
  }
}
</script>

<style lang="scss">

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

.onboarding{
  &__base{
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
    .q-drawer{
      background: transparent!important;
      &.q-dark{
        background: $dark!important;
        box-shadow: 0 0 10px rgba(0, 0, 0, .5);
      }
    }
  }
  &__center{
    width: 100%;
    height: calc( 100% - 100px );
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
  &__header{
    border-bottom: 1px solid $mid-tone;
    height: 100px;
    padding: 0 25px;
    justify-content: revert;
    @media all and (max-width: 576px){
      .col-5{
        order: 2;
        text-align: right;
      }
      .col-7{
        text-align: left;
      }
    }
  }
}
.training-steps{
  &__item{
    $root: &;
    margin-bottom: 10px;
    &-index{
      background: $soft-tone;
      width: 50px;
      height: 50px;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid $soft-tone;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      position: relative;
      &:after{
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
    &--active{
      #{$root}-index{
        border-color: $dark-pink;
        color: $dark-pink;
      }
    }
    &--done{
      #{$root}-index{
        border-color: $dark-pink;
        background: $dark-pink;
        &:after{
          background: $dark-pink;
        }
      }
    }
    &:last-child{
      #{$root}-index:after{
        display: none;
      }
    }
  }
}
</style>
