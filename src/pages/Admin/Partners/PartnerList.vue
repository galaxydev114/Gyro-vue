<template>
<article>
  <vue-good-table
    ref="partnersTable"
    :columns="columns"
    :rows="partners"
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
        <router-link :to="{ name: 'AdminPartnerEdit', params: { partnerId: props.row.id } }">
          <q-icon name="create" size="24px"/>
        </router-link>
      </div>
    </template>
  </vue-good-table>
</article>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PartnerList',
  components: {
    VueGoodTable
  },
  data: () => ({
    columns: [
      { label: 'Name', field: 'name' },
      { label: 'Slug', field: 'slug' },
      { label: 'Collaborator', field: 'isCollaborator' },
      { label: 'Actions', field: 'actions' }
    ],

    paginationOptions: {
      enabled: true,
      perPage: 10
    }
  }),
  created () {
    this.fetchPartners()
  },
  computed: {
    ...mapState({
      partners: state => Object.values(state.collaborators.collaborators)
    })
  },
  methods: {
    ...mapActions({
      fetchPartners: 'collaborators/getCollaborators'
    })
  }
}
</script>

<style scoped>

</style>
