<template>
  <q-dialog :value="isVisible" @input="close">
    <q-card class="card" :style="{ backgroundColor: backgroundColor }">
      <q-card-section class="row items-center">
        <q-space />
        <c-icon
          icon="closeCircle"
          role="button"
          tabindex="0"
          @click="close" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-html="content"/>
      </q-card-section>

      <q-card-actions align="right">
        <c-btn @click="close">
          {{ctaName}}
        </c-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'modal-platform-news',

  props: {
    content: {
      type: String
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: 'dark-pink'
    },
    ctaName: {
      type: String,
      default: 'Close'
    }
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  min-width: 200px;
  width: fit-content;
  color: #fff;
  background: #424242;
  background: var(--q-color-dark);
}
</style>
