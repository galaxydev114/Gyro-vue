<template>
  <div class="explainers" v-if="content">
    <div class="explainers__overlay"
         :class="{'explainers__overlay--active': showBg}"></div>
    <div class="explainers__content"
         :class="{'explainers__content--active': showContent}">
      <q-img src="./../../../assets/onboarding/info-icon.svg" height="180px" width="180px" />
      <div class="explainers__content-subtitle text-pink">
        {{ content.subtitle }}
      </div>
      <div class="explainers__content-text" v-html="content.text"></div>
      <div class="explainers__content-action">
        <q-btn label="Got It"
               unelevated
               color="dark-pink"
               class="full-width"
               @click="hide" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showBg: false,
      showContent: false,
      content: null
    }
  },
  mounted () {
    this.content = this.step.explainer
    setTimeout(() => this.check(), 500)
  },
  methods: {
    check () {
      if (this.step && this.step.explainer) {
        this.appear()
      }
    },
    appear () {
      setTimeout(() => {
        this.showBg = true
      }, 300)
      setTimeout(() => {
        this.showContent = true
      }, 600)
    },
    hide () {
      setTimeout(() => {
        this.showContent = false
      }, 300)
      setTimeout(() => {
        this.showBg = false
        this.content = null
        this.$emit('hide')
      }, 600)
    }
  }
}
</script>

<style lang="scss" scoped>
.explainers{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  /deep/ * {
    user-select: none;
  }
  @media all and (max-width: $breakpoint-sm-max) {
    position: fixed;
    z-index: 9999;
  }
  &__overlay{
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.4);;
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    transition: all .3s ease-in-out;
    &--active{
      opacity: 1;
    }
  }
  &__content{
    position: relative;
    z-index: 3;
    background: $dark;
    padding: 40px;
    border-radius: 12px;
    width: 400px;
    max-width: 80%;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    transition: all .3s ease-in-out;
    top: 100%;
    left: 50%;
    transform: translateY(0) translateX(-50%);
    &--active {
      top: 50%;
      transform: translateY(-50%) translateX(-50%);
    }
    &-subtitle{
      text-transform: uppercase;
      font-family: "rift", sans-serif !important;
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
      margin-top: -40px;
    }
    &-text{
      @media (max-width: $breakpoint-xs-max) {
        font-size: 18px;
      }
      font-size: 22px;
      line-height: 30px;
      font-weight: bold;
      margin: 20px 0;
    }
  }
}
</style>
