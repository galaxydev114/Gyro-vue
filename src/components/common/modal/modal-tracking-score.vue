<template>
  <n-modal :visible="visible"
           :show-close="!skip"
           @close="trackSubmitScoreAction('click close modal'); $emit('close')">
    <div class="q-pa-md q-pa-sm-xl text-center">
      <template v-if="!skip">
        <div class="text-h2">
          Submit your score
        </div>
        <div class="text-h5 q-mt-sm q-mb-sm text-weight-regular">
          <slot />
        </div>
        <div class="q-my-lg">
          <div class="text-h5 text-weight-bold text-gray text-left q-mb-sm">
            {{isScoreTime ? 'Time (mm:ss)' : 'Score'}}
          </div>
          <q-input
            v-if='isScoreTime'
            outlined
            clearable
            @click="trackSubmitScoreAction('player type answer')"
            mask='time'
            fill-mask
            class="full-width no-arrow-input"
            placeholder="Enter score"
            v-model="score"
          >
          </q-input>
          <q-input
            v-else
            outlined
            clearable
            @click="trackSubmitScoreAction('player type answer')"
            type="number"
            class="full-width no-arrow-input"
            placeholder="Enter score"
            v-model="score"
          >
          </q-input>
        </div>

        <div class="block q-mt-sm">
          <c-btn class="q-mb-sm" @click="handleSubmitScore">
            SUBMIT YOUR SCORE
          </c-btn>
          <c-btn v-if="providedScore === 0 || !providedScore" outline @click="handleSkip">
            SKIP IT
          </c-btn>
        </div>
      </template>

      <template v-else>
        <div class="text-h4 text-pink">
          Are you sure you want to skip?
        </div>
        <div class="text-h5 text-gray opacity-75 text-weight-regular q-mt-sm">
          Skipping will set the score to 0
        </div>
        <div class="row q-col-gutter-sm q-mt-xl">
          <div class="col-6">
            <c-btn outline @click="trackSubmitScoreAction('confirm skip score'); $emit('skip')">
              Yes, Skip
            </c-btn>
          </div>
          <div class="col-6">
            <c-btn @click="trackSubmitScoreAction('cancel skip'); skip = false">
              <slot name="skip">No</slot>
            </c-btn>
          </div>
        </div>
      </template>
    </div>
  </n-modal>
</template>

<script>
import { durationStrFromSec } from '@/util/time'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    providedScore: {
      type: Number,
      default: null
    },
    isScoreTime: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  data () {
    return {
      score: null,
      skip: false
    }
  },
  methods: {
    handleSubmitScore () {
      if (this.isScoreTime) {
        const splittedScore = this.score.split(':')

        const seconds = (+splittedScore[0]) * 60 + (+splittedScore[1])

        this.score = seconds
      }
      this.trackSubmitScoreAction('player submit score', { score: this.score })
      this.$emit('score', this.score)
    },
    trackAction () {
      this.$emit('analytics', ...arguments)
    },
    trackSubmitScoreAction (event, ...restArgs) {
      this.trackAction('Trackable Session: Submit Score: ' + event, ...restArgs)
    },
    close () {
      this.$emit('close')
    },
    handleSkip () {
      if (this.providedScore) {
        this.trackSubmitScoreAction('instant skip score')
        this.$emit('skip')
      } else {
        this.trackSubmitScoreAction('try skip score')
        this.skip = true
      }
    }
  },
  watch: {
    providedScore: {
      immediate: true,
      handler (value) {
        if (this.isScoreTime) {
          this.score = durationStrFromSec(value)
        } else {
          this.score = value
        }
      }
    }
  }
}
</script>

<style lang="scss">

.no-arrow-input {
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>
