<template>
  <div class="modals" @click.self="$emit('close')">
    <div class="modals__dialog">

      <div class="mb-10 d-flex">
        <h3 style="color:black">{{title}}</h3>
        <c-icon
          class="ml-auto modals__close"
          icon="times"
          @click="$emit('close')"
        />
      </div>
      <q-form
        class="form"
        ref="accessCodeForm"
      >
      <div class="form__item">
        <div class="form__item">
          <q-input
            ref="formCode"
            clearable
            label="Unique Code"
            :rules="[value => Boolean(value) || 'Unique Code required']"
            v-model="code"
          />
        </div>
        <div class="form__item">
          <q-input
            ref="formRole"
            clearable
            label="Role"
            v-model="role"
          />
        </div>
      </div>

      <p style="padding-top:20px">
        {{computedUrl}}
      </p>
      <c-btn
        class="mt-15 w-100 py-10"
        variant="simple"
        tag="button"
        type="button"
        @click="submit"
      >
        {{currentId ? 'Update' : 'Create'}}
      </c-btn>
    </q-form>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    currentId: {
      type: String
    },
    currentCode: {
      type: String,
      required: true
    },
    currentRole: {
      type: String,
      default: 'CBT'
    }
  },

  data: () => ({
    code: '',
    role: ''
  }),
  mounted () {
    this.code = this.currentCode
    this.role = this.currentRole
  },
  computed: {
    computedUrl () {
      return process.env.VUE_APP_PAGE_URL + `/onboarding/?accessCode=${this.currentCode}`
    }
  },

  methods: {
    submit () {
      this.checkIsFormValid().then(isSuccess => {
        if (isSuccess) {
          this.$emit('submit', { id: this.currentId, code: this.code, role: this.role })
        }
      })
    },
    checkIsFormValid () {
      return this.$refs.accessCodeForm.validate()
    }
  }
}
</script>

<style lang="scss" scoped>
  .modals {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .7);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 99;

    &__close {
      cursor: pointer;
    }

    &__dialog{
      width: 1200px;
      max-width: 80%;
      padding: 20px;
      border-radius: 10px;
      background: rgba(116, 124, 152, .7);
      box-shadow: 0 0 10px #000;
    }
  }

  .grid {
    height: '600px';
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;

    &__column {
      display: grid;
      grid-template-rows: 1fr 60px;
    }
  }
</style>
