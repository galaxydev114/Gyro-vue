<template>
  <q-card bordered class="q-mt-md">
    <q-card-section style="display: flex;">
      <div class="flex no-wrap container">
        <div class="q-pr-md container__icon">
          <c-icon icon="notes" width="48px" />
        </div>
        <div>
          <p v-html="note"></p>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'note-item',
  props: {
    note: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.container {
  box-sizing: border-box;
}
.container__icon {
  flex: 1 0 calc(48px + 16px);
}
</style>
