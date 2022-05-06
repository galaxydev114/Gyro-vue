<template>
<article>
  <vue-good-table
    ref="partnersTable"
    :columns="columns"
    :rows="applications"
    :pagination-options="paginationOptions"
    :select-options="{ enabled: true }"
    :searchOptions="{
                    enabled: true,
                    placeholder: 'Type to search',
                    skipDiacritics: true
                    }"
    >
    <template v-slot:table-row="props">
      <div v-if="props.column.field === 'actions'">
        <q-icon style="cursor:pointer" @click="changeUserFriendGroupApplication(props.row)" name="create" size="24px"/>
        <q-icon style="cursor:pointer" @click="deleteCurrentApplication(props.row.user.id)" name="delete" size="24px"/>
      </div>
    </template>
  </vue-good-table>
  <friend-group-dialog
    v-if="showDialog"
    title="Select a Friend Group for User"
    :application="currentApplication"
    :currentFriendGroup="currentFriendGroup"
    :friendGroups="friendGroups"
    @submit="submitApplication"
    @close="modalClosed"
    />
</article>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'
import { mapActions, mapState } from 'vuex'
import FriendGroupDialog from '@/components/admin/friend-group-dialog'

export default {
  name: 'UserFriendGroupApplicationsList',
  components: {
    VueGoodTable,
    FriendGroupDialog
  },
  data: () => ({
    columns: [
      { label: 'User', field: 'user.email' },
      { label: 'Friends\' Group', field: 'friendGroup.name' },
      { label: 'Status', field: 'processingStatus', filterOptions: { enabled: true } },
      { label: 'League', field: 'league', filterOptions: { enabled: true } },
      { label: 'Platform', field: 'platform', filterOptions: { enabled: true } },
      { label: 'Availability', field: 'availability', filterOptions: { enabled: true } },
      { label: 'Language', field: 'language', filterOptions: { enabled: true } },
      { label: 'Region', field: 'region', filterOptions: { enabled: true } },
      { label: 'Joined', field: 'joinedAt' },
      { label: 'Last Activity', field: 'lasTimeActive' },
      { label: 'Actions', field: 'actions' }
    ],

    paginationOptions: {
      enabled: true,
      perPage: 10
    },
    showDialog: false,
    currentUser: null,
    currentFriendGroup: null
  }),
  created () {
    this.fetchApplications()
  },
  computed: {
    ...mapState({
      applications: state => Object.values(state.friendGroups.applications),
      friendGroups: state => Object.values(state.friendGroups.friendGroups)
    })
  },
  methods: {
    ...mapActions({
      fetchFriendGroups: 'friendGroups/getFriendGroups',
      fetchApplications: 'friendGroups/getApplications',
      updateApplication: 'friendGroups/updateApplication',
      deleteApplication: 'user/leaveFriendGroup'
    }),
    async deleteCurrentApplication (userId) {
      if (!window.confirm('Remove the user from Friends\' Group?')) return
      await this.deleteApplication(userId)
      await this.fetchApplications()
    },
    async changeUserFriendGroupApplication (row) {
      this.currentApplication = row
      this.currentFriendGroup = row.friendGroup
      this.modalFriendGroups = await this.fetchFriendGroups()
      this.showDialog = true
    },
    async submitApplication (data) {
      await this.updateApplication(data)
      this.showDialog = false
      await this.fetchApplications()
    },
    modalClosed () {
      this.cleanData()
      this.showDialog = false
    },
    clearData () {
      this.currentApplication = null
      this.currentFriendGroup = null
    }
  }
}
</script>

<style scoped>

</style>
