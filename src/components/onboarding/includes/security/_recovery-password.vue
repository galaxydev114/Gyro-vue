<template>
  <div class="recovery text-center">
    <div class="q-mb-xl">
      <div class="text-h1">
        <span class="text-pink">Password</span> Recovery
      </div>
      <div class="text-h4 text-weight-regular q-mt-sm">
        We will be sending instructions to your email.
      </div>
    </div>
    <q-form ref="form" @submit.prevent="">
      <q-input v-model="form.email"
               type="email"
               lazy-rules
               :rules="[val => !!val || 'Field is required', val => validateEmail(val) || 'Invalid email address']"
               outlined
               placeholder="Enter your email"
               class="q-mb-sm">
        <template v-slot:prepend>
          <c-icon icon="lock" />
        </template>
      </q-input>
      <q-btn class="full-width"
             unelevated
             type="submit"
             @click="onSubmit"
             color="dark-pink">
        Send request
      </q-btn>
    </q-form>
    <div class="text-center q-my-xl">
      <c-text-divider>
        Or go back to
      </c-text-divider>
    </div>
    <div class="q-mb-xl">
      <div class="row q-col-gutter-lg">
        <div class="col-6">
          <c-btn outline
                 class="full-width"
                 @click="$emit('changeState', 'sign-in')"
                 color="light-pink">
            Sign in
          </c-btn>
        </div>
        <div class="col-6">
          <c-btn outline
                 class="full-width"
                 @click="$emit('changeState', null)"
                 color="light-pink">
            Sign up
          </c-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validateEmail } from '@/util/validateEmail'

export default {
  data () {
    return {
      form: {
        referrer: window.location.origin + '/login'
      }
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
.recovery{
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  @media (max-width: $breakpoint-xs-max) {
    text-align: left;
    padding-right: 15px;
    margin-right: -15px;
    background: transparent;
    overflow-y: auto;
    min-height: 100%;
    .text-h1{
      font-size: 2.5rem;
    }
  }
}
</style>
