<template>
  <n-modal noPadding :visible="visible" size="custom" @close="$emit('close')">
    <div class="modal-signup">
      <img v-if="!$q.platform.is.mobile" class="logo logo__modal-signup" src="@/assets/trainingPlan/logo-sm.svg" width="50" />

      <div class="modal-signup__left text-left">
        <div class="modal-signup__img">
          <img src="@/assets/payments/modal-upgrade-bg.png" />
        </div>
      </div>

      <div class="modal-signup__right text-center">
        <div class="text-h2">
          Create Your Account
        </div>

        <p style="font-size: 20px;" class="text-gray">To Get Full Access</p>

        <ul class="feature-list text-gray q-mt-lg q-mt-md-xl">
          <li>
            <c-icon icon="purpleCheck" width="14px" class="q-mr-xs" />
            Pro-players competitive reviews
          </li>
          <li>
            <c-icon icon="purpleCheck" width="14px" class="q-mr-xs" />
            Unlimited training plans
          </li>
          <li v-if="benefitAfterUpgrade">
            <c-icon icon="purpleCheck" width="14px" class="q-mr-xs" />
            {{benefitAfterUpgrade}}
          </li>
          <li>
            <c-icon icon="purpleCheck" width="14px" class="q-mr-xs" />
            Exclusive training routines
          </li>
        </ul>
        <div class="modal-signup__action">
          <c-btn @click="$emit('sign-up')">
            Start training now
          </c-btn>
          <c-btn
            flat
            noHover
            text-color="dark-pink"
            @click="$emit('close')"
          >
            Not now
          </c-btn>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>
import { mapState } from 'vuex'

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

  computed: {
    ...mapState({
      benefitAfterUpgrade: state => state.fortniteSeason.benefitAfterUpgrade
    })
  }
}
</script>

<style lang="scss" scoped>
.q-dialog__inner--minimized > div {
  max-width: initial;
}

.modal-signup{
  display: flex;
  flex-direction: row;
  align-items: stretch;
  border-radius: 6px;
  overflow: visible;
  height: 555px;
  &__img{
    position: absolute;
    left: -15%;
    bottom: 0;
    img{
      float: left;
    }
  }
  &__left{
    padding: 20px;
    width: 270px;
    background: linear-gradient(135deg, rgba(217,39,121,1) 0%, rgba(124,39,126,1) 100%);
    position: relative;
    z-index: 1;
  }
  &__right{
    padding: 60px 80px;
    width: calc( 100% - 265px);
    position: relative;
    z-index: 2;
    .text-h1{
      font-size: 72px;
    }
    ul{
      display: flex;
      flex-direction: column;
      text-align: left;
      padding: 0;
      li{
        list-style: none;
        padding: 2px 0;
        font-size: 16px;
        color: light/soft gray;
      }
    }
  }
  &__badge{
    background: rgba(217,39,121,1);
    padding: 8px 12px;
    border-radius: 4px;
    color: #fff;
    text-transform: uppercase;
    font-size: 12px;
    margin: 0 auto 24px;
    width: 220px;
    &-trial {
      background: $yellow;
      color: black;
      font-weight: 500;
      width: 246px;
    }
  }
  &__action{
    width: 200px;
    margin: 70px auto 0;
  }
}

.logo__modal-signup {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
}

.title {
  font-size: 57px;
  font-family: 'Bebas Neue';
  line-height: 120%;
  margin-top: 60px;
}
.title-mobile {
  display: none;
}
.title-desktop {
  display: block;
}

@media screen and (max-width: $breakpoint-sm-max) {
  .n-modal {
    top: initial !important;
    left: initial !important;
    right: initial !important;
    bottom: initial !important;
    width: fit-content !important;
    margin: 10px;
  }

  .title {
    font-size: 2.25em;
    margin-top: 0;
  }
  .title-mobile {
    display: block;
  }
  .title-desktop {
    display: none;
  }

  .modal-signup {
    flex-direction: column;
    overflow: initial;
    position: relative;
    height: 90vh;
    max-height: 560px;
  }

  .modal-signup__left {
    position: relative;
    z-index: 1;
    border-radius: 12px 12px 0 0;
    width: initial;
    padding: initial;
    height: 80px;
    display: table;
    flex-shrink: 0;
  }

  .logo__modal-signup {
    top: 55px;
    left:0;
    right:0;
    margin:0 auto;
    position: absolute;
    z-index: 4;
  }

  .modal-signup__img {
    position: absolute;
    top: -60px;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: initial;

    img {
      display: none;
      position: absolute;
      left: -6%;
      z-index: 3;
      width: 400px;
    }
  }

  .modal-signup__right {
    height: 100%;
    position: relative;
    z-index: 2;
    border-radius: 12px 12px 0 0;
    padding: 2.75em;
    width: 100%;
    background-color: $dark;
  }
  .modal-signup__right ul {
    padding: 0;
  }
  .modal-signup__action {
    width: 200px;
    margin: initial;
    margin: 20px auto 0;
    text-align: center;
  }
  .modal-signup__badge {
    margin-bottom: 1em;
  }
}

@media screen and (max-width: 320px) {
  .modal-signup {
    font-size: 10px;
  }
}
</style>
