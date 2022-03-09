<template>
  <div class="login">
    <div>
      <div class="col q-mb-lg q-mb-sm-xl">
        <div class="text-h1">
          <span class="text-pink">Log in</span> with your account
        </div>
        <div class="text-h4 text-weight-regular q-mt-sm">
          Welcome back!
        </div>
      </div>
      <q-form class="col" ref="form" @submit.stop.prevent="onSubmit">
        <q-input v-model="form.email"
                 lazy-rules
                 :rules="[val => !!val || 'Field is required', val => validateEmail(val) || 'Invalid email address']"
                 outlined
                 placeholder="Email"
                 type="email"
                 class="q-mb-sm">
          <template v-slot:prepend>
            <c-icon icon="email" />
          </template>
        </q-input>
        <q-input v-model="form.password"
                 lazy-rules
                 :rules="[val => !!val || 'Field is required']"
                 outlined
                 placeholder="Password"
                 type="password"
                 class="q-mb-sm">
          <template v-slot:prepend>
            <c-icon icon="lock" />
          </template>
        </q-input>
        <q-btn class="full-width"
               unelevated
               type="submit"
               color="dark-pink">
          Log in
        </q-btn>
      </q-form>
      <div class="col text-center q-my-lg q-my-sm-xl">
        <c-text-divider>
          Or sign in with
        </c-text-divider>
      </div>
      <div class="col q-mb-sm q-mb-sm-xl">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <c-btn outline
                   @click="$emit('discord')"
                   class="full-width"
                   color="light-pink">
              <q-img src="@/assets/onboarding/discord-icon.svg" height="18px" width="18px" class="q-mr-sm" />
              <span class="font-roboto text-subtitle1">Discord</span>
            </c-btn>
          </div>
          <div class="col-12">
            <c-btn outline
                 class="full-width"
                 @click="$emit('google')"
                 color="light-pink">
              <q-img src="@/assets/onboarding/google-icon.svg" height="18px" width="18px" class="q-mr-sm" />
              <span class="font-roboto text-subtitle1">Google</span>
            </c-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center text-h5 q-mt-auto q-mt-sm-none login-fixed-bottom">
      <div class="divider full-width bg-soft-tone q-my-md lt-sm" style="height: 1px"></div>
      <div class="row justify-between">
        <div class="col text-left" v-if="isNewVisible">
          <span class="visible-md">New?</span>
          <q-btn flat
                 dense
                 padding="0"
                 color="dark-pink"
                 @click="$emit('changeState', null)"
                 class="q-btn--no-hover text-h5 text-capitalize q-ml-sm">
            Sign up here
          </q-btn>
        </div>
        <div class="col text-right">
          <q-btn flat
                 dense
                 padding="0"
                 color="dark-pink"
                 @click="$emit('changeState', 'recovery')"
                 class="q-btn--no-hover text-h5 text-capitalize q-ml-sm">
            Forgot my password
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validateEmail } from '@/util/validateEmail'

export default {
  props: {
    isNewVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: {}
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate().then(async (success) => {
        if (success) {
          this.$emit('submit', this.form)
        }
      })
    },
    validateEmail
  }
}
</script>

<style lang="scss" scoped>
.login{
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  @media (max-width: $breakpoint-xs-max) {
    text-align: left;
    background: transparent;
    overflow-y: auto;
    min-height: 100%;
    padding-right: 15px;
    margin-right: -15px;
    .text-h1{
      font-size: 2.5rem;
    }
    .text-h5{
      font-size: 14px;
    }
  }
}
</style>
