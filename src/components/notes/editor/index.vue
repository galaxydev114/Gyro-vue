<template>
  <div class="editor">
    <q-input autogrow borderless dense dark
      ref="titleInput"
      class="editor-title q-mb-sm"
      input-style="font-size: 24px; line-height: 28px; font-weight: bold; padding-top: 0;"
      :value="title"
      @input="$emit('titleInput', $event)"
      @keydown.native.down="switchToEditor"
    />
    <editor-content class="editor__content" :editor="editor"
      @keydown.native.up="switchToTitleInput"
    />

    <!-- Toolbar -->
    <component :is="isFloatingToolbar ? 'editor-menu-bubble' : 'editor-menu-bar'"
      :editor="editor"
      :keep-in-bounds="keepInBounds"
      v-slot="{ commands, isActive, menu }"
    >
      <div
        :class="{
          'menububble': isFloatingToolbar,
          'is-active': isFloatingToolbar && menu.isActive
        }"
        :style="{
          'left': isFloatingToolbar ? `${menu.left}px` : 'initial',
          'bottom': isFloatingToolbar ? `${menu.bottom}px` : 'initial'
        }"
      >

        <q-btn-dropdown
          flat
          dense
          :label="dropdownLabel"
          menu-anchor="bottom left"
          menu-self="top left"
          class="editor-menu__dropdown"
          content-style="z-index: 999999"
          size="md"
        >
          <q-list class="editor-menu__dropdown-list">
            <q-item v-for="(item, index) in dropdownOptions" :key="index"
                    :class="{ 'is-active': item.isActive(isActive) }"
                    @click.native.stop="item.onSelect(commands)"
                    clickable v-close-popup
            >
              <q-item-section>{{item.label}}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <q-icon name="format_list_bulleted" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <q-icon name="format_bold" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <q-icon name="format_italic" />
        </button>

      </div>
    </component>

  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBubble, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  BulletList,
  CodeBlock,
  HardBreak,
  Heading,
  ListItem,
  OrderedList,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Placeholder
} from 'tiptap-extensions'
import { debounce } from 'quasar'

export default {
  components: {
    EditorContent,
    EditorMenuBubble,
    EditorMenuBar
  },
  props: {
    title: {
      type: String,
      default: 'New note'
    },
    content: {
      type: String,
      default: ''
    },
    isFloatingToolbar: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      keepInBounds: true,
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Enter your note here',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          })
        ],
        content: this.content,
        onUpdate: debounce(({ getHTML }) => {
          this.$emit('change', getHTML())
        }, 500)
      })
    }
  },
  computed: {
    dropdownLabel () {
      return this.dropdownOptions.find(item => item.isActive(this.isActive))?.label
    },
    dropdownOptions () {
      return [
        {
          label: 'Heading 1',
          previewClass: 'h1',
          isActive: isActive => isActive?.heading({ level: 1 }),
          onSelect: commands => commands.heading({ level: 1 })
        },
        {
          label: 'Heading 2',
          previewClass: 'h2',
          isActive: isActive => isActive?.heading({ level: 2 }),
          onSelect: commands => commands.heading({ level: 2 })
        },
        {
          label: 'Heading 3',
          previewClass: 'h3',
          isActive: isActive => isActive?.heading({ level: 3 }),
          onSelect: commands => commands.heading({ level: 3 })
        },
        {
          label: 'Body Medium',
          isActive: isActive => isActive?.paragraph(),
          onSelect: commands => commands.paragraph()
        }
      ]
    }
  },
  methods: {
    onStyleSelect (e) {
      const dropdownOptionIdx = e.target[e.target.selectedIndex].dataset.optionIndex
      return this.dropdownOptions[dropdownOptionIdx]?.onSelect()
    },
    switchToEditor (e) {
      if (e.target.selectionStart === e.target.value.length) {
        this.editor.focus()
      }
    },
    switchToTitleInput () {
      if (this.editor.selection.to === 1) {
        this.$refs.titleInput.focus()
      }
    }
  },
  watch: {
    content (val) {
      this.editor.setContent(val)
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style lang="scss">
@import "@/css/tiptap/main.scss";

.editor {
  padding-left: 5px;
  overflow-y: auto;

  .menububble__button{
    align-items: center;
  }

  &-title {
    min-height: initial;
  }

  &-menu {
    height: 48px;

    &__dropdown {
      /deep/ .q-btn__wrapper {
        padding: 0;
        line-height: 12px;
      }
      &-list .is-active {
        color: $dark-pink;
      }
    }
  }

  p.is-editor-empty::before {
    content: attr(data-empty-text);
    float: left;
    color: $gray;
    pointer-events: none;
    height: 0;
  }

  a {
    color: $dark-pink;
    font-weight: bold;
  }
}
</style>
