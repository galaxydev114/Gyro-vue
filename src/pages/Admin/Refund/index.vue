<template>
  <article class="page">
    <h1>Refund</h1>

    <div class="page-content">
      <section>
        <h2>Refund to a single user</h2>

        <form @submit.prevent="refundSingle">
          <q-input
            clearable
            label="Email"
            color="dark-pink"
            v-model="singleEmail"
          />

          <c-btn
            class="q-mt-lg"
            type="submit"
            :disabled="isWaitingForResult"
          >
            Refund
          </c-btn>
        </form>
      </section>

      <section>
        <h2>Refund to multiple users</h2>

        <form @submit.prevent="refundMultiple">
          <q-file
            label="Select CSV file from disk..."
            outlined
            dense
            color="dark-pink"
            accept=".csv"
            v-model="csvFile"
          />

          <c-btn
            class="q-mt-lg"
            type="submit"
            :disabled="isWaitingForResult"
          >
            Refund
          </c-btn>
        </form>

        <code class="code-example q-mt-lg">
          ! Example of csv
          email
          ihor@novos.gg
          john@novos.gg
          jack@gmail.com
        </code>
      </section>
    </div>

    <section>
      <h2>Processing results</h2>

      <q-spinner size="32px" v-if="isWaitingForResult"/>

      <vue-good-table
        v-show="!isWaitingForResult"
        :columns="resultColumns"
        :rows="resultRows"
      ></vue-good-table>
    </section>
  </article>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'
import { refundByEmail, refundByCsv } from '@/services/api'

export default {
  components: {
    VueGoodTable
  },

  data: () => ({
    singleEmail: '',
    csvFile: null,
    isWaitingForResult: false,
    resultRows: [],
    resultColumns: [
      { label: 'Email', field: 'email' },
      { label: 'Is Success?', field: 'isSuccess' },
      { label: 'Error reason', field: 'error.message' }
    ]
  }),

  methods: {
    async refundSingle () {
      try {
        this.isWaitingForResult = true
        const response = await refundByEmail(this.singleEmail)
        this.singleEmail = ''

        this.resultRows = response.data.results
      } finally {
        this.isWaitingForResult = false
      }
    },

    async refundMultiple () {
      try {
        this.isWaitingForResult = true

        const formData = new FormData()
        formData.append('csv', this.csvFile)
        const response = await refundByCsv(formData)
        this.csvFile = null

        this.resultRows = response.data.results
      } finally {
        this.isWaitingForResult = false
      }
    }
  }
}
</script>

<style scoped>
.page {
  padding-right: 25px;
}

.page-content {
  display: flex;
  justify-content: space-between;
}

.code-example {
  display: block;
  white-space: pre-wrap;
  border: 1px solid white;
  border-radius: 6px;
}
</style>
