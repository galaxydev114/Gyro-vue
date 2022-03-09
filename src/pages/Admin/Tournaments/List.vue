<template>
  <article>
    <vue-good-table
      :columns="columns"
      :rows="tournaments"
      :pagination-options="paginationOptions"
      :searchOptions="{
        enabled: true,
        placeholder: 'Type to search',
        skipDiacritics: true
         }"
    >

      <template slot="table-row" slot-scope="props">
        <div v-if="props.column.field === 'actions'">
          <router-link :to="{
            name: 'TournamentEdit',
            params: { id: props.row.eventId + props.row.eventWindowId }
          }">
            <q-icon name="create" size="24px"/>
          </router-link>
          <router-link v-if="isAdmin" :to="{
            name: 'TournamentEdit',
            params: { id: props.row.eventId + props.row.eventWindowId },
            query: { duplicate: true }
          }">
            <q-icon name="content_copy" size="24px"/>
          </router-link>
        </div>
      </template>

    </vue-good-table>
  </article>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { VueGoodTable } from 'vue-good-table'

export default {
  components: {
    VueGoodTable
  },

  data () {
    return {
      columns: [
        {
          label: 'Title',
          field: 'title'
        },
        {
          label: 'Start At',
          field: 'startAt'
        },
        {
          label: 'End At',
          field: 'endAt'
        },
        {
          label: 'Regions',
          field: 'regions'
        },
        {
          label: 'Platforms',
          field: 'platforms'
        },
        {
          label: 'Mode',
          field: 'mode'
        },
        {
          label: 'Requirements',
          field: 'requirements'
        },
        {
          label: 'Updated At',
          field: 'updatedAt'
        },
        {
          label: 'Actions',
          field: 'actions'
        }
      ],
      paginationOptions: {
        enabled: true,
        perPage: 10
      }
    }
  },

  computed: {
    ...mapGetters('user', {
      isAdmin: 'isAdmin'
    }),
    ...mapState('tournaments', {
      tournaments: state => Object.values(state.tournaments)
    })
  },

  created () {
    this.fetchAllTournaments()
  },

  methods: {
    ...mapActions('tournaments', {
      fetchAllTournaments: 'getTournamentsAdminList'
    })
  }
}
</script>

<style>

</style>
