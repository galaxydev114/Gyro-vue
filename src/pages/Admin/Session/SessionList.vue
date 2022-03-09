<template>
  <article>
    <vue-good-table
      :columns="columns"
      :rows="sessions"
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
            name: 'SessionEdit',
            params: { sessionId: props.row.id }
          }">
            <q-icon name="create" size="24px"/>
          </router-link>
          <router-link v-if="isAdmin" :to="{
            name: 'SessionEdit',
            params: { sessionId: props.row.id},
            query: { duplicate: true }
          }">
            <q-icon name="content_copy" size="24px"/>
          </router-link>
          <q-icon style="cursor:pointer" v-if="isAdmin" @click="deleteCurrentSession(props.row.id)" name="delete" size="24px"/>
          <q-icon v-if="isValidMuxSource(props.row.videoUrl)"
            name="video_library" size="24px"
            title="Upgrade video to Mux"
            style="cursor:pointer"
            @click="() => upgradeToMux('session', props.row).then(fetchAllSessions)"/>
          <q-icon v-else-if="isMux(props.row.videoUrl)"
            name="video_library" size="24px"
            title="Already using Mux Video 😀"
            color="green" />
        </div>
      </template>

    </vue-good-table>
  </article>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { VueGoodTable } from 'vue-good-table'
import upgradeToMuxMixin from '@/mixins/upgradeToMux.mixin'

export default {
  components: {
    VueGoodTable
  },
  mixins: [upgradeToMuxMixin],

  data () {
    return {
      columns: [
        {
          label: 'ID',
          field: 'id'
        },
        {
          label: 'Title',
          field: 'title'
        },
        {
          label: 'Approved by',
          field: 'approvedBy'
        },
        {
          label: 'Difficulty',
          field: 'difficulty'
        },
        {
          label: 'Category',
          field: 'type'
        },
        {
          label: 'Map Code',
          field: 'map.mapCode'
        },
        {
          label: 'Related Routines',
          field: this.castRelatedRoutines,
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Created At',
          field: 'createdAt'
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
    ...mapState('session', {
      sessions: state => Object.values(state.sessions)
    })
  },

  created () {
    this.fetchAllSessions()
  },

  methods: {
    ...mapActions('session', {
      fetchAllSessions: 'fetchAllSessions',
      deleteSession: 'deleteSession'
    }),
    async deleteCurrentSession (sessionId) {
      if (!window.confirm('Delete?')) return
      await this.deleteSession(sessionId)
      await this.fetchAllSessions()
    },
    castRelatedRoutines (obj) {
      if (obj.relatedRoutines) {
        return Object.values(obj.relatedRoutines)
      } else {
        return 'undefined'
      }
    }
  }
}
</script>

<style>

</style>
