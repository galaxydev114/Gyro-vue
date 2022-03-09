<template>
  <div>
    {{title}}
    <div class="objectives-list">
      <draggable v-model="computedInternalElements">
          <div
            v-for="(element, i) of computedInternalElements"
            :key="i"
            class="objectives-list__item"
          >
            <div class="info p-10">
              <div class="h4 fw-700" v-html="element"></div>
            </div>

            <div>
              <c-btn
                variant="simple"
                tag="button"
                type="button"
                bg="f50"
                color="fff"
                class="py-25 px-30"
                @click="editNote(element, i)"
              >
                <q-icon name="edit"/> Edit
              </c-btn>

              <c-btn
                variant="simple"
                tag="button"
                type="button"
                bg="f50"
                color="fff"
                class="py-25 px-30"
                @click="removeNote(i)"
              >
                <q-icon name="delete" class="mr-15" color="dark-pink" size="24px"/>Remove
              </c-btn>
            </div>
          </div>
      </draggable>
    </div>

    <c-btn
      variant="simple"
      tag="button"
      type="button"
      @click="showDialog = !showDialog"
      class="w-100 text-center py-10"
    >+ Add</c-btn>

    <notes-create-dialog
      v-if="showDialog"
      title="Create Notes"
      :initialNote="noteToEdit"
      @submit="submitChecked"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import NotesCreateDialog from '@/components/admin/notes-create-dialog'
import draggable from 'vuedraggable'

export default {
  name: 'n-list-with-modal',
  components: {
    NotesCreateDialog,
    draggable
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showDialog: false,
      noteToEdit: null,
      notePosition: null
    }
  },
  computed: {
    computedInternalElements: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  methods: {
    submitChecked (note) {
      if (this.notePosition !== null) {
        this.computedInternalElements.splice(this.notePosition, 1, note)
      } else {
        this.computedInternalElements = [
          ...this.computedInternalElements,
          note
        ]
      }
      this.closeDialog()
    },

    removeNote (index) {
      this.computedInternalElements = this.computedInternalElements.filter((el, i) => i !== index)
    },

    editNote (note, index) {
      this.noteToEdit = note
      this.notePosition = index
      this.showDialog = true
    },

    closeDialog () {
      this.showDialog = false
      this.noteToEdit = null
      this.notePosition = null
    }
  }
}
</script>

<style lang="scss">
.objectives-list {
  padding: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 5px 5px 0 0;
  max-height: 70vh;
  overflow-y: auto;

  &__item {
    color: black;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width: 100%;
    background: #f4f4f4;
    margin-bottom: 10px;
    .badge {
      margin: 0 15px 0 auto;
      background: $purple;
      color: #fff;
      padding: 5px 10px;
      border-radius: 20px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
