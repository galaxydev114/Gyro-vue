<template>
  <div class="new-user-start">
    <div class="new-user-start__bubble animation-1"
         :class="{'animation-1--ready': ready1}"></div>
    <div class="overflow-hidden full-width">
      <div class="animation-2 text-h1 text-left"
           :class="{'animation-2--ready': ready2}">
        Let’s get started!
      </div>
      <div class="animation-3"
           :class="{'animation-3--ready': ready3}">
        <div class="text-h5 text-weight-bold font-roboto text-left text-gray q-my-lg">
          Your training board is ready and<br/>
          waiting for you to start your<br/>
          first activity!
        </div>
        <div class="row no-wrap items-center q-my-lg">
          <div class="text-h4 text-pink q-pl-md">
            Select one of your<br/>
            today's activities
          </div>
        </div>
        <div class="text-subtitle1 opacity-5 text-weight-normal">
          Your progress will be displayed once you have your first activity completed
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ready1: false,
      ready2: false,
      ready3: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.ready1 = true
    }, 300)
    setTimeout(() => {
      this.ready2 = true
    }, 600)
    setTimeout(() => {
      this.ready3 = true
    }, 500)
  }
}
</script>

<style lang="scss">
.new-user-start{
  height: 388px;
  position: relative;
  &__bubble{
    width: 200px;
    height: 200px;
    border-radius: 100%;
    background: linear-gradient(151.32deg, #D92779 17.68%, #7C277E 86.39%);
    position: absolute;
    top: -40px;
    right: 0;
    z-index: -1;
  }
  .animation-1{
    transform: scale(0);
    transition: all .3s ease-in-out;
    &--ready{
      transform: scale(1);
    }
  }
  .animation-2{
    transform: translateX(-100%);
    transition: all .3s ease-in-out;
    &--ready{
      transform: translateX(0);
    }
  }
  .animation-3{
    opacity: 0;
    transition: all .3s ease-in-out;
    &--ready{
      opacity: 1;
    }
  }
}
</style>
