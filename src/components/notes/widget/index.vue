<template>
  <div class="notes-widget"
      :class="{
        'routine-page-design-mobile': $route.matched.some(r => r.meta.widgetOption === 'routine')
      }"
       v-outside-click="closeWidget">
    <transition name="fade">
      <div class="notes-widget__content" v-show="contentActive">
        <div class="notes-widget__close-btn"
            @click="toggle"
            v-if="!note.createdAt">
          <c-icon icon="closeCircle" width="24px"/>
        </div>
        <!--      Main block-->
        <div class="notes-widget__main"
            :class="{'notes-widget__main--active': !note.createdAt}">
          <div class="text-h3 cursor-clickable" @click="titleClicked">
            My Notes
          </div>
          <div class="notes-widget__search-blk q-mt-md">
            <q-input outlined
                    class="search-field"
                    placeholder="Search notes"
                    v-model="searchQuery"
                    @input="onSearch">
              <template v-slot:prepend>
                <img src="@/assets/icons/search.svg" alt="search icon"/>
              </template>
            </q-input>
            <div class="add-btn" @click="createNote">
              <c-icon icon="plus"/>
            </div>
          </div>
          <div class="notes-widget__list">
            <masonry :cols="$q.screen.xs ? 1 : 2" :gutter="10" class="full-width">
              <div class="notes-widget__list-item notes-widget__note"
                  @click="selectNote(note)"
                  v-for="note in notes"
                  :key="note.id"
                  tabindex="0">
                <div class="flex justify-between items-center q-mb-sm">
                  <div class="opacity-5">
                    {{ humanDate(note.createdAt) }}
                  </div>
                  <div class="cursor-clickable remove-btn" @click.stop="remove(note)">
                    <c-icon icon="trash" class="float-left" width="16px"/>
                  </div>
                </div>
                <div class="text-h5 truncate-text truncate-text--2"
                  v-html="highlightSearchMatch(note).title">
                </div>
                <div class="q-mt-sm text-gray overflow-hidden truncate-text truncate-text--4"
                     v-html="highlightSearchMatch(note).description">
                </div>
              </div>
            </masonry>
          </div>
        </div>
        <!--      New/Edit note-->
        <div class="notes-widget__single"
            :class="{'notes-widget__single--active': note.createdAt}">
          <div class="notes-widget__single-header q-pb-md q-mb-lg q-pr-sm-none">
            <div class="q-mr-md cursor-clickable" @click="exitNote">
              <c-icon icon="leftArrowRounded" class="float-left"/>
            </div>
            <div class="text-gray">
              {{ humanDate(note.createdAt) }}
            </div>
            <div class="q-ml-auto q-gutter-md text-right flex items-center">
              <!-- <div class="cursor-clickable" @click="save">
                <c-icon icon="save" class="float-left"/>
              </div> -->
              <div class="cursor-clickable" @click="remove(note)">
                <c-icon icon="trash" class="float-left"/>
              </div>
              <div class="cursor-clickable" @click="toggle">
                <c-icon icon="closeCircle" class="float-left" width="24px"/>
              </div>
            </div>
          </div>

          <n-editor v-if="isLoaded"
            class="notes-widget__single-content"
            :isFloatingToolbar="$q.screen.gt.xs"
            :title="note.title"
            :content="note.description"
            @titleInput="note.title = $event"
            @change="note.descriptionNew = $event; save()"
          />
        </div>
      </div>
    </transition>
    <q-btn v-show="!contentActive || $q.screen.gt.xs"
           fab class="notes-widget__toggle-btn" @click="toggle"
           data-intercom-target="Notes Widget icon">
      <c-icon icon="notepad"/>
    </q-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMasonry from 'vue-masonry-css'
import { mapActions, mapGetters, mapState } from 'vuex'
import { debounce } from 'quasar'

Vue.use(VueMasonry)

