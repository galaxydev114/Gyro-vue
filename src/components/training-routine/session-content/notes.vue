<template>
  <section class="content q-mt-md">
    <n-note-item
      v-for="note of notes"
      :key="note"
      :note="note"
    />
  </section>
</template>

<script>
import NoteItem from './notes-item'

export default {
  name: 'session-content-note',
  components: {
    'n-note-item': NoteItem
  },

  props: {
    notes: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  color: $gray;
  /deep/ .q-card {
    p {
      font-size: 20px;
      &:last-child{
        padding-bottom: 0;
        margin-bottom: 0;
      }
    }
  }
}
</style>
