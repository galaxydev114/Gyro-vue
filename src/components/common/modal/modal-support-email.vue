<template>
  <n-modal
    size="lg"
    showClose
    :visible="visible"
    v-if="visible"
    @close="$emit('close')"
  >
    <div class="support-email-modal">
      <div class="text-h2 q-mb-md">Send email</div>
      <q-form ref="form" @submit.prevent="">
        <q-input
          v-model="form.name"
          lazy-rules="ondemand"
          :rules="[(val) => !!val || 'Field is required']"
          outlined
          placeholder="Name"
          type="text"
          class="q-mb-sm"
        >
        </q-input>

        <q-input
          v-model="form.email"
          lazy-rules="ondemand"
          :rules="[
            (val) => !!val || 'Field is required',
            (val) => validateEmail(val) || 'Invalid email address',
          ]"
          outlined
          placeholder="Email"
          type="email"
          class="q-mb-sm"
        >
        </q-input>

        <q-input
          v-model="form.description"
          lazy-rules="ondemand"
          :rules="[
            (val) => !!val || 'Field is required',
          ]"
          input-style="resize:none"
          outlined
          placeholder="Description"
          type="textarea"
          class="q-mb-sm"
        >
        </q-input>

        <c-btn
          class="full-width"
          unelevated
          type="submit"
          @click="onSubmit"
          color="dark-pink"
        >
          Send
        </c-btn>
      </q-form>
    </div>
    <page-loader v-if="showPageLoader" />
  </n-modal>
</template>

<script>
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
    },
    defaultEmail: {
      type: String,
      default: ''
    },
    defaultName: {
      type: String,
      default: ''
    },
    showPageLoader: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      form: {
        email: this.defaultEmail,
        name: this.defaultName
      }
    }
  },

  methods: {
    async onSubmit () {
      const isFormValid = await this.$refs.form.validate()
      if (!isFormValid) {
        return
      }

      this.$emit('submit', this.form)
    },

    clearDescription () {
      this.form.description = ''
    },

    validateEmail
  }
}
</script>

<style lang="scss" scoped>
.support-email-modal{
  max-width: 600px;
  width: 100%;
  padding: 40px 60px 40px 60px;

  @media (max-width: $breakpoint-xs-max) {
    padding: 20px 20px 20px 20px;
  }
}
</style>
