<template>
  <n-modal :visible="visible"
    showClose
    size="custom"
    @close="$emit('close')">
    <div class="modal-sent-discord-details relative-position">
      <div class="mask-bg">
      </div>
      <div class="q-py-lg q-px-lg-lg q-px-sm-md q-px-md-lg">
        <div class="text-center q-px-lg-lg q-px-sm-sm">
          <div class="text-white q-px-md-lg q-px-lg-lg q-px-sm-sm font-rift" :class="{'text-h1': !$q.screen.lt.sm, 'text-h2': $q.screen.lt.sm}">
            We’ve sent you a direct message to your discord
          </div>
          <div class="text-gray q-mt-sm">Check your Discord DMs to answer the invite or <a :href="discordLink" target="_blank" class="text-pink">click here</a></div>
          <div class="q-mt-lg-lg q-mt-md-lg q-mt-sm-md q-mt-xs-md">
            <div class="div-discord-sent">
              <img
              :src="discordSentImg"
              :width="'100%'"
              />
            </div>
          </div>
          <div class="gt-xs discord-click">
            <img
              :src="discordSentClickIcon"
              />
          </div>
          <div class="lt-sm q-pr-xl text-right">
            <img
              :src="discordSentPressIcon"
              />
          </div>
        </div>
        <div class="q-pt-lg-md q-pt-md-md q-pt-sm-md q-pt-xs-none q-px-lg-lg q-px-md-sm q-px-sm-none">
          <div class="row justify-center">
            <div class="col-12 col-sm-6 col-md-6 q-py-sm q-pr-md-md q-pr-sm-none">
              <q-btn unelevated
                class="btn-join-fg full-width"
                color="dark-pink"
                @click="$emit('done')"
              >
                Done
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script>
import { mapMutations } from 'vuex'
import discordSentImg from '@/assets/friend-group/discord-sent.png'
import discordSentClickIcon from '@/assets/friend-group/discord-sent-click.svg'
import discordSentPressIcon from '@/assets/friend-group/discord-sent-press.svg'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    discordLink: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      discordSentImg,
      discordSentClickIcon,
      discordSentPressIcon
    }
  },
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  methods: {
    ...mapMutations({
      setJoinFGButtonState: 'user/setJoinFGButtonState'
    })
  }
}
</script>

<style lang="scss">
  .modal-sent-discord-details {
    width: 95vw;
    max-width: 647px;
    .div-discord-sent {
      background-image: url('../../../assets/friend-group/discord-sent.png');
      background-size: contain;
      background-repeat: no-repeat;
      width: 100%;
      min-height: 243px;
      img {
        opacity: 0;
      }
    }
    .discord-click {
      position: absolute;
      right: 20px;
    }
    .mask-bg {
      background-image: url('../../../assets/friend-group/mask-bg.png');
      min-height: 111px;
      position: absolute;
      width: 100%;
    }
    @media screen and (min-width: 361px) and (max-width: $breakpoint-xs-max) {
      width: 100%;
      .div-discord-sent {
        min-height: 150px;
      }
    }
    @media screen and (max-width: 360px) {
      width: 100%;
      .div-discord-sent {
        min-height: 129px;
      }
    }
  }
</style>
