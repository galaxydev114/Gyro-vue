<template>
  <div ref="content" class="joinfg__rightbar q-pa-md q-py-lg q-py-lg-xl q-px-lg-lg relative-position" :class="{'joinfg__rightbar--not-rendered': firstInit}">
    <div class="col" :class="{'text-center': $q.screen.gt.sm}" v-if="preparingList[currentStep - 1]" :key="currentStep">
      <div class="text-h1" v-html="preparingList[currentStep - 1].title" ref="title">
      </div>
      <div class="text-h4 text-weight-regular q-mt-sm" ref="description"
        v-html="preparingList[currentStep - 1].description">
      </div>
    </div>
    <!-- Step 1-->
    <skill-score key="score-graph"
      :score="currentUserScore"
      :hideInfo="true"
      @next="$emit('next'); trackAction('Skill Score: Click Next')"
      v-if="isCurrentStep('skillScore')"/>
    <!-- Step 2-->
    <league-select key="league-page"
      :selectedLeague="selectedLeague"
      @selected="onLeagueSelect"
      @next="$emit('next'); trackAction('League Select: Click Next')"
      @previous="$emit('previous'); trackAction('League Select: Click Previous')"
      v-if="isCurrentStep('leagueSelect')"/>
    <!-- Step 3-->
    <region-select key="region-page"
      :selectedRegion="selectedRegion"
      @selected="onRegionSelect"
      @next="$emit('next'); trackAction('Region Select: Click Next')"
      @previous="$emit('previous'); trackAction('Region Select: Click Previous')"
      v-if="isCurrentStep('regionSelect')"/>
    <!-- Step 4-->
    <language-select key="language-page"
      @next="$emit('next'); trackAction('Language Select: Click Next')"
      @previous="$emit('previous'); trackAction('Language Select: Click Previous')"
      @chooseAnother="goChooseAnother(); trackAction('Language Select: Click Choose Another')"
      v-if="isCurrentStep('languageSelect') && showEngLangPage"/>
    <!-- Step 4-->
    <preferred-language-select key="language-page"
      :languages="pickableLanguages"
      :selectedLanguage="selectedLanguage"
      @selected="onLanguageSelect"
      @next="$emit('next'); trackAction('Language Select: Click Next')"
      @previous="$emit('previous'); trackAction('Language Select: Click Previous')"
      v-if="isCurrentStep('languageSelect') && !showEngLangPage" />
    <!-- Step 5-->
    <available-select key="availability-page"
      :selectedAvailability="availabilityOptions"
      @selected="onAvailabilitySelect"
      @next="$emit('next'); trackAction('Availability Select: Click Next')"
      @previous="$emit('previous'); trackAction('Availability Select: Click Previous')"
      v-if="isCurrentStep('availableSelect')"/>
    <!-- Step 6-->
    <platform-select key="platform-page"
      :selectedPlatform="selectedPlatform"
      @selected="onPlatformSelect"
      @next="onLastFGApplicationStepPass"
      @previous="$emit('previous'); trackAction('Platform Select: Click Previous')"
      v-if="isCurrentStep('platformSelect')"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { languages } from '@/constants'

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
    },
    userPrefer: {
      type: Object,
      default: null
    }
  },
  components: {
    'skill-score': () => import('@/components/skill-score'),
    'league-select': () => import('./_league'),
    'region-select': () => import('./_region'),
    'language-select': () => import('./_language'),
    'preferred-language-select': () => import('./_preferred_language'),
    'available-select': () => import('./_availability'),
    'platform-select': () => import('./_platform')
  },
  data () {
    return {
      selectedLeague: this.userPrefer ? this.userPrefer.league : null,
      selectedRegion: this.userPrefer ? this.userPrefer.region : '',
      isEnglishLangPreferred: this.userPrefer ? this.userPrefer.language === languages.LANGS.ENGLISH.code : true,
      selectedLanguageCode: this.userPrefer ? this.userPrefer.language : languages.LANGS.ENGLISH.code,
      availabilityOptions: this.userPrefer ? this.userPrefer.availability : [],
      selectedPlatform: this.userPrefer ? this.userPrefer.platform : '',
      firstInit: true
    }
  },
  computed: {
    ...mapGetters({
      currentUserScore: 'user/currentUserScore'
    }),
    pickableLanguages () {
      const langs = languages.LANGS
      return [langs.ENGLISH.name, langs.FRENCH.name, langs.SPANISH.name]
    },
    selectedLanguage () {
      return languages.getLangNameForCode(this.selectedLanguageCode)
    },
    showEngLangPage () {
      return this.isEnglishLangPreferred && this.selectedLanguageCode === languages.LANGS.ENGLISH.code
    }
  },
  methods: {
    isCurrentStep (key) {
      return this.stepsComponentKey[this.currentStep - 1] === key
    },
    goChooseAnother () {
      this.isEnglishLangPreferred = false
    },
    onLeagueSelect (league) {
      this.selectedLeague = league
    },
    onRegionSelect (region) {
      this.selectedRegion = region
    },
    onLanguageSelect (language) {
      this.selectedLanguageCode = languages.getLangCodeForName(language)
    },
    onAvailabilitySelect (availability) {
      this.availabilityOptions = availability
    },
    onPlatformSelect (platform) {
      this.selectedPlatform = platform
    },
    onLastFGApplicationStepPass () {
      this.$emit('preview', {
        availability: this.availabilityOptions,
        platform: this.selectedPlatform,
        region: this.selectedRegion,
        league: this.selectedLeague,
        language: this.selectedLanguageCode
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.firstInit = false
    }, 200)
  }
}
</script>
