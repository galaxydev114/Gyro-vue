<template>
  <article>
    <h1>Pretend as user</h1>

    <q-input outlined v-model="searchTerm" label="Search"/>

    <vue-good-table
      class="q-mt-lg"
      :columns="columns"
      :rows="rows"
      :searchOptions="{
        enabled: true,
        skipDiacritics: true,
        placeholder: 'Type to search',
        externalQuery: searchTerm,
      }"
    >
      <template v-slot:table-row="props">
        <div v-if="props.column.field === 'actions'">
          <q-btn @click="() => startSession(props.row.id)">Start session</q-btn>
        </div>
      </template>
    </vue-good-table>

  </article>
</template>

<script>
import * as api from '@/services/api'
import { VueGoodTable } from 'vue-good-table'
import { debounce } from 'quasar'

export default {
  name: 'index',

  components: {
    VueGoodTable
  },

  data: () => ({
    searchTerm: '',
    columns: [
      {
        label: 'ID',
        field: 'id'
      },
      {
        label: 'Email',
        field: 'email'
      },
      {
        label: 'Actions',
        field: 'actions'
      }
    ],
    rows: []
  }),

  created () {
    this.searchForUser = debounce(this.searchForUser, 700)
  },

  methods: {
    async startSession (userId) {
      const response = (await api.loginAsPretendedUser(userId)).data
      const pretendedWindow = window.open(`${window.origin}/training-plan`)
      pretendedWindow.sessionStorage.setItem('userId', response.userId)
      pretendedWindow.sessionStorage.setItem('userToken', response.token)
    },

    async searchForUser (searchTerm) {
      const response = await api.searchUsers(searchTerm)
      this.rows = response.data.users
    }
  },

  watch: {
    searchTerm: function (value) {
      if (value === '') {
        this.rows = []
        return
      }
      this.searchForUser(value)
    }
  }
}
</script>

<style scoped>

</style>
