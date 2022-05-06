<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    @close="$emit('close')">
    <div class="modal-intro-details">
      <div class="q-py-md q-px-lg-lg q-px-sm-md">
        <div class="text-white font-rift" :class="{'text-h2': !$q.screen.lt.sm, 'text-h3': $q.screen.lt.sm}">
          New Friends Groups Feature
        </div>
      </div>
      <div class="intro-body">
        <intro-step1 v-if="step==1"/>
        <intro-step2 v-if="step==2"/>
        <intro-step3 v-if="step==3"/>
        <intro-step4 v-if="step==4"/>
        <intro-step5 v-if="step==5"/>
        <intro-step6 v-if="step==6"/>
      </div>
      <div class="intro-footer q-py-md q-px-lg-lg q-px-sm-md">
        <div class="row items-center">
          <div class="col-5">
            <c-btn outline
              class="btn-join-fg"
              color="light-pink"
              :bold="false"
              :widthAuto="true"
              :disabled="step==1"
              @click="goPrevious"
            >
              <span :class="{ 'q-mx-sm': step==6 }">Go Back</span>
            </c-btn>
          </div>
          <div class="col-2 text-center">
            <span class="text-h3 text-weight-bold font-rift text">{{step}} / 6</span>
          </div>
          <div class="col-5 text-right">
            <q-btn unelevated
              class="btn-join-fg"
              :class="{'q-px-sm': step !=6 }"
              color="dark-pink"
              @click="goNext"
            >
              <span class="lt-md" :class="{'intro-next': step == 6 && !linkedDS}">{{ step == 6 ? linkedDS ? 'Let\'s Start' : 'Link your ds' : 'Next' }}</span>
              <div class="gt-sm items-center d-flex">
                <c-icon v-if="step == 6 && !linkedDS" class="q-mr-sm" :icon="'discordWhite'" :width="'20px'" />
                {{ step == 6 ? linkedDS ? 'Let\'s Start' : ' Start by linking your Discord account' : 'Next' }}
              </div>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    linkedDS: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      step: 1
    }
  },
  methods: {
    goNext () {
      if (this.step === 6) {
        this.$emit('finished')
      } else {
        this.step++
      }
    },
    goPrevious () {
      this.step--
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal'),
    'intro-step1': () => import('@/components/friend-group/includes/introduction/_intro-step1'),
    'intro-step2': () => import('@/components/friend-group/includes/introduction/_intro-step2'),
    'intro-step3': () => import('@/components/friend-group/includes/introduction/_intro-step3'),
    'intro-step4': () => import('@/components/friend-group/includes/introduction/_intro-step4'),
    'intro-step5': () => import('@/components/friend-group/includes/introduction/_intro-step5'),
    'intro-step6': () => import('@/components/friend-group/includes/introduction/_intro-step6')
  }
}
</script>

<style lang="scss">
  .modal-intro-details {
    width: 85vw;
    max-width: 940px;
    .intro-body {
      height: 490px;
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
      .intro-body {
        margin-left: -10px;
        margin-right: -10px;
      }
      .intro-footer {
        .intro-next {
          margin-left: -10px;
          margin-right: -10px;
        }
      }
    }
    @media screen and (min-width: $breakpoint-xs-max) and (max-width: $breakpoint-sm-max) {
      width: 100%;
    }
  }
</style>
