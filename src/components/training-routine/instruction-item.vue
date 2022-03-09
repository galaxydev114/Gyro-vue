<template>
  <q-card bordered class="q-mt-md">
    <q-card-section>
      <div class="flex no-wrap">
        <div class="q-pr-md">
          <n-step>{{step}}</n-step>
        </div>
        <div>
          <p class="text-weight-bold">{{title}}</p>
          <p v-if="description" v-html="description"/>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  components: {
    'n-step': () => import('@/components/common/step')
  },

  props: {
    step: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  }
}
</script>

<style>
</style>
