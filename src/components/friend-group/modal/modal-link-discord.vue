<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    @close="$emit('close')">
    <div class="modal-discord-details relative-position">
      <div class="q-py-lg q-px-lg-lg q-px-sm-md q-px-md-lg">
        <div class="text-center q-px-lg-md q-px-sm-sm">
          <div class="q-mt-sm q-px-md">
            <img
              :src="discordLinkIcon"
              :width="151"
              :height="80"/>
          </div>
          <div class="q-px-sm q-my-lg text-h4">
            <span class="text-pink font-rift">FRIEND GROUP</span>
          </div>
          <div class="text-white q-px-sm" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
            Link your discord account to join a friends group
          </div>
          <div class="q-px-sm q-mt-lg text-h5 text-weight-regular text-gray-violet">
            This will help us match you with the right group
          </div>
        </div>
        <div class="q-pt-md q-px-lg-lg q-px-md-sm q-px-sm-none">
          <div class="q-mt-md row justify-end">
            <div class="col-12 q-py-sm q-pr-md-md q-pr-sm-none">
              <c-btn outline
                class="btn-join-fg full-width"
                color="light-pink"
                :bold="false"
                @click="linkDiscord()"
              >
                <c-icon class="q-mr-sm" :icon="'discord'" :width="'20px'" />
                Link Discord Account
              </c-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>
import discordLinkIcon from '@/assets/friend-group/discord-link.svg'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    linkDiscordUrl: {
      type: URL,
      default: null
    }
  },
  data () {
    return {
      discordLinkIcon
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  methods: {
    linkDiscord () {
      if (this.linkDiscordUrl) {
        location.href = this.linkDiscordUrl
      }
    }
  }
}
</script>

<style lang="scss">
  .modal-discord-details {
    width: 85vw;
    max-width: 600px;
    .text-gray-violet {
      color: $gray-violet;
      font-weight: 400;
      font-size: 16px;
      font-family: 'Roboto';
    }
    @media screen and (max-width: $breakpoint-xs-max) {
      width: 100%;
    }
  }
</style>
