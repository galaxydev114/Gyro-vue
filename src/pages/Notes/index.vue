<template>
  <article class="notes-page" slot="content">
    <section class="notes-list" :class="{'notes-list--active': !isSingleNote}">
      <h1 class="notes-list__header">My Notes</h1>

      <div class="notes-list__search-area">
        <q-input
          outlined
          class="notes-list__search"
          placeholder="Search notes"
          v-model="searchQuery"
          @input="search"
        >
          <template v-slot:prepend>
            <img src="@/assets/icons/search.svg" alt="search icon"/>
          </template>
        </q-input>

        <div class="notes-list__add-btn" @click="createNote">
          <c-icon icon="plus"/>
        </div>
      </div>

      <div class="notes-list__list">
        <div
          class="note-preview"
          :class="{ 'note-preview--active': note.id === selectedNote.id }"
          v-for="note of notes"
          :key="note.id"
          @click="selectNoteForEdit(note)"
        >
          <h5 class="note-preview__title" v-html="highlightSearchMatch(note).title"></h5>
          <small class="note-preview__date">{{note.createdAt | date}}</small>
        </div>
      </div>
    </section>

    <section class="notes-content" :class="{'notes-content--active': isSingleNote}">
      <router-view
        :key="$route.fullPath"
        @refresh="refreshNotesFromStore"
      ></router-view>
    </section>
  </article>
</template>

<script>
import dayJs from 'dayjs'
import { mapGetters, mapActions } from 'vuex'
import { debounce } from 'quasar'

export default {
  filters: {
    date: v => dayJs(v).format('MMMM DD, YYYY')
  },

  async created () {
    await this.getNotes()
    this.refreshNotesFromStore()
  },

  data: () => ({
    searchQuery: '',
    selectedNote: {},
    notes: []
  }),

  computed: {
    ...mapGetters({
      notesFromStore: 'notes/notes'
    }),
    isSingleNote () {
      return this.$route.name === 'NoteDetails'
    }
  },

  methods: {
    ...mapActions({
      getNotes: 'notes/getNotes',
      searchNotes: 'notes/searchNotes',
      createNewNote: 'notes/createNote'
    }),

    selectNoteForEdit (note) {
      this.trackAction('Notepad: Dekstop-sidebar: Open note')
      this.selectedNote = note
      this.$router.push(`/notes/${note.id}`)
    },

    search: debounce(async function (e) {
      this.trackAction('Notepad: Dekstop-sidebar: Search note')
      this.notes = await this.searchNotes({ q: e })
    }, 300),

    highlightSearchMatch (matchedNote) {
      const { matchKey, matchIndex, matchLength } = matchedNote
      if (!matchKey) return matchedNote

      const text = matchedNote[matchKey]
      const before = text.slice(0, matchIndex)
      const match = text.slice(matchIndex, matchIndex + matchLength)
      const after = text.slice(matchIndex + matchLength)

      return {
        ...matchedNote,
        [matchKey]: `${before}<span class="search-highlight">${match}</span>${after}`
      }
    },

    async createNote () {
      this.trackAction('Notepad: Dekstop-sidebar: Add note')
      const note = await this.createNewNote({
        title: 'New note',
        description: ''
      })
      this.refreshNotesFromStore()
      this.selectNoteForEdit(note)
    },

    refreshNotesFromStore () {
      this.notes = Array.from(this.notesFromStore)
    }
  }
}
</script>

<style lang="scss" scoped>
.notes-page {
  display: grid;
  grid-template-columns: minmax(300px, 500px) minmax(500px, 1fr);
  height: 100%;
  overflow: hidden;
}
.notes-list {
  padding: 40px;
  border-right: 2px solid $soft-tone;
  overflow-y: hidden;

  &__search-area {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  &__search {
    flex: 1 1 auto;
  }

  &__header {
    margin: 0;
    font-weight: 400;
    font-family: 'Bebas Neue';
  }

  &__add-btn {
    flex: 0 0 50px;
    width: 50px;
    height: 50px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $dark-pink;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
  }

  &__list {
    display: grid;
    grid-template-rows: minmax(auto, 108px);
    grid-auto-rows: minmax(auto, 108px);
    gap: 10px;
    margin-top: 20px;
    overflow-y: auto;
    padding-right: 10px;
    height: 100%;
  }
}
.note-preview {
  background-color: $dark-one;
  border-radius: 6px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.202551);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  &--active {
    border: 2px solid $dark-pink;
    background-color: $soft-tone;
  }

  &__title {
    margin: 0;
  }

  &__date {
    display: block;
    color: $gray;
    margin-top: 10px;
  }

  /deep/ .search-highlight {
    background-color: $dark-pink;
  }
}
.notes-content {
  padding: 60px 40px;
  max-height: 100vh;
}

@media (max-width: $breakpoint-sm-max) {
  h1{
    font-size: 1.5rem;
  }
  .notes-page{
    display: block;
  }
  .note-preview,
  .notes-content{
    width: 100%;
    height: 100%;
    max-height: unset;
    /deep/ .notes-widget__single-content {
      margin: 0;
    }
  }

  .notes-list,
  .notes-content{
    position: absolute;
    transform: translateX(100%);
    box-sizing: border-box;
    transition: all .3s ease-in-out;
    padding: 30px;
    &--active{
      transform: translateX(0);
      position: relative;
    }}

  .notes-list{
    height: 100%;
    width: 100%;
    &__list{
      margin-right: -10px;
    }
  }
}

@media (max-width: $breakpoint-xs-max) {
  .notes-list,
  .notes-content {
    padding: 20px;
  }
}

@media (max-width: $breakpoint-410-max) {
  .notes-list,
  .notes-content {
    padding: 10px;
  }
}
</style>
