<template>
<section>
  <div class="notes-widget__single-header q-pb-md q-mb-lg">
    <div class="q-mr-md cursor-clickable" @click="exitNote" v-if="$q.screen.lt.md">
      <c-icon icon="leftArrowRounded" class="float-left"/>
    </div>
    <div class="text-gray">
      {{note.createdAt | date}}
    </div>
    <div class="q-ml-auto q-mr-md cursor-clickable" @click="remove">
      <c-icon icon="trash" class="float-left" />
    </div>
  </div>

  <n-editor class="notes-widget__single-content"
    :isFloatingToolbar="$q.screen.gt.xs"
    :title="note.title"
    :content="note.description"
    @titleInput="updateTitle"
    @change="updateDescription"
  />
</section>
</template>

<script>
import dayJs from 'dayjs'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'n-editor': () => import('@/components/notes/editor')
  },

  data: () => ({
    note: {},
    newTitle: '',
    newDescription: '',
    wasNoteEdited: false
  }),

  filters: {
    date: v => dayJs(v).format('MMMM DD, YYYY')
  },

  created () {
    this.loadNoteFromTheStore(this.$route.params.noteId)
  },

  computed: {
    ...mapState({
      notes: state => state.notes.notes || {}
    })
  },

  methods: {
    ...mapActions({
      updateNote: 'notes/updateNote',
      deleteNote: 'notes/deleteNote'
    }),

    loadNoteFromTheStore (id) {
      this.note = Object.assign({}, this.notes[id]) || {}
    },

    save () {
      if (!this.wasNoteEdited) {
        this.trackAction('Notepad: Dekstop-sidebar: Edit note')
        this.wasNoteEdited = true
      }
      this.updateNote({
        ...this.note,
        title: this.newTitle || this.note.title,
        description: this.newDescription || this.note.description
      })
      this.$emit('refresh')
    },

    remove () {
      this.trackAction('Notepad: Dekstop-sidebar: Delete note')
      this.deleteNote(this.note.id)
      this.$emit('refresh')
      this.$router.push('/notes')
    },

    updateTitle (event) {
      this.newTitle = event
      // Workaround to not show previous title on focus lost
      this.note.title = event
      this.save()
    },

    updateDescription (event) {
      this.newDescription = event
      this.save()
    },

    exitNote () {
      this.$router.push({ name: 'Notes' })
    }
  }
}
</script>
<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.notes-widget {
  &__single {
    padding: 20px;
    width: 100%;
    height: 100%;
    transform: translateX(100%);
    position: absolute;
    &--active{
      transform: translateX(0);
      position: relative;
    }

    &-header {
      display: flex;
      align-items: center;
      border-bottom: 2px solid $soft-tone;
    }

    &-content {
      width: 100%;
      overflow-y: auto;
      white-space: pre-wrap;
      text-align: left;
      font-size: 20px;
      line-height: 28px;
      max-width: initial;
    }
  }
}
</style>
