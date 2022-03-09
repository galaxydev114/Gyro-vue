<template>
  <div class="score-card" :class="{'score-card--show': readyToShow}">
    <q-img src="./../../../assets/onboarding/info.svg"
           class="tooltip-icon"
           height="20px"
           width="20px"
           v-if="description"
    >
      <q-tooltip anchor="top left"
                 self="bottom middle"
                 max-width="240px"
                 content-style="background-color: #382B4B; font-size: 14px"
                 :offset="[10, 10]"
                 @show="$emit('tooltip-hover')">
        {{ description }}
      </q-tooltip>
    </q-img>
    <div class="text-h5 text-weight-bold q-mb-sm">
      {{ title }}
    </div>
    <div class="d-flex items-center">
      <div class="text-h3 text-weight-bold">{{score}}</div>
      <div class="text-h3 q-px-sm">
        <q-img src="@/assets/onboarding/right-arrow.svg" height="12px" width="16px" />
      </div>
      <div class="text-h3 text-weight-bold text-pink">{{potentialScore}}</div>
    </div>
    <div class="column">
      <div class="col">
        <q-linear-progress :value="currentScore"
                           rounded
                           size="6px"
                           color="green"
                           class="q-mt-md" />
        <q-linear-progress :value="featureScore"
                           rounded
                           size="6px"
                           color="dark-pink"
                           class="q-mt-sm" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: () => null
    },
    title: {
      type: String,
      default: () => null
    },
    score: {
      type: Number,
      default: 3
    },
    potentialScore: {
      type: Number,
      default: 6
    },
    targetScore: {
      type: Number,
      default: 10
    },
    maxScore: {
      type: Number,
      default: 10
    },
    delay: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentScore: 0,
      featureScore: 0,
      readyToShow: false
    }
  },
  computed: {
    isInversed () {
      return this.targetScore < this.maxScore
    }
  },
  mounted () {
    setTimeout(() => {
      this.readyToShow = true
      setTimeout(() => {
        this.currentScore = this.isInversed ? (this.maxScore - this.score) / this.maxScore : this.score / this.maxScore
        this.featureScore = this.isInversed ? (this.maxScore - this.potentialScore) / this.maxScore : this.potentialScore / this.maxScore
      }, 1200)
    }, this.delay)
  }
}
</script>

<style lang="scss">
.score-card{
  background: $dark-one ;
  border-radius: 6px;
  padding: 20px;
  position: relative;
  margin-bottom: 10px;
  opacity: 0;
  transition: all .6s ease-in-out;
  &--show{
    opacity: 1;
  }
  .tooltip-icon{
    position: absolute;
    right: 10px;
    top: 10px;
  }
  @media all and (max-width: 1023px) {
    width: calc( 100% / 3 - 20px );
    margin: 10px 10px 0;
    display: inline-block;
    float: left;
  }
  @media all and (max-width: 768px) {
    width: 100%;
    margin: 0 0 20px;
  }
}
</style>
