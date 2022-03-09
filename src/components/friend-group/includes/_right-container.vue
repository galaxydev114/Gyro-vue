<template>
  <div ref="content" class="joinfg__rightbar q-pa-md q-py-lg q-py-lg-xl q-px-lg-lg relative-position" :class="{'joinfg__rightbar--not-rendered': firstInit}">
    <div class="col lt-md">
      <div class="text-subtitle1 text-weight-bold text-pink">
        Step <span class="text-white">{{ currentStep }}</span> of 6
      </div>
    </div>
    <div class="col" :class="{'text-center': $q.screen.gt.sm}" v-if="preparingList[currentStep - 1]" :key="currentStep">
      <div class="text-h1" v-html="preparingList[currentStep - 1].title" ref="title">
      </div>
      <div class="text-h4 text-weight-regular q-mt-sm" ref="description"
        v-html="preparingList[currentStep - 1].description">
      </div>
    </div>
    <!-- Step 1-->
    <skill-score key="score-graph"
      @next="$emit('next'); trackAction('Skill Score: Click Next')"
      v-if="isCurrentStep('skillScore')"/>
    <!-- Step 2-->
    <league-select key="league-page"
      :selectedLeague="selectedLeague"
      @next="$emit('next'); trackAction('League Select: Click Next')"
      @previous="$emit('previous'); trackAction('League Select: Click Previous')"
      v-if="isCurrentStep('leagueSelect')"/>
    <!-- Step 3-->
    <region-select key="region-page"
      :selectedRegion="selectedRegion"
      @next="$emit('next'); trackAction('Region Select: Click Next')"
      @previous="$emit('previous'); trackAction('Region Select: Click Previous')"
      v-if="isCurrentStep('regionSelect')"/>
    <!-- Step 4-->
    <language-select key="language-page"
      @next="$emit('next'); trackAction('Language Select: Click Next')"
      @previous="$emit('previous'); trackAction('Language Select: Click Previous')"
      @chooseAnother="goChooseAnother(); trackAction('Language Select: Click Choose Another')"
      v-if="isCurrentStep('languageSelect') && !preferedLangauge"/>
    <!-- Step 4-->
    <preferred-language-select key="language-page"
      @next="$emit('next'); trackAction('Language Select: Click Next')"
      @chooseEnglish="goChooseEnglish(); trackAction('Language Select: Click Previous')"
      v-if="isCurrentStep('languageSelect') && preferedLangauge"/>
    <!-- Step 5-->
    <available-select key="availability-page"
      :selectedAvailability="availabilityOptions"
      @next="$emit('next'); trackAction('Availability Select: Click Next')"
      @previous="$emit('previous'); trackAction('Availability Select: Click Previous')"
      v-if="isCurrentStep('availableSelect')"/>
    <!-- Step 6-->
    <platform-select key="platform-page"
      :selectedPlatform="selectedPlatform"
      @next="$emit('next'); trackAction('Platform Select: Click Next')"
      @previous="$emit('previous'); trackAction('Platform Select: Click Previous')"
      v-if="isCurrentStep('platformSelect')"/>
  </div>
</template>

<script>

export default {
  props: {
    currentStep: {
      type: Number,
      default: () => 1
    },
    preparingList: {
      type: Array,
      default: () => []
    },
    stepsComponentKey: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'skill-score': () => import('./_score'),
    'league-select': () => import('./_league'),
    'region-select': () => import('./_region'),
    'language-select': () => import('./_language'),
    'preferred-language-select': () => import('./_preferred_language'),
    'available-select': () => import('./_availability'),
    'platform-select': () => import('./_platform')
  },
  data () {
    return {
      preferedLangauge: false,
      selectedLeague: -1,
      selectedRegion: '',
      availabilityOptions: [],
      selectedPlatform: '',
      firstInit: true
    }
  },
  methods: {
    isCurrentStep (key) {
      return this.stepsComponentKey[this.currentStep - 1] === key
    },
    goChooseAnother () {
      this.preferedLangauge = true
    },
    goChooseEnglish () {
      this.preferedLangauge = false
    }
  },
  mounted () {
    setTimeout(() => {
      this.firstInit = false
    }, 200)
  }
}
</script>
