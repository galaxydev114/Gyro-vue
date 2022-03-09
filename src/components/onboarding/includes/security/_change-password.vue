<template>
  <div class="column text-center">
    <div class="col q-mb-xl">
      <div class="text-h1">
        Set <span class="text-pink">new password</span>
      </div>
    </div>
    <q-form class="col q-px-lg" ref="form" @submit.prevent="">
      <div class="row">
        <div class="col-6 q-pr-sm">
          <q-input v-model="form.password"
                   lazy-rules
                   :rules="[val => !!val || 'Field is required']"
                   outlined
                   placeholder="Enter new password"
                   type="password"
                   class="q-mb-sm">
            <template v-slot:prepend>
              <c-icon icon="lock" />
            </template>
          </q-input>
        </div>
        <div class="col-6 q-pl-sm">
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
        Confirm
      </q-btn>
    </q-form>
  </div>
</template>

<script>
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
    validatePassword (pass) {
      return this.form.password === pass
    }
  }
}
</script>
