<template>
  <article>
    <vue-good-table
      :columns="columns"
      :rows="computedAccessCodesList"
      :pagination-options="paginationOptions"
      :searchOptions="{ enabled: true, placeholder: 'Type to search' }"
    >

      <template slot="table-row" slot-scope="props">
        <div v-if="props.column.field === 'actions'">
          <q-icon name="create" @click="editSpecificAccessCode(props.row)" size="24px" style="cursor:pointer"/>
        </div>
      </template>

    </vue-good-table>
    <c-btn
      class="mt-15 w-100 py-10"
      variant="simple"
      tag="button"
      type="button"
      @click="generateCode"
    >
      Generate Code
    </c-btn>
    <access-code-dialog
      v-if="showDialog"
      title="Create Access Code"
      :currentId="currentId"
      :currentCode="currentCode"
      :currentRole="currentRole"
      @submit="submitChecked"
      @close="modalClosed"
      />
  </article>
</template>

<script>
import { nanoid as uuidv4 } from 'nanoid'
import { mapGetters, mapActions } from 'vuex'
import AccessCodeDialog from '@/components/admin/access-code-dialog'
import { VueGoodTable } from 'vue-good-table'

export default {
  name: 'AccessCodeList',
  components: {
    AccessCodeDialog,
    VueGoodTable
  },
  data () {
    return {
      columns: [
        {
          label: 'ID',
          field: 'id'
        },
        {
          label: 'Unique code',
          field: 'code'
        },
        {
          label: 'Role',
          field: 'role'
        },
        {
          label: 'user Id',
          field: 'userId'
        },
        {
          label: 'Update At',
          field: 'updatedAt'
        },
        {
          label: 'Created At',
          field: 'createdAt'
        },
        {
          label: 'Actions',
          field: 'actions'
        }
      ],
      paginationOptions: {
        enabled: true,
        perPage: 10
      },
      showDialog: false,
      currentId: undefined,
      currentRole: undefined,
      currentCode: undefined
    }
  },

  computed: {
    ...mapGetters('accessCode', {
      accessCodesList: 'accessCodesList'
    }),

    computedAccessCodesList () {
      return this.accessCodesList() ? this.accessCodesList() : []
    }
  },

  created () {
    this.fetchAccessCodes()
  },

  methods: {
    ...mapActions('accessCode', {
      fetchAccessCodes: 'fetchAccessCodes',
      createAccessCode: 'createAccessCode',
      updateAccessCode: 'updateAccessCode'
    }),
    async submitChecked (accessCode) {
      if (!accessCode.id) {
        await this.createAccessCode(accessCode)
        await this.fetchAccessCodes()
      } else {
        await this.updateAccessCode({ id: accessCode.id, data: accessCode })
        await this.fetchAccessCodes()
      }
      this.cleanData()
      this.showDialog = false
    },

    generateCode () {
      this.currentCode = uuidv4()
      this.showDialog = true
    },
    editSpecificAccessCode (row) {
      this.currentId = row.id
      this.currentRole = row.role
      this.currentCode = row.code
      this.showDialog = true
    },
    modalClosed () {
      this.cleanData()
      this.showDialog = false
    },
    cleanData () {
      this.currentId = undefined
      this.currentRole = undefined
      this.currentCode = undefined
    }
  }
}
</script>

<style>

</style>
