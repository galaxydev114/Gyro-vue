<template>
  <div class="pref-step q-ml-sm q-pa-sm row full-width items-center">
    <div class="col">
      <div class="row items-center">
        <div class="col">
        </div>
        <div class="d-flex">
          <img
          :src="scoreIcon"
          :width="32"
          :height="32"/>
        </div>
        <div class="col col-pink-hr d-flex items-center">
          <div class="pink-hr" :class="{'pink-hr--animated1': firstInit}"></div>
        </div>
      </div>
      <div class="column justify-center items-center">
        <span class="step-title">
          Skill Score
        </span>
        <span class="step-desc text-center gt-xs">
          Calculating your Fortnite <br>Skill Score
        </span>
      </div>
    </div>
    <div class="col">
      <div class="row items-center">
        <div class="col col-pink-hr d-flex items-center">
          <div class="pink-hr" :class="{'pink-hr--animated2': firstInit}"></div>
        </div>
        <div class="d-flex">
          <img class="prefIcon" :class="{'prefIcon--ready': prefReady}"/>
        </div>
        <div class="col col-pink-hr d-flex items-center">
          <div class="pink-hr" :class="{'pink-hr--animated3': firstInit}"></div>
        </div>
      </div>
      <div class="column justify-center items-center">
        <span class="step-title">
          Preferences
        </span>
        <span class="step-desc text-center gt-xs">
          On this step you tell <br>about yourself.
        </span>
      </div>
    </div>
    <div class="col">
      <div class="row items-center">
        <div class="col col-pink-hr d-flex items-center">
          <div class="pink-hr" :class="{'pink-hr--animated4': firstInit}"></div>
        </div>
        <div class="d-flex">
          <img class="waitingIcon" :class="{'waitingIcon--ready': waitingReady}"/>
        </div>
        <div class="col">
          <hr class="gray-hr">
        </div>
      </div>
      <div class="column justify-center items-center">
        <span class="step-title">
          Waiting
        </span>
        <span class="step-desc text-center gt-xs">
          Just wait for your <br>perfect Friends group.
        </span>
      </div>
    </div>
    <div class="col">
      <div class="row items-center">
        <div class="col">
          <hr class="gray-hr">
        </div>
        <div class="d-flex">
          <img
          :src="enjoyIcon"
          :width="32"
          :height="32"/>
        </div>
        <div class="col">
        </div>
      </div>
      <div class="column justify-center items-center">
        <span class="step-title">
          Enjoy!
        </span>
        <span class="step-desc text-center gt-xs">
          On this step have <br>fun with Novos!
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import scoreIcon from '@/assets/friend-group/steps/skill-score.svg'
import enjoyIcon from '@/assets/friend-group/steps/enjoy.svg'

export default {
  props: {
    animated: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      scoreIcon,
      enjoyIcon,
      firstInit: false,
      prefReady: false,
      waitingReady: false,
      waitLoading: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.firstInit = true
    }, 200)
    setTimeout(() => {
      this.prefReady = true
    }, 2200)
    setTimeout(() => {
      this.waitingReady = true
    }, 4700)
  }
}
</script>

<style lang="scss">
  @keyframes waitLoading {
    0% {
      box-shadow: 0 0 0 8px #c8446155;
    }
    50% {
      box-shadow: 0 0 0 0px #c8446155;
    }
    100% {
      box-shadow: 0 0 0 8px #c8446155;
    }
  }
  .pref-step {
    background: url('../../../../assets/friend-group/steps/mask-bg.png'), #1F163A;
    background-repeat: none repeat;
    border-radius: 18px;
    min-height: 220px;
    span {
      user-select: none; /* standard syntax */
      -webkit-user-select: none; /* webkit (safari, chrome) browsers */
      -moz-user-select: none; /* mozilla browsers */
      -khtml-user-select: none; /* webkit (konqueror) browsers */
      -ms-user-select: none; /* IE10+ */
    }
    .col-pink-hr {
      background: #DFDAE777;
    }
    .prefIcon {
      content: url('../../../../assets/friend-group/steps/preference-ready.svg');
      width: 28px;
      height: 28px;
      &--ready {
        content: url('../../../../assets/friend-group/steps/preference.svg');
        width: 32px;
        height: 32px;
      }
    }
    .waitingIcon {
      content: url('../../../../assets/friend-group/steps/waiting-ready.svg');
      width: 28px;
      height: 28px;
      &--ready {
        content: url('../../../../assets/friend-group/steps/waiting.svg');
        width: 32px;
        height: 32px;
        border-radius: 100%;
        animation-timing-function: ease-in-out;
        animation-duration: 1s;
        animation-name: waitLoading;
        animation-iteration-count: infinite;
        animation-delay: 1s;
      }
    }
    .pink-hr {
      border: 0;
      border-top: 3px solid $gray;
      display: inline-block;
      width: 0;
      &--animated1 {
        width: 100%;
        border-top: 3px solid $dark-pink;
        transition: width 1s linear;
      }
      &--animated2 {
        width: 100%;
        border-top: 3px solid $dark-pink;
        transition: width 1s linear;
        transition-delay: 1s;
      }
      &--animated3 {
        width: 100%;
        border-top: 3px solid $dark-pink;
        transition: width 1s linear;
        transition-delay: 2.5s;
      }
      &--animated4 {
        width: 100%;
        border-top: 3px solid $dark-pink;
        transition: width 1s linear;
        transition-delay: 3.5s;
      }
    }
    .gray-hr {
      border: 0;
      border-top: 3px solid $gray;
      opacity: 0.5
    }
    .step-title {
      margin-top: 12px;
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
    }
    .step-desc {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: $gray-violet;
    }
    @media all and (max-width: $breakpoint-sm-max) {
      .step-title {
        font-size: 12px;
        line-height: 16px;
        font-weight: 500;
      }
    }
  }
</style>