export default {
  components: {
    'n-editor': () => import('@/components/notes/editor')
  },
  data () {
    return {
      notes: [],
      isLoaded: false,
      contentActive: false,
      note: {},
      searchQuery: '',
      saveQueue: new Set(),
      wasNoteEdited: false
    }
  },
  methods: {
    ...mapActions({
      getNotes: 'notes/getNotes',
      createNewNote: 'notes/createNote',
      deleteNote: 'notes/deleteNote',
      undeleteNote: 'notes/undeleteNote',
      updateNote: 'notes/updateNote',
      searchNotes: 'notes/searchNotes'
    }),
    titleClicked () {
      this.contentActive = false
      this.$router.push({ name: 'Notes' }).catch((err) => {
        throw new Error(`Problem handling something: ${err}.`)
      })
    },
    toggle () {
      if (!this.contentActive) {
        this.trackAction('Notepad: Widget: Open notepad')
      }
      this.contentActive = !this.contentActive
    },
    closeWidget (e) {
      if (document.querySelector('.q-notifications').contains(e.target)) {
        // NOTE: WORKAROUND: prevent close if user clicks "undo" button of popup
        return
      }
      this.contentActive = false
      this.wasNoteEdited = false
    },
    createNote: async function () {
      this.trackAction('Notepad: Widget: add note')
      const note = await this.createNewNote({
        title: this.noteContext || 'New note',
        description: null
      })
      this.refreshNotesFromStore()
      this.selectNote(note)
    },
    selectNote (note) {
      this.trackAction('Notepad: Widget: Open note')
      this.note = { ...note }
    },
    exitNote: async function () {
      await this.save()
      this.wasNoteEdited = false
      this.note = {}
      this.refreshNotesFromStore()
    },
    humanDate (date) {
      return this.$date(date).format('DD MMM, YYYY')
    },
    onSearch: debounce(async function (e) {
      this.trackAction('Notepad: Widget: Search note')
      this.notes = await this.searchNotes({ q: e })
    }, 1000),
    highlightSearchMatch (note) {
      const div = document.createElement('div')
      const tags = ['a', 'pre', 'button', 'script', 'iframe']
      let result = note.description
      tags.forEach((tag) => {
        div.innerHTML = result
        const elements = div.getElementsByTagName(tag)
        while (elements[0]) {
          elements[0].parentNode.removeChild(elements[0])
        }
        result = div.innerHTML
      })

      return { ...note, description: result }
      // TODO: wait for product decision on this feature
      // const { matchKey, matchIndex, matchLength } = matchedNote
      // if (!matchKey) return matchedNote

      // const text = matchedNote[matchKey]
      // const before = text.slice(0, matchIndex)
      // const match = text.slice(matchIndex, matchIndex + matchLength)
      // const after = text.slice(matchIndex + matchLength)

      // return {
      //   ...matchedNote,
      //   [matchKey]: `${before}<span class="search-highlight">${match}</span>${after}`
      // }
    },
    remove (note) {
      this.trackAction('Notepad: Widget: Delete note')
      this.deleteNote(note.id)
      this.note = {}
      const notes = this.notes
      this.notes = notes.filter(n => n.id !== note.id)
      this.$q.notify({
        color: 'primary',
        message: `Deleted note: ${note.title}`,
        group: false,
        actions: [{
          label: 'Undo',
          color: 'white',
          handler: () => {
            this.undeleteNote(note.id)
            this.notes.unshift(note)
          }
        }]
      })
    },
    save () {
      if (!this.wasNoteEdited) {
        this.trackAction('Notepad: Widget: Edit note')
        this.wasNoteEdited = true
      }
      return this.updateNote({
        ...this.note,
        description: this.note.descriptionNew || this.note.description
      })
    },
    refreshNotesFromStore () {
      this.notes = this.notesStored
    },
    teardownModalOpenWatchers () {
      window.document.body.classList.remove('widget-open')
    }
  },
  watch: {
    contentActive: async function (val) {
      if (!val) {
        this.teardownModalOpenWatchers()
        return
      }
      window.document.body.classList.add('widget-open')

      // fetch notes
      await this.getNotes()
      this.refreshNotesFromStore()
      this.isLoaded = true
    }
  },
  destroyed () {
    this.teardownModalOpenWatchers()
  },
  computed: {
    ...mapGetters({
      notesStored: 'notes/notes'
    }),
    ...mapState({
      noteContext: state => state.notes.noteContextString
    })
  }
}
</script>

