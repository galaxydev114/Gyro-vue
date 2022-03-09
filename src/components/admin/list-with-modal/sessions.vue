<template>
  <div>
    {{title}}
    <div class="objectives-list">
      <draggable v-model="computedInternalElements">
          <div
            v-for="element of computedInternalElements"
            :key="element.id"
            class="objectives-list__item"
          >
            <div class="info p-10">
              <router-link :to="{
                  name: 'SessionEdit',
                  params: { sessionId: element.id }
                }">
                <div class="h4 fw-700">{{ element.title }}</div>
                <div class="w-100 fs-14" style="color: #666">{{ element.id }}</div>
              </router-link>
            </div>

            <div class="badge fs-12 fw-600">{{ element.duration | minutesToString }}</div>

            <c-btn
              variant="simple"
              tag="button"
              type="button"
              bg="f50"
              color="fff"
              class="py-25 px-30"
              @click="removeSession(element.id)"
            >
              <q-icon name="delete" class="mr-15" color="dark-pink" size="24px"/>Remove
            </c-btn>
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

    <sessions-manager-dialog
      v-if="showDialog"
      title="Manage sessions"
      tableRef="sessionsTable"
      rowFieldToShow="title"
      :columns="columns"
      :rows="rows"
      :mapSelectedRow="mapSelectedRow"
      @submit="submitChecked"
      @close="() => showDialog = false"
    />
  </div>
</template>

<script>
import SessionsManagerDialog from '@/components/admin/Items-manager-dialog'
import draggable from 'vuedraggable'

export default {
  name: 'n-list-with-modal',
  components: {
    SessionsManagerDialog,
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
    },
    columns: {
      type: Array,
      default: () => []
    },
    rows: {
      type: Array,
      default: () => []
    },
    mapSelectedRow: {
      type: Function,
      default: (el) => el
    }
  },
  data () {
    return {
      elements: this.value,
      showDialog: false
    }
  },
  computed: {
    computedInternalElements: {
      get: function () {
        return this.value.filter((el) => !!el)
      },
      set: function (newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  methods: {
    submitChecked (sessions) {
      this.computedInternalElements = [
        ...this.computedInternalElements,
        ...sessions
      ]
      this.showDialog = false
    },
    removeSession (id) {
      this.computedInternalElements = this.computedInternalElements.filter(el => el?.id !== id)
    }
  },
  filters: {
    minutesToString: value => {
      if (!value) return ''

      const hours = Math.floor(value / 60)
      const minutes = value % 60
      return hours + ':' + (minutes < 10 ? '0' : '') + minutes
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
