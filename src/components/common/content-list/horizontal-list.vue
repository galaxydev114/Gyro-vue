<template>
  <div v-if="records.length" class="horizontal-list">
    <h3 v-if="title">{{title}}</h3>

    <div class="horizontal-list__list">
      <div
        class="horizontal-list__item"
        v-for="record of records"
        :key="record.id"
      >
        <slot v-bind:record="record" v-if="record"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    records: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.horizontal-list {
  width: 100%;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0px;
    bottom: 10px;
    width: 50px;
    background: linear-gradient(270deg, $dark 0%, rgba(124, 39, 126, 0) 100%);
  }
}

.horizontal-list__list {
  width: 100%;
  overflow-y: auto;
  white-space: nowrap;
  display: flex;
  align-items: stretch;
  padding-bottom: 10px;
}
.horizontal-list__list::-webkit-scrollbar {
  display: none;
}
.horizontal-list__list:hover::-webkit-scrollbar {
  display: initial;
}

.horizontal-list__list .horizontal-list__item {
  margin-right: 20px;
  white-space: initial;
}
.horizontal-list__item:last-child {
  margin-right: initial;
}
</style>
