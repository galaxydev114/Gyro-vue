<template>
  <div class="modals" @click.self="$emit('close')">
    <div class="modals__dialog">

      <div class="mb-10 d-flex">
        <h3 style="color:black">{{title}}</h3>
        <c-icon
          class="ml-auto modals__close"
          icon="times"
          @click="$emit('close')"
        />
      </div>

      <div class="grid">
        <div class="grid__column popup-table">
          <vue-good-table
            :ref="tableRef"
            :columns="columns"
            :rows="rows"
            max-height="400px"
            :selectOptions="tableOptions.selectOptions"
            :paginationOptions="tableOptions.paginationOptions"
            :searchOptions="tableOptions.searchOptions"
          />

          <c-btn
            class="mt-15 w-100 py-10"
            variant="simple"
            tag="button"
            type="button"
            @click="pushCheckedItem"
          >
            Add
          </c-btn>
        </div>

        <div class="grid__column">
          <ul class="modals__list-to-submit">
            <li
              v-for="item of checkedItems"
              :key="item.id"
              @click="removeCheckedItem(item)"
              style="color:black"
            >
              {{item[rowFieldToShow]}}
            </li>
          </ul>

          <c-btn
            class="mt-15 w-100 py-10"
            variant="simple"
            tag="button"
            type="button"
            @click="submit"
          >
            Submit
          </c-btn>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'

export default {
  components: {
    VueGoodTable
  },

  props: {
    title: {
      type: String,
      required: true
    },
    tableRef: {
      type: String,
      required: true
    },
    rowFieldToShow: {
      type: String,
      required: true
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

  data: () => ({
    tableOptions: {
      selectOptions: { enabled: true },
      paginationOptions: { enabled: true },
      searchOptions: { enabled: true, placeholder: 'Type to search' }
    },

    checkedItems: []
  }),

  methods: {
    pushCheckedItem () {
      const items = [
        ...this.checkedItems,
        ...this.$refs[this.tableRef].selectedRows.map(this.mapSelectedRow)
      ]

      this.checkedItems = items

      // Reset all checked rows of the table
      this.$refs[this.tableRef].unselectAllInternal()
    },

    removeCheckedItem (item) {
      this.checkedItems = this.checkedItems.filter(_item => _item.id !== item.id)
    },

    submit () {
      this.$emit('submit', [...this.checkedItems])
      this.checkedItems = []
    }
  }
}
</script>

<style lang="scss" scoped>
  .modals {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .7);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 99;

    &__close {
      cursor: pointer;
    }

    &__dialog{
      width: 90%;
      max-width: 90%;
      padding: 20px;
      border-radius: 10px;
      background: rgba(116, 124, 152, .7);
      box-shadow: 0 0 10px #000;
    }

    &__list-to-submit {
      max-height: 500px;
      overflow-y: auto;
      margin: 0;
    }
  }

  .grid {
    height: '600px';
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;

    &__column {
      display: grid;
      grid-template-rows: 1fr 60px;
    }
  }
</style>
