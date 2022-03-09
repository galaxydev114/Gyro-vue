<template>
  <div class="create-account">
    <div class="q-mb-lg q-mb-sm-xl">
      <div class="text-h1">
        <span class="text-pink">Create</span> Your Account
      </div>
    </div>
    <q-form ref="form" @submit.prevent="">
      <q-input v-model="form.email"
               lazy-rules
               :rules="[val => !!val || 'Field is required', val => validateEmail(val) || 'Invalid email address']"
               outlined
               placeholder="Enter your email"
               type="email"
               class="q-mb-sm">
        <template v-slot:prepend>
          <c-icon icon="email" />
        </template>
      </q-input>
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md-sm">
          <q-input v-model="form.password"
                   lazy-rules
                   :rules="[val => !!val || 'Field is required']"
                   outlined
                   placeholder="Create password"
                   type="password"
                   class="q-mb-sm">
            <template v-slot:prepend>
              <c-icon icon="lock" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6 q-pl-md-sm">
          <q-input v-model="form.passwordRepeat"
                   lazy-rules
                   :rules="[val => !!val || 'Field is required', val => validatePassword(val) || 'Password doesn\'t match']"
                   outlined
                   placeholder="Repeat password"
                   type="password"
                   class="q-mb-sm">
            <template v-slot:prepend>
              <c-icon icon="lock" />
            </template>
          </q-input>
        </div>
      </div>
      <q-btn class="full-width"
             unelevated
             type="submit"
             @click="onSubmit"
             color="dark-pink">
        Let's get started!
      </q-btn>
    </q-form>
    <div class="text-center q-my-lg q-my-sm-xl">
      <c-text-divider>
        Or sign up with
      </c-text-divider>
    </div>
    <div class="q-mb-xl">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <c-btn outline
                 class="full-width"
                 @click="$emit('discord')"
                 color="light-pink">
            <q-img src="@/assets/onboarding/discord-icon.svg" height="18px" width="18px" class="q-mr-sm" />
            <span class="font-roboto text-subtitle1">Discord</span>
          </c-btn>
        </div>
        <div class="col-12 col-sm-6">
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
    <div class="text-center text-h5">
      Already have an account?
      <q-btn flat
             dense
             padding="0"
             color="dark-pink"
             @click="$emit('changeState', 'sign-in')"
             class="q-btn--no-hover text-h5 text-capitalize q-ml-sm">
        Sign in here
      </q-btn>
    </div>
  </div>
</template>

<script>
import { validateEmail } from '@/util/validateEmail'

export default {
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
    validateEmail,
    validatePassword (pass) {
      return this.form.password === pass
    }
  }
}
</script>

<style lang="scss" scoped>
.create-account{
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
  }
}
</style>
