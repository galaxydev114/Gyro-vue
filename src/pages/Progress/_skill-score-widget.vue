<template>
<div class="skill-score-widget">
  <div class="flex column full-height">
    <div class="flex q-px-md justify-center items-center">
    <h2 v-if="!isPredicted" class="font-rift q-my-md" style="color: #8B8299;">{{oldScoreRounded}}</h2>
    <c-icon v-if="!isPredicted" class="q-mx-sm" icon="rightArrow" width="14px" />
    <h2 class="font-rift text-pink q-my-md">{{scoreRounded}}</h2></div>
    <div class="flex q-px-md justify-center items-center">
      <svg v-if="!isPredicted && scoreImprovementPerc != 0" :style="scoreImprovementPerc < 0 && `transform: rotate(180deg)`" width="14" height="12" class="q-mr-xs" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.26795 1.07031C6.03775 -0.263021 7.96225 -0.263021 8.73205 1.07031L13.268 8.92672C14.0378 10.2601 13.0755 11.9267 11.5359 11.9267H2.4641C0.924501 11.9267 -0.0377494 10.2601 0.732051 8.92672L5.26795 1.07031Z" :fill="scoreImprovementPerc >= 0 ? '#2CAD6D' : 'red'"/>
      </svg>
      <div style="opacity: 0.7;">{{oldScoreDateString}}</div>
    </div>
  </div>
  <div class="skill-score-widget-graph">
    <svg style="max-height: 130px;" viewBox="0 0 201 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line opacity="0.5" x1="1.23047" y1="88.2461" x2="199.999" y2="88.2461" stroke="#433558" stroke-width="1.5"/>
      <line opacity="0.5" x1="1.23047" y1="23" x2="199.999" y2="23" stroke="#433558" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line opacity="0.5" x1="1.23047" y1="1.25" x2="199.999" y2="1.25" stroke="#433558" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line opacity="0.5" x1="1.23047" y1="44.75" x2="199.999" y2="44.75" stroke="#433558" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line opacity="0.5" x1="1.23047" y1="66.5" x2="199.999" y2="66.5" stroke="#433558" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line opacity="0.5" x1="40.2339" y1="88.9961" x2="40.2339" y2="1.99821" stroke="#433558" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line opacity="0.5" x1="158.802" y1="88.9961" x2="158.802" y2="1.99821" stroke="#433558" stroke-width="1.5" stroke-dasharray="4 4"/>
      <path d="M47.6864 53.8472C22.032 88.999 15.7917 85.8444 1 88.999H100.151H199.302C189.209 86.4453 179.656 88.999 153.309 53.8472C126.961 18.6953 111.014 18.6953 100.151 18.6953C89.2882 18.6953 73.3408 18.6953 47.6864 53.8472Z" fill="url(#paint0_linear_9891:0)" fill-opacity="0.1"/>
      <path d="M1 88.999C15.7917 85.8444 22.032 88.999 47.6864 53.8472C73.3408 18.6953 89.2882 18.6953 100.151 18.6953C111.014 18.6953 126.961 18.6953 153.309 53.8472C179.656 88.999 189.209 86.4453 199.302 88.999" stroke="#DD2678" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- <rect :x="oldSkillScorePosition" :y="oldSkillScoreY" width="4" :height="oldSkillScoreHeight" fill="#DFDAE7" stroke="#382B4B" stroke-width="2"/> -->
      <!-- <rect :x="oldSkillScorePosition - 2" :y="oldSkillScoreY + 1" width="8" height="8" rx="4" fill="#231538" stroke="#DFDAE7" stroke-width="2"/> -->
      <rect :x="skillScorePosition" :y="skillScoreY" width="4" :height="skillScoreHeight" fill="#DD2678" stroke="#382B4B" stroke-width="2"/>
      <rect :x="skillScorePosition - 2" :y="skillScoreY + 1" width="8" height="8" rx="4" fill="url(#paint1_linear_9891:0)" stroke="#DD2678" stroke-width="2"/>
      <defs>
      <linearGradient id="paint0_linear_9891:0" x1="100.151" y1="18.6953" x2="100.151" y2="88.999" gradientUnits="userSpaceOnUse">
      <stop stop-color="#DD2678"/>
      <stop offset="1" stop-color="#DD2678" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint1_linear_9891:0" x1="78.7274" y1="10.7899" x2="82.3071" y2="17.335" gradientUnits="userSpaceOnUse">
      <stop stop-color="#D92779"/>
      <stop offset="1" stop-color="#7C277E"/>
      </linearGradient>
      </defs>
    </svg>
    <div class="flex justify-between full-width q-mt-xs text-gray"><div v-bind:key="desc" v-for="desc in ['Beginner', 'Intermediate', 'Advanced', 'Pro']" class="skill-score-text">{{desc}}</div></div>
  </div>