<style lang="scss">
@media (max-width: $breakpoint-xs-max) {
  body.widget-open {
    overflow: hidden;
  }
}
</style>
<style lang="scss" scoped>
.notes-widget {
  $root: &;
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 90;
  @media all and (max-width: $breakpoint-tablet-max) {
    margin: 16px;
    right: 10px;
    bottom: 70px;
    bottom: calc(env(safe-area-inset-bottom) + 70px); // iOS 11+
    bottom: calc(constant(safe-area-inset-bottom) + 70px); // iOS 11
    z-index: 9999;
  }

  @media (max-width: $breakpoint-sm-max) {
    right: 10px;
  }

  * {
    transition: all .3s ease-in-out;
  }

  &__close-btn {
    position: absolute;
    cursor: pointer;
    top: 21px;
    right: 20px;
    z-index: 99;
    @media (max-width: $breakpoint-xs-max) {
      top: 18px;
    }
  }

  &__toggle-btn {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $dark-pink;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
    position: relative;
    @media all and (max-width: $breakpoint-tablet-max) {
      width: 48px;
      height: 48px;
    }

    &:hover {
      cursor: pointer;
      background: lighten($dark-pink, 5);
    }
  }

  &__content {
    $content-height: 440px;
    position: absolute;
    right: 70px;
    bottom: 0;
    box-shadow: 0 0 20px rgba(0, 0, 0, .3);
    border-radius: 12px;
    background: $dark;
    width: 520px;
    height: $content-height;
    transform-origin: bottom right;
    z-index: 999;
    overflow: hidden;

    @media (max-width: $breakpoint-xs-max), (max-height: $content-height + 100px) {
      width: 100%;
      position: fixed;
      right: 0;
      top: 0;
      left: 0;
      height: var(--app-height);
      z-index: -1;
      &--active{
        z-index: 999;
        right: 0;
      }
    }
  }

  &__search-blk {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-field {
      background: $soft-tone;
      flex-basis: calc(100% - 58px);
    }

    .add-btn {
      width: 48px;
      height: 48px;
      background: $dark-pink;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;

      &:hover {
        cursor: pointer;
        background: lighten($dark-pink, 5);
      }
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 100%;
    height: 100%;
    transform: translateX(-100%);
    position: absolute;
    &--active{
      transform: translateX(0);
      position: relative;
    }
  }

  &__list {
    overflow-x: hidden;
    margin: 15px -15px 0 -10px;
    padding-right: 10px;
    display: flex;
    flex-wrap: wrap;
    @media (max-width: $breakpoint-xs-max) {
      max-height: calc(var(--app-height) - 150px);
    }
  }

  &__note {
    width: 100%;
    background: $dark-one;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    padding: 15px 15px 10px;
    margin: 0 0 10px;
    overflow: hidden;

    /deep/ {
      h1, h2, h3, h4, h5{
        font-size: 14px;
        padding: 0 0 5px;
        margin: 0;
      }
      ul{
        padding: 0 0 0 15px;
        margin: 0;
      }
      p {
        margin: 0 0 5px;
        padding: 0;
      }
      pre, a, button, hr{
        display: none!important;
      }
    }

    .remove-btn{
      opacity: 0;
      pointer-events: none;
    }

    &:hover {
      background: $dark-sec;
      cursor: pointer;
      .remove-btn{
        opacity: 1;
        pointer-events: unset;
      }
    }

    /deep/ .search-highlight {
      background-color: $dark-pink;
    }
  }

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
      height: 330px;
      overflow-y: auto;
      white-space: pre-wrap;
      text-align: left;
    }
  }

  .truncate-text{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    &--2{
      -webkit-line-clamp: 2;
    }
    &--4{
      -webkit-line-clamp: 4;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    @media (min-width: $breakpoint-sm-min) {
      transition: opacity .5s, transform .5s, right .5s;
    }
  }
  .fade-leave-active {
    pointer-events: none;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    @media (min-width: $breakpoint-sm-min) {
      transform: scale(0);
      right: 0;
    }
  }
  // Design for look on mobile and routine/session pages
  &.routine-page-design-mobile{
    position: fixed;
    bottom: 27px;
    right: 60px;
    margin: 0;
    #{$root}__toggle-btn{
      border-radius: 6px;
      height: 46px;
      width: 46px;
      @media (min-width: $breakpoint-pc-min) {
        background-color: transparent;
        border: 2px solid $soft-tone;
      }
    }
    @media (max-width: $breakpoint-tablet-max) {
      bottom: 0;
      right: 0;
      margin: 0;
      #{$root}__toggle-btn{
        border-radius:  100% 0 0 0;
        padding: 8px 0 0 8px;
      }
      #{$root}__content{
        bottom: 15px;
        right: 50px;
      }
    }
  }
}
</style>
