<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer
      :value="$q.screen.gt.sm"
      :width="leftBarWidth"
      :content-style="{'background': 'none', 'position': 'relative'}">
      <left-bar
        :preparingList="computedPreperingArray"
        :currentStep="currentStep"
        @not-me="startOver(); trackAction('Click Start Over', { page: currentStep })"/>
    </q-drawer>
    <q-page-container>
      <left-bar-mobile
        v-if="$q.screen.lt.sm"
        :preparingList="computedPreperingArray"
        :currentStep="currentStep"/>
      <right-container
        :preparingList="computedPreperingArray"
        :currentStep="currentStep"
        :stepsComponentKey="stepsComponentKey"
        @previous="goPrevious();"
        @next="goNext();"/>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  props: {

  },
  components: {
    'left-bar': () => import('./includes/_leftbar'),
    'left-bar-mobile': () => import('./includes/_leftbar-mobile'),
    'right-container': () => import('./includes/_right-container')
  },
  data () {
    return {
      currentStep: 1,
      leftBarWidth: 360
    }
  },
  methods: {
    goNext () {
      if (this.$q.screen.lt.sm) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }, 100)
      }

      const finish = this.currentStep ===
        this.computedPreperingArray[this.computedPreperingArray.length - 1].step

      if (finish) {
        this.finishUserPreferences({ userId: this.user.id }).then(() => {
          this.$emit('finish')
        })
      }
      this.currentStep++
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
      this.currentStep--
    },
    startOver () {
      this.currentStep = 1
    }
  },
  computed: {
    computedPreperingArray () {
      return [
        {
          step: 1,
          label: 'Your skill score',
          title: 'we match players from the same categories',
          description: 'Your skill score helps us find the best group for you',
          explainer: {
            subtitle: 'Skill score',
            text: 'This is your <span class="text-pink">estimated</span> skill score.</br> We will use it to fit you with the right training activities.'
          }
        },
        {
          step: 2,
          label: 'What league you’re in?',
          title: 'What <span class="text-pink">league</span> you’re in?',
          description: 'Your skill score helps us find the best group for you'
        },
        {
          step: 3,
          label: 'Where do you live?',
          title: 'What <span class="text-pink">region</span> do you play?',
          description: 'To make sure you play with players from your region'
        },
        {
          step: 4,
          label: 'What is your languege?',
          title: this.preferedLangauge ? 'What is your preferred <span class="text-pink">language</span>?' : 'Do you have good <span class="text-pink">Enlish</span>?',
          description: this.preferedLangauge ? 'Tell us if that’s okay if people in your Friends Group will communicate in English mostly' : 'Tell us if that’s okay if people in your Friends Group will communicate in English mostly'
        },
        {
          step: 5,
          label: 'Is it your correct availability?',
          title: 'Is it your correct <span class="text-pink">availability</span>?',
          description: 'To make sure you will have enough time playing together'
        },
        {
          step: 6,
          label: 'What platform do you play? ',
          title: 'What <span class="text-pink">platform</span> do you play?',
          description: 'We will select training routines based on your choices'
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
        'platformSelect'
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
    font-size: 20px;
    font-family: Rift;
  }
  .joinfg {
    &__rightbar {
      height: var(--app-height);
      overflow-y: auto;
      width: 100%;
      background: $dark;
      transition: all .8s ease-in-out;
      position: relative;

      &--not-rendered {
        transform: translateX(100%);
      }
      @media all and (max-width: $breakpoint-sm-max) {
        min-height: calc(var(--app-height) - 130px);
        height: auto;
        .text-h1{
          font-size: 36px;
        }
        .text-h4{
          font-size: 16px;
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
