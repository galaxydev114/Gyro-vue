<template>
  <n-modal
    size="lg"
    height="100%"
    maxHeight="750px"
    showClose
    :visible="visible"
    @close="$emit('close')"
  >
    <div class="create-account">
      <div class="q-mb-md q-mb-sm-lg">
        <div class="text-h2">
          Sign up to novos to complete an activity
        </div>
        <p class="text-gray" style="font-size: 20px;">
          Complete this and many others activities.
        </p>
      </div>
      <q-form ref="form" @submit.prevent="">
        <q-input
          v-model="form.email"
          lazy-rules
          :rules="[
            (val) => !!val || 'Field is required',
            (val) => validateEmail(val) || 'Invalid email address',
          ]"
          outlined
          placeholder="Enter your email"
          type="email"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <c-icon icon="email" />
          </template>
        </q-input>

        <q-input
          v-model="form.password"
          lazy-rules
          :rules="[(val) => !!val || 'Field is required']"
          outlined
          placeholder="Create password"
          type="password"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <c-icon icon="lock" />
          </template>
        </q-input>

        <q-input
          v-model="form.passwordRepeat"
          lazy-rules
          :rules="[
            (val) => !!val || 'Field is required',
            (val) => validatePassword(val) || 'Password doesn\'t match',
          ]"
          outlined
          placeholder="Repeat password"
          type="password"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <c-icon icon="lock" />
          </template>
        </q-input>

        <q-btn
          class="full-width"
          unelevated
          type="submit"
          @click="onSubmit"
          color="dark-pink"
        >
          Let's get started!
        </q-btn>
      </q-form>
      <div class="text-center q-my-md q-my-sm-lg">
        <c-text-divider> Or sign up with </c-text-divider>
      </div>
      <div class="q-mb-xl">
        <div class="row q-col-gutter-lg">
          <div class="col">
            <c-btn
              outline
              class="full-width"
              @click="signUpDiscord"
              color="light-pink"
            >
              <q-img
                src="@/assets/onboarding/discord-icon.svg"
                height="18px"
                width="18px"
                class="q-mr-sm"
              />
              <span class="font-roboto text-subtitle1">Discord</span>
            </c-btn>
          </div>
        </div>
      </div>
      <div class="text-center text-h5">
        Already have an account?
        <q-btn
          flat
          dense
          padding="0"
          color="dark-pink"
          @click="$router.push('/login')"
          class="q-btn--no-hover text-h5 text-capitalize q-ml-sm"
        >
          Sign in here
        </q-btn>
      </div>
    </div>

    <page-loader v-if="showPageLoader" />

  </n-modal>
</template>

<script>
import { mapActions } from 'vuex'
import { validateEmail } from '@/util/validateEmail'

export default {
  components: {
    'n-modal': () => import('@/components/dashboard/modal'),
    'page-loader': () => import('@/components/common/page-loader')
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      form: {},
      discordOauthUri: process.env.VUE_APP_DISCORD_OAUTH_URL,
      showPageLoader: false
    }
  },

  methods: {
    ...mapActions({
      userRegister: 'user/registerNewUser'
    }),

    async onSubmit () {
      const isFormValid = await this.$refs.form.validate()
      if (!isFormValid) {
        return
      }

      try {
        this.showPageLoader = true
        await this.userRegister(this.form)
        this.$router.replace('/onboarding')
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: err?.data || 'Something went wrong. Please try again in few minutes'
        })
      } finally {
        this.showPageLoader = false
      }
    },

    signUpDiscord () {
      location.href = this.discordOauthUri
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
  max-width: 600px;
  width: 100%;
  padding: 60px;
  overflow-y: auto;

  @media (max-width: $breakpoint-xs-max) {
    text-align: left;
    padding: 20px 50px 20px 40px;
  }
}
</style>
