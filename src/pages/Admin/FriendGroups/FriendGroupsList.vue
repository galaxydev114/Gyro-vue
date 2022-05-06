<template>
<article>
  <div class="row">
      <c-btn
        class="mt-15 w-100 py-10"
        variant="simple"
        tag="button"
        type="button"
        @click="isCreateEventVisible=true"
      >
        Create event
      </c-btn>
  </div>
  <vue-good-table
    ref="friendGroupsTable"
    :columns="columns"
    :rows="friendGroups"
    :pagination-options="paginationOptions"
    :select-options="{ enabled: true }"
    @on-selected-rows-change="selectionChanged"
    :searchOptions="{
      enabled: true,
      placeholder: 'Type to search',
        skipDiacritics: true
      }"
    >

    <template v-slot:table-row="props">
      <div v-if="props.column.field === 'actions'">
      </div>
    </template>
  </vue-good-table>
  <q-dialog :value="isCreateEventVisible" @input="closeCreateFgEventModal">
    <q-card class="card">
      <q-card-section class="row items-center">
        <q-space />
        <c-icon
          icon="closeCircle"
          role="button"
          tabindex="0"
          @click="closeCreateFgEventModal" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>{{`We are going to create event:`}}</div>
        <div>{{`Earliest date: ${fgEventParams.earliestDate.toISOString()}`}}</div>
        <div>{{`Latest date:${fgEventParams.latestDate.toISOString()}`}}</div>
        <div>{{JSON.stringify(selectedFriendGroups)}}</div>
        <q-input
            clearable
            label="Routine Id"
            :rules="[value => Boolean(value) || 'RoutineId required']"
            v-model="fgEventRoutineId"
          />
      </q-card-section>

      <q-card-actions align="right">
        <c-btn @click="createFgEvent">
          Create
        </c-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</article>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'
import { mapActions, mapState } from 'vuex'
import dayjs from 'dayjs'
import { createFGEvent } from '@/services/api'

export default {
  name: 'FriendGroupList',
  components: {
    VueGoodTable
  },
  data: () => ({
    isCreateEventVisible: false,
    selectedFriendGroups: [],
    fgEventRoutineId: null,
    fgEventParams: {
      earliestDate: dayjs().add(1, 'day'),
      latestDate: dayjs().add(2, 'day')
    },
    columns: [
      { label: 'Name', field: 'name', filterOptions: { enabled: true } },
      { label: 'League', field: 'criteria.league', filterOptions: { enabled: true } },
      { label: 'Platform', field: 'criteria.platform', filterOptions: { enabled: true } },
      { label: 'Availability', field: 'criteria.availability', filterOptions: { enabled: true } },
      { label: 'Language', field: 'criteria.language', filterOptions: { enabled: true } },
      { label: 'Region', field: 'criteria.region', filterOptions: { enabled: true } },
      { label: 'Skill Scores', field: 'skillScoreRange', filterOptions: { enabled: true } },
      { label: 'Applications Count', field: 'applicationsCount' }
    ],

    paginationOptions: {
      enabled: true,
      perPage: 10
    }
  }),
  created () {
    this.fetchFriendGroups()
  },
  computed: {
    ...mapState({
      friendGroups: state => Object.values(state.friendGroups.friendGroups).map(el => {
        el.skillScoreRange = `${el.criteria.skillScoreMin}-${el.criteria.skillScoreMax}`
        return el
      })
    })
  },
  methods: {
    ...mapActions({
      fetchFriendGroups: 'friendGroups/getFriendGroups'
    }),
    async createFgEvent () {
      try {
        await createFGEvent({
          trainingRoutineId: this.fgEventRoutineId,
          earliestDate: this.fgEventParams.earliestDate,
          latestDate: this.fgEventParams.latestDate,
          friendGroupIds: this.selectedFriendGroups
        })
        this.$q.notify({
          type: 'positive',
          message: 'Created!'
        })
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: 'Oops! Failed :('
        })
      }
      this.closeCreateFgEventModal()
    },
    selectionChanged ({ selectedRows }) {
      this.selectedFriendGroups = selectedRows.map(row => row.id)
    },
    closeCreateFgEventModal () {
      this.isCreateEventVisible = false
    }
  }
}
</script>

<style scoped>
.card {
  min-width: 200px;
  width: fit-content;
  color: #fff;
  background: #424242;
  background: var(--q-color-dark);
}
</style>
