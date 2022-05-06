<template>
<div class="modals" @click.self="$emit('close')">
  <div class="modals__dialog">

    <div class="mb-10 d-flex">
      <h3 style="color:black">{{title}}</h3>
    </div>
    <vue-good-table
      ref="friendGroupsTable"
      :columns="columns"
      :rows="computedFriendGroups"
      :pagination-options="paginationOptions"
      :searchOptions="{
                      enabled: true,
                      placeholder: 'Type to search',
                      skipDiacritics: true
                      }"
      >
      <template v-slot:table-row="props">
        <div v-if="props.column.field === 'actions'">
          <q-icon name="done" style="cursor:pointer" @click="submit(props.row.id)" size="24px"/>
        </div>
        <div v-else-if="props.column.field.includes('criteria')">
          <span :style="checkMatch(props.row, props.column.field) ? { 'font-weight': 'bold' } : {}">
            {{props.row.criteria[props.column.field.split('.')[1]]}}
          </span>
        </div>
      </template>
    </vue-good-table>
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
    application: {
      type: Object,
      required: true
    },
    currentFriendGroup: {
      type: Object
    },
    friendGroups: {
      type: Array
    }
  },
  data () {
    return {
      friendGroup: null,
      columnsToCrosscheck: ['league', 'platform', 'availability', 'language', 'region'],
      columns: [
        { label: 'Name', field: 'name', filterOptions: { enabled: true } },
        { label: 'League', field: 'criteria.league', filterOptions: { enabled: true } },
        { label: 'Platform', field: 'criteria.platform', filterOptions: { enabled: true } },
        { label: 'Availability', field: 'criteria.availability', filterOptions: { enabled: true } },
        { label: 'Language', field: 'criteria.language', filterOptions: { enabled: true } },
        { label: 'Region', field: 'criteria.region', filterOptions: { enabled: true } },
        { label: 'Skill Scores', field: 'skillScoreRange', filterOptions: { enabled: true } },
        { label: 'Applications Count', field: 'applicationsCount' },
        { label: 'Actions', field: 'actions' }
      ],
      paginationOptions: {
        enabled: true,
        perPage: 5
      }
    }
  },
  computed: {
    computedFriendGroups () {
      return this.friendGroups.reduce((acc, fg) => {
        if (fg.id === this.currentFriendGroup?.id) return acc
        fg.matches = 0
        for (const column of this.columnsToCrosscheck) {
          if (this.checkMatch(fg, column)) fg.matches += 1
        }
        fg.skillScoreRange = `${fg.criteria.skillScoreMin}-${fg.criteria.skillScoreMax}`
        acc.push(fg)
        return acc
      }, []).sort((a, b) => b.matches - a.matches)
    }
  },
  methods: {
    checkMatch (friendGroup, field) {
      if (field.includes('criteria')) field = field.split('.')[1]
      return (
        friendGroup.criteria[field] === this.application[field] ||
          (
            Array.isArray(this.application[field]) &&
              this.application[field].includes(friendGroup.criteria[field])
          )
      )
    },
    submit (friendGroupId) {
      this.$emit('submit', {
        applicationId: this.application.id,
        friendGroupId
      })
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
      width: 1200px;
      max-width: 80%;
      padding: 20px;
      border-radius: 10px;
      background: rgba(116, 124, 152, .7);
      box-shadow: 0 0 10px #000;
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
