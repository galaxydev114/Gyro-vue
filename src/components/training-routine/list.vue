<template>
  <div class="list">
    <div class="list__header">
      <h3 class="text-h5 font-rift text-uppercase">
        {{title}}
        <slot name="afterTitle"></slot>
      </h3>
      <span class="list__description">{{description}}</span>
    </div>

    <div class="list__content" role="list">
      <slot></slot>
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
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.list {
  --font-family: 'Roboto';
  --font-size: 1.25rem;

  display: flex;
  flex-flow: column;
  height: 100%;
}
.list__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.list__title {
  margin: 0;
  font-size: var(--font-size);
  font-family: var(--font-family);
  line-height: 120%;
  color: $gray;
}
.list__description {
  text-transform: uppercase;
  font-size: 0.75rem;
  color: $gray;
  opacity: 0.7;
  line-height: 120%;
}
.list__content {
  overflow-y: auto;
  padding: 5px 15px;
  margin: 0 -15px;
}
</style>
