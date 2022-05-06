<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer
      :value="$q.screen.gt.sm"
      :width="leftBarWidth"
      :content-style="{'background': 'none', 'position': 'relative'}">
      <left-bar
        :preparingList="computedPreparingArray"
        :currentStep="currentStep"
        @not-me="startOver(); trackAction('Click Start Over', { page: currentStep })"/>
    </q-drawer>
    <q-page-container>
      <left-bar-mobile
        v-if="$q.screen.lt.md"
        :preparingList="computedPreparingArray"
        :currentStep="currentStep"/>
      <right-container
        v-if="currentStep <= 6"
        :userPrefer="userSelection == null ? userPrefer : userSelection"
        :preparingList="computedPreparingArray"
        :currentStep="currentStep"
        :stepsComponentKey="stepsComponentKey"
        @previous="goPrevious();"
        @next="goNext();"
        @preview="onApplicationPreview"
      />
      <looking-players
        v-if="currentStep == 7"
        @next="goNext();"/>
      <review-choices
        v-if="currentStep == 8"
        :preferences="userSelection"
        @previous="goPrevious();"
        @finish="onApplicationFlowFinish"
      />
    </q-page-container>
    <page-loader v-if="showPageLoader" />
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    skipLooking: {
      type: Boolean,
      default: false
    },
    applicationReadyCallback: {
      type: Function,
      default: null
    }
  },
  components: {
    'left-bar': () => import('./includes/_leftbar'),
    'left-bar-mobile': () => import('./includes/_leftbar-mobile'),
    'right-container': () => import('./includes/_right-container'),
    'looking-players': () => import('./includes/_looking-players'),
    'review-choices': () => import('./includes/_review-choices'),
    'page-loader': () => import('@/components/common/page-loader')
  },
  data () {
    return {
      currentStep: 1,
      leftBarWidth: 360,
      showAlmostThere: false,
      showFindGroup: false,
      showPageLoader: false,
      userSelection: null
    }
  },
  methods: {
    onApplicationPreview (data) {
      this.userSelection = data
      this.goNext()
    },
    async onApplicationFlowFinish () {
      try {
        this.showPageLoader = true
        if (this.applicationReadyCallback) {
          await this.applicationReadyCallback(this.userSelection)
        }
        this.showPageLoader = false
        this.$router.replace({ name: 'TrainingPlan', query: { friendGroups: 'true' } })
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: 'Error happened. Please, try again later or contact us on discord'
        })
      }
    },
    goNext () {
      if (this.$q.screen.lt.sm) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }, 100)
      }

      const finish = this.currentStep === this.computedPreparingArray[this.computedPreparingArray.length - 1].step
      if (finish && this.skipLooking) {
        this.currentStep = 8
        // this.$emit('finish')
      } else {
        this.currentStep++
      }
    },
    goPrevious () {
      if (this.$q.screen.lt.sm) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }, 100)
      }
      if (this.currentStep === 8 && this.skipLooking) {
        this.currentStep -= 2
      } else {
        this.currentStep--
      }
    },
    startOver () {
      this.currentStep = 1
    }
  },
  computed: {
    ...mapGetters({
      userPrefer: 'user/userFriendGroupSelection'
    }),
    computedPreparingArray () {
      return [
        {
          step: 1,
          label: 'Your skill score',
          title: 'We consider your <span class="text-pink">Skill Score</span><br> to find you a perfect group',
          description: 'Your skill score helps us find the best group for you'
        },
        {
          step: 2,
          label: 'What league you’re in?',
          title: 'What <span class="text-pink">league</span> did You reach last season?',
          description: 'Through your Arena league in the previous season we will match you with the best group for you for rapid improvement'
        },
        {
          step: 3,
          label: 'Where do you live?',
          title: 'What <span class="text-pink">region</span> do you play?',
          description: ''
        },
        {
          step: 4,
          label: 'What is your language?',
          title: 'What is your preferred <span class="text-pink">language</span>?',
          // : 'Do you have good <span class="text-pink">Enlish</span>?',
          description: 'Tell us if that’s okay if people in your Friends Group will communicate in English mostly'
          //  : 'Tell us if that’s okay if people in your Friends Group will communicate in English mostly'
        },
        {
          step: 5,
          label: 'Is it your correct availability?',
          title: 'Is it your correct <span class="text-pink">availability</span>?',
          description: 'It will determine when you will have shared training with your team'
        },
        {
          step: 6,
          label: 'What platform do you play? ',
          title: 'What <span class="text-pink">platform</span> do you play?',
          description: 'Train with players using the same platform'
        }
      ]
    },
    stepsComponentKey () {
      // arr order should be the same as steps
      const steps = [
        'skillScore',
        'leagueSelect',
        'regionSelect',
        'languageSelect',
        'availableSelect',
        'platformSelect',
        'lookingPlayers'
      ]
      return steps
    }
  },
  beforeDestroy () {
    this.currentStep = 1
  }
}
</script>

<style lang="scss">
  .scores-container{
    opacity: 0;
    transition: all .6s ease-in-out;
    &--show{
      opacity: 1;
    }
  }
  .mobile-step{
    width: 32px;
    height: 32px;
    border: 2px solid $dark-pink;
    color: $dark-pink;
    border-radius: 100%;
  }
  .btn-previous {
    position: absolute;
    left: 30px;
    bottom: 30px;
  }
  .btn-next {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }
  .btn-join-fg {
    font-size: 18px;
    font-family: Rift;
    line-height: 0;
    color: $light-pink !important;
  }
  .joinfg {
    &__rightbar {
      height: var(--app-height);
      overflow-y: auto;
      width: 100%;
      background: $dark;
      transition: all .8s ease-in-out;
      position: relative;
      .text-h1, .text-h2, .text-h4, span {
        user-select: none; /* standard syntax */
        -webkit-user-select: none; /* webkit (safari, chrome) browsers */
        -moz-user-select: none; /* mozilla browsers */
        -khtml-user-select: none; /* webkit (konqueror) browsers */
        -ms-user-select: none; /* IE10+ */
      }
      &--not-rendered {
        transform: translateX(100%);
      }
      @media screen and (max-width: $breakpoint-xs-max) {
        min-height: calc(var(--app-height) - 80px);
        height: auto;
        .text-h1{
          font-size: 36px;
        }
        .text-h4{
          font-size: 16px;
        }
        .mt-fixed-bottom {
          position: absolute;
          left: 0;
          bottom: 25px;
          padding: 0px 16px;
        }
      }
      @media screen and (min-width: $breakpoint-xs-max) and (max-width: $breakpoint-sm-max) {
        height: calc(var(--app-height) - 80px);
        .mt-fixed-bottom {
          position: absolute;
          left: 0;
          bottom: 0px;
          padding: 0px 16px;
        }
      }
    }
  }
  .lbl-lang {
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
  }
</style>
