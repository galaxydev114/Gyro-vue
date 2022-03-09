<template>
  <q-layout class="not-found">
    <div class="not-found__container">
      <q-img src="@/assets/404-bg.svg" width="100%" class="code-anim"/>
      <q-img src="@/assets/404-bg-player.svg" width="90%" class="player-anim"/>
      <div class="text-h2 text-weight-bold text-center">
        you landed in an unknowN territory!
      </div>
      <div class="text-h5 text-weight-regular text-center q-mt-sm q-mb-xl">
        This page doesn't exist. Go back and try again.
      </div>
      <div class="text-center">
        <c-btn class="inline-block" @click="goBack">
          Go back
        </c-btn>
      </div>
      <div class="q-mt-xl">
        <n-social :showTitle="false" />
      </div>
    </div>
  </q-layout>
</template>

<script>
export default {
  components: {
    'n-social': () => import('@/components/onboarding/social')
  },
  methods: {
    goBack () {
      window.location.href = 'https://novos.gg'
    }
  }
}
</script>

<style lang="scss">
.not-found{
  width: 100%;
  height: var(--app-height);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: var(--app-bg);
  background-size: cover;
  background-attachment: fixed;
  &__container{
    position: relative;
    width: 700px;
    max-width: 80%;
    margin: auto 0;
    .player-anim{
      position: absolute;
      top: -8%;
      left: 5%;
      animation: anim 8s linear infinite;
    }
    .social-list ul{
      padding-left: 20px;
      justify-content: center;
    }
  }
}

@keyframes anim {
  from { transform: rotate(0deg) translateX(10px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
}
</style>
