<template>
  <n-modal :visible="visible" @close="$emit('close')">
    <div class="modal-congrats text-center">
      <div class="text-center congrats-all-header">
        <c-icon icon="done" width="160px" />
        <div class="text-dark-pink font-rift text-h5 text-weight-bold text-uppercase" style="margin-top: -40px">
          routine finished!
        </div>
      </div>
      <div class="text-h3 font-roboto q-mt-lg" style="text-transform: unset">
        Congratulations for finishing<br>
        <span class="text-pink">
          {{ routine.title }}
        </span>
      </div>
      <!-- <div class="q-mt-md text-h5 text-weight-regular" v-if="false">
        You have <span class="text-green">earned 2h</span> for your rank<br/>
        progression
      </div> -->

      <div class="q-pb-xl q-pt-lg q-mt-lg border-top" >
        <div class="text-h5 text-gray text-center q-mb-md">
          How was the activity level for you?
        </div>
        <div class="q-gutter-sm">
          <q-radio class="like-button-select text-uppercase font-rift" v-model="difficulty" val="easy" label="Easy" />
          <q-radio class="like-button-select text-uppercase font-rift" v-model="difficulty" val="just_right" label="Just right" />
          <q-radio class="like-button-select text-uppercase font-rift" v-model="difficulty" val="hard" label="Hard"/>
        </div>
      </div>

      <div class="d-flex items-center justify-between">
        <c-btn
          class="full-width"
          :bold="false"
          :disabled="!difficulty"
          @click="goNext"
        >
          {{ctaTitle}}
        </c-btn>
      </div>
    </div>
  </n-modal>
</template>

<script>
import { sendSegmentEvent } from '@/services/segment'

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    routine: {
      type: Object,
      default: () => {}
    },
    ctaTitle: {
      type: String,
      default: 'Go to training plan'
    }
  },
  data () {
    return {
      difficulty: null
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  methods: {
    trackAction (event, opts = {}) {
      sendSegmentEvent(event, opts)
    },
    goNext () {
      this.$emit('post-completion-redirect')
      const prefix = this.$route.path.includes('discovery/') ? 'CD' : 'Routine'
      this.trackAction(`${prefix}: Finish Routine Modal`, {
        userRoutineObject: this.routine,
        difficulty: this.difficulty
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-congrats{
  padding: 30px;

  .like-button-select{
    padding: 10px 10px;
    width: 100px;
    text-align: center;
    justify-content: center;
  }
  .border-top{
    border-top: 1px solid $soft-tone;
  }
}

.congrats-all-header{
  background: url("./../../../assets/onboarding/completing-bg.png") center no-repeat;
  background-size: 100%;
}
</style>
