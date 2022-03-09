<template>
  <c-icon
    icon="question"
    class="q-ml-sm"
    @mouseenter="showing=true"
    @mouseleave="showing=false"
    @click="showing=!showing"
    v-outside-click="() => {showing = false}"
  >
    <q-tooltip
      :anchor="anchor"
      :self="self"
      v-model="showing"
      max-width="240px"
      content-style="background-color: #382B4B; font-size: 14px"
      :offset="[10, 10]"
    >
      <slot></slot>
    </q-tooltip>
  </c-icon>
</template>

<script>
export default {
  props: {
    anchor: {
      type: String,
      default: () => 'top middle'
    },
    self: {
      type: String,
      default: () => 'bottom middle'
    }
  },
  data: () => ({
    showing: false
  }),
  methods: {
    show () {
      this.showing = true
    }
  }
}
</script>
