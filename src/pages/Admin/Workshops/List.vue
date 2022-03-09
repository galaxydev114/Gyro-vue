<template>
  <article>
    <vue-good-table
      :columns="columns"
      :rows="allWorkshops"
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
            name: 'WorkshopEdit',
            params: { workshopId: props.row.id }
          }">
            <q-icon name="create" size="24px"/>
          </router-link>
          <q-icon style="cursor:pointer" v-if="isAdmin" @click="deleteSpecificWorkshop(props.row.id)" name="delete" size="24px"/>
          <q-icon v-if="isValidMuxSource(props.row.videoUrl)"
            name="video_library" size="24px"
            title="Upgrade video to Mux"
            style="cursor:pointer"
            @click="() => upgradeToMux('workshop', props.row).then(getAdminAllWorkshops)"/>
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
          label: 'Video URL',
          field: 'videoUrl'
        },
        {
          label: 'Category',
          field: 'category'
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
          label: 'Is Published',
          field: this.castIsPublishedToString,
          filterOptions: {
            enabled: true
          }
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
    ...mapState('workshops', {
      allWorkshops: state => Object.values(state.allAdminWorkshops)
    })
  },

  created () {
    this.getAdminAllWorkshops()
  },

  methods: {
    ...mapActions('workshops', {
      getAdminAllWorkshops: 'getAllAdminWorkshops',
      deleteWorkshop: 'deleteWorkshop'
    }),
    async deleteSpecificWorkshop (workshopId) {
      if (!window.confirm('Delete?')) return
      await this.deleteWorkshop(workshopId)
      await this.getAdminAllWorkshops()
    },
    castIsPublishedToString (obj) {
      return String(obj.isPublished)
    }
  }
}
</script>

<style>

</style>
