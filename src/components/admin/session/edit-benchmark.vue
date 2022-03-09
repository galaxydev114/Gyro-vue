<template>
  <div class="form__item group">
    <h4>Benchmarks</h4>

    <q-input
      clearable
      label="Subtitle"
      v-model="value.subtitle"
    />

    <q-input
      clearable
      label="Bronze"
      v-model="value.bronze"
    />

    <q-input
      clearable
      label="Silver"
      v-model="value.silver"
    />

    <q-input
      clearable
      label="Gold"
      v-model="value.gold"
    />

    <q-input
      clearable
      label="Platinum"
      v-model="value.platinum"
    />

    <q-input
      clearable
      label="Diamond"
      v-model="value.diamond"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },

  data: () => ({

  }),

  methods: {
  }

}
</script>

<style lang="scss" scoped>

</style>