</div>
</template>
<script>
import { date } from 'quasar'
const GRAPH_VIEW_WIDTH = 195
const GRAPH_VIEW_HEIGHT = 90
// style="{position: 'absolute', top: tooltipPos?.y, left: tooltipPos?.x}"
export default {
  props: {
    maxScore: {
      type: Number,
      default: () => 1000
    },
    score: {
      type: Number,
      default: () => 0
    },
    scoreDate: {
      type: Date,
      default: () => null
    },
    oldScore: {
      type: Number,
      default: () => 1
    },
    oldScoreDate: {
      type: Date,
      default: () => null
    },
    isPredicted: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    oldScoreRounded () {
      return Math.round(this.oldScore)
    },
    scoreRounded () {
      return Math.round(this.score)
    },
    skillScoreY () {
      return this.getSkillScoreY('new')
    },
    skillScoreHeight () {
      return this.getSkillScoreHeight('new')
    },
    skillScorePosition () {
      return this.getSkillScorePosition('new')
    },
    oldSkillScoreY () {
      return this.getSkillScoreY('old')
    },
    oldSkillScoreHeight () {
      return this.getSkillScoreHeight('old')
    },
    oldSkillScorePosition () {
      return this.getSkillScorePosition('old')
    },
    scoreImprovementPerc () {
      return Math.round(1000 * (this.score - this.oldScore) / this.oldScore) / 10
    },
    oldScoreDateString () {
      if (this.isPredicted) {
        return 'Initial score' + (this.scoreDate ? ` for ${date.formatDate(this.scoreDate, 'MMMM D')}` : '')
      } else {
        const dateStr = this.oldScoreDate ? date.formatDate(this.oldScoreDate, 'MMMM D') : ''
        return `${this.scoreImprovementPerc >= 0 ? '+' : '-'}${this.scoreImprovementPerc}%` + (dateStr ? ` from ${dateStr}` : '')
      }
    }
  },
  methods: {
    getSkillScoreY (scoreType) {
      const scoreHeight = this.getSkillScoreHeight(scoreType)
      return GRAPH_VIEW_HEIGHT - scoreHeight
    },
    getSkillScoreHeight (scoreType) {
      const score = scoreType === 'new' ? this.score : this.oldScore
      const startHeight = 40
      const heightMaxGain = GRAPH_VIEW_HEIGHT - startHeight
      return startHeight + (score < this.maxScore / 2 ? score * 2 * heightMaxGain / this.maxScore : (this.maxScore - score) * 2 * heightMaxGain / this.maxScore)
    },
    getSkillScorePosition (scoreType) {
      const score = scoreType === 'new' ? this.score : this.oldScore
      return score * GRAPH_VIEW_WIDTH / this.maxScore
    }
  }
}
</script>

<style lang="scss" scoped>
.skill-score-widget-graph {
    display: flex;
    max-width: 290px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
}
.skill-score-widget {
    // max-height: 260px;
    height: 100%;
    max-width: 550px;
    padding-bottom: 10px;
    border-radius: 6px;
    background: #382B4B;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  @media (max-width: $breakpoint-md-max) {
    max-height: unset;
    max-width: unset;
  }
}
.skill-score-text {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.3
}
</style>
