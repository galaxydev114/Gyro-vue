<template>
<article>
  <h1>Here you can test notifications</h1>

  <p>
    Type in the form below discord id or email (or both if you wish). <br>
    Magic "Send" button will send exact same messages and emails to desired user <br>
    <br>
    If you press "Execute full notifications logic", you will start the whole flow, but the only difference that YOU will start it and not internal job at some time
  </p>

  <q-card class="form-card">
    <q-input
      class="form-card__item"
      v-model="discordId"
      outlined
      placeholder="Discord ID: (##################)"
      mask="##################"
    />

    <q-input
      class="form-card__item"
      v-model="email"
      outlined
      placeholder="Email"
    />

    <c-btn class="form-card__item" @click="sendRequest">Send</c-btn>
    <c-btn outline @click="sendExecuteFullRequest">Execute full notifications logic</c-btn>
  </q-card>
</article>
</template>

<script>
import * as api from '@/services/api'

export default {
  data: () => ({
    discordId: null,
    email: null
  }),

  methods: {
    sendRequest () {
      api.testNotifications({ discordId: this.discordId, email: this.email })
    },

    sendExecuteFullRequest () {
      api.testNotifications({ shouldRunFullFlow: true })
    }
  }
}
</script>

<style scoped>
.form-card {
  width: 100%;
  max-width: 300px;
}
.form-card__item {
  margin: 10px 0;
}
</style>
