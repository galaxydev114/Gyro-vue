<template>
  <n-modal
    size="custom"
    width="530px"
    :visible="visible"
    @close="$emit('close')"
  >
    <div class="tracking-modal-content">
      <div class="q-mb-lg text-h4 text-weight-regular text-gray" v-if="focusTechnicesArray">
        To optimize your improvement we are going to focus this week on
        <span class="text-pink">{{focusTechnicesArray[0].label}}</span> and
        <span class="text-pink">{{focusTechnicesArray[1].label}}</span>.
        For these techniques What would you like to improve?
      </div>
      <div class="q-mb-lg text-left q-mt-md">
        <div  v-for="(question, i) in questions" :key="i" >
          <q-card bordered class="q-mb-md" v-if="!question.shouldHide">
            <q-card-section class="text-gray">
              <q-checkbox v-model="selected" :val="i" color="pink" :label="question ? question.label : ''" class="full-width" @input="v=>{filterCheckbox(v, i)}"/>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <c-btn :disabled="!this.selected.length" @click="handleConfirmation">
        Confirm your answer
      </c-btn>
    </div>
  </n-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import camelCase from 'camelcase'

export default {
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: [],
      questions: [
        {
          value: false,
          label: 'Master these techniques'
        },
        {
          value: false,
          label: 'Better applying these techniques in game'
        },
        {
          value: false,
          label: 'Focus on different techniques',
          shouldHide: this.$q.platform.is.mobile
        }
      ]
    }
  },
  methods: {
    filterCheckbox (val, i) {
      this.trackAction('Weekly focus modal: choose answer', {
        answerId: i,
        answer: this.questions[i]?.label
      })
      this.selected = val.filter(r => r === i)
    },
    handleConfirmation () {
      this.trackAction('Weekly focus modal: confirm answer', {
        answerId: this.selected[0],
        answer: this.questions[this.selected[0]]?.label
      })
      this.$emit('confirm', !!(this.selected.length && this.selected[0] === 2))
    }
  },
  computed: {
    ...mapGetters('trainingPlan', {
      trainingPlanFocus: 'focus'
    }),
    focusTechnicesArray () {
      if (!this.trainingPlanFocus) return
      return this.trainingPlanFocus ? this.trainingPlanFocus.map(el => ({
        category: el.category,
        label: `${camelCase(el.category.toUpperCase(), { pascalCase: true })} - ${el.technique.split(' ').map(e => {
          return camelCase(e, { pascalCase: true })
        }).join(' ')}`
      })) : []
    }
  }
}
</script>

<style lang="scss" scoped>
.tracking-modal-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 40px;
  overflow-y: auto;

  @media (max-width: $breakpoint-xs-max) {
    text-align: left;
    padding: 20px;
  }
}
</style>
