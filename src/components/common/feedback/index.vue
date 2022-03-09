<template>
  <div class="feedback-block text-gray text-left">
    <div class="feedback-block__title text-weight-bold q-mb-sm">
      Feedback and Support
    </div>
    <div class="feedback-block__text">
      Share your feedback, ask questions and stay updated in our Discord
    </div>
    <div>
      <div class="feedback-block__btn q-mt-lg">
        <a
          target="_blank"
          rel="noopener noreferrer"
          :href="discordUrl"
          class="font-rift text-weight-bold text-h5"
          @click="trackAction('Feedback and support: Join discord')"
        >
          Join our discord
        </a>
      </div>
      <c-btn
        class="feedback-block__square_btn"
        @click="openEmailModal"
        size="xs"
      >
        Send email
      </c-btn>
    </div>
    <modal-support-email
      ref="emailModal"
      :visible="isSupportModalVisible"
      :showPageLoader="supportRequestInProgress"
      :defaultEmail="currentUser ? currentUser.email : ''"
      :defaultName="currentUserComputedName"
      @submit="createSupportTicket"
      @close="closeEmailModal"
    />
  </div>
</template>

<script>
import * as api from '@/services/api'
import { socialUrls } from '@/constants'
import { mapGetters } from 'vuex'

export default {
  components: {
    'modal-support-email': () =>
      import('@/components/common/modal/modal-support-email.vue')
  },
  data: () => ({
    isSupportModalVisible: false,
    supportRequestInProgress: false,
    discordUrl: socialUrls.discord
  }),
  computed: {
    ...mapGetters('user', ['currentUser', 'currentUserComputedName'])
  },
  methods: {
    closeEmailModal () {
      this.$refs.emailModal.clearDescription()
      this.isSupportModalVisible = false
    },
    openEmailModal () {
      this.isSupportModalVisible = true
    },
    async createSupportTicket ({ name, email, description }) {
      this.supportRequestInProgress = true
      try {
        await api.createSupportTicket({ userId: this.currentUser.id, name, email, description })
        this.$q.notify({
          type: 'positive',
          message: 'MESSAGE SENT! We wil get back to you within 48 hours.'
        })
        this.closeEmailModal()
      } catch {
        this.$q.notify({
          color: 'negative',
          message: 'Error happened while processing the support request.'
        })
      } finally {
        this.supportRequestInProgress = false
      }
    }
  }
}

</script>

<style lang="scss">
.feedback-block {
  border-radius: 6px;
  background: $soft-tone;
  padding: 30px 60px 30px 60px;
  &__title {
    font-size: 24px;
  }
  &__text {
    font-size: 16px;
  }
  &__btn {
    display: flex;
    a {
      width: 100%;
      background: $dark-pink;
      text-align: center;
      font-family: "rift", sans-serif !important;
      font-size: 18px;
      line-height: 46px;
      color: $light-pink;
      border-radius: 6px;
      text-decoration: none;
      transition: all 0.3s ease-in-out;
      &:hover {
        background: darken($dark-pink, 5%);
      }
    }
  }

  &__square_btn {
    border: 2px solid $light-pink;
    margin-top: 10px;
    button {
      background: $soft-tone;
    }
  }
}
</style>
