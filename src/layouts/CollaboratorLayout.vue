<template>
  <q-layout class="collab-panel">
    <div class="collab-panel__left">
      <div class="collab-nav column no-wrap">
        <div class="row items-center no-wrap q-mr-auto" style="flex-basis: 60px; width: 60px">
          <router-link to="/training-plan"  style="padding: 0;">
            <img src="@/assets/trainingPlan/logo-sm.svg" class="float-left" :width="$q.screen.lt.sm ? '50px' : '60px'" />
          </router-link>
        </div>

        <div class="collab-nav__section">
          <router-link
              :is="currentUser ? 'router-link' : 'span'"
              to="/collaborators/dashboard"
              class="collab-nav__section__item"
            >
            <img src="@/assets/trainingPlan/icons/progress.svg">
            <div class="collab-nav__section__item-label q-ml-md">
              <div class="text-h5">
                Dashboard
              </div>
            </div>
          </router-link>
        </div>
        <div class="collab-nav__section col-grow">
        </div>

        <div class="collab-nav__section" v-if="isCollaborator">
          <div @mouseover="showSupport = true"
              @mouseleave="showSupport = false"
              class="q-mb-md"
          >
            <div class="collab-nav__section__item">
              <img src="@/assets/trainingPlan/icons/help.svg" />
              <div class="collab-nav__section__item-label q-ml-md">
                <div class="text-h5">
                  Support
                </div>
              </div>
            </div>
            <div class="support-block" style="z-index:99999999"
                :class="{'support-block--active': showSupport}">
              <n-feedback />
            </div>
          </div>
          <div @click="onUserLogout"
            class="collab-nav__section__item q-mb-sm-none q-mb-md"
            :class="{
              'collab-nav__section__item--disabled': !currentUser,
              'collab-nav__section__item--thin': $q.screen.lt.sm
            }"
          >
            <img src="@/assets/icons/logout.svg" />
            <div class="collab-nav__item-label q-ml-md">
              <div :class="'text-h5'">
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="collab-panel__right">
      <router-view style="height: 100%"/>
    </div>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      showSupport: false
    }
  },
  components: {
    'n-feedback': () => import('@/components/common/feedback')
  },
  computed: {
    ...mapGetters({
      userCollaborator: 'user/userCollaborator',
      currentUser: 'user/currentUser'
    }),
    isCollaborator () {
      return !!this.userCollaborator
    }
  },
  mounted () {
    this.getCollaborators().then(() => {
      if (!this.isCollaborator) {
        this.$router.push({ name: 'collabLogin' })
      }
    })
  },
  methods: {
    ...mapActions({
      userLogout: 'user/logout',
      getCollaborators: 'collaborators/getCollaborators'
    }),
    onUserLogout () {
      if (!this.isCollaborator) { this.$router.push({ name: 'collabLogin' }) }
      this.userLogout().then(() => {
        this.$router.push({ name: 'collabLogin' })
      })
    }
  }
}
</script>

<style lang="scss">
@import url('~vue-good-table/dist/vue-good-table.css');

.collab-nav{
  width: 100% !important;
  height: 90vh !important;
  &__section {
    display: flex;
    flex-direction: column;
    margin-top: 20px;

    &:first-child {
      margin-top: 0;
    }
    &__item{
      width: 100%;
      height: 50px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-radius: 12px;
      padding: 16px;
      &--thin {
        div {
          font-weight: initial;
        }
      }
      &-ticker {
        position: absolute;
        top: -12px;
        right: -20%;
        font-size:12px;
      }
      &-label {
        position: relative;
        color: white;
      }
      &:hover{
        background: $soft-tone;
        cursor: pointer;
        text-decoration: none;
      }
      &.router-link-active{
        background: $dark-pink;
        opacity: 1;
        cursor: pointer;
        pointer-events: all;
      }
      &--disabled, &.disabled{
        opacity: .5;
        cursor: not-allowed;
      }
    }
  }
  &__section-header {
    padding: 10px 15px;
    margin-bottom: 15px;
    background: $soft-tone;
    border-radius: 6px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-weight: bold;
  }
}

.collab-panel {
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;

  &__left{
    height: 100vh;
    position: sticky;
    top: 0;
    width: 250px;
    padding: 40px 25px 25px;
    overflow-y: auto;
    background-color: $dark;

    a {
      text-transform: uppercase;
      color: $pink;
      font-size: 1rem;
      line-height: 120%;
      text-decoration: none;
      padding: 10px 0 10px 10px;

      &:hover{
        text-decoration: revert;
      }
      &.router-link-exact-active{
        background: black;
      }
    }
  }

  &__right{
    height: 100%;
    width: calc(100% - 250px);
    padding: 40px 25px 25px;
    background-color: $dark-sec;
  }
}
.support-block{
    position: fixed;
    left: 20px;
    bottom: 20px;
    z-index: 1999920;
    transition: all .2s ease-in-out;
    width: 330px;
    transform: translateY(150%);

    &--mobile{
      left: initial;
      bottom: initial;
      right: 20px;
      top: 20px;
      width: 90%;
      max-width: 330px;
      transform: translateY(-150%);
      @media (min-width: $breakpoint-sm-min) {
        display: none;
      }
    }
    &--active{
      box-shadow: 4px 4px 16px rgba(0, 0, 0, .3);
      transform: translateY(0);
    }
  }
</style>
